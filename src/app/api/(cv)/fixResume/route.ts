import { constants } from "@/constants";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export const maxDuration = 60;

// Request validation schema
const fixResumeSchema = z.object({
  cvText: z.string().min(1, "CV text is required").max(50000, "CV text is too long"),
  suggestions: z.array(
    z.object({
      highlighted: z.string(),
      suggestion: z.string(),
    }),
  ),
  email: z.string().email("Invalid email address"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { cvText, suggestions, email } = fixResumeSchema.parse(body);

    await connectToDatabase();
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 401 });
    }

    if (user.tokens < constants.PRICE_CV_FIX) {
      return NextResponse.json({ error: "Insufficient tokens" }, { status: 400 });
    }

    // Create a prompt that includes the CV text and all suggestions
    const suggestionsText = suggestions
      .map((s, i) => `${i + 1}. Text: "${s.highlighted}"\n   Suggestion: "${s.suggestion}"`)
      .join("\n\n");

    const prompt = `You are a professional resume writer. I need you to completely rewrite and reformat a resume based on specific suggestions.

ORIGINAL RESUME TEXT:
${cvText}

IMPROVEMENT SUGGESTIONS:
${suggestionsText}

Please create a completely new, professionally formatted resume that:
1. Implements all the improvement suggestions
2. Is optimized for ATS (Applicant Tracking Systems)
3. Has a clean, professional layout
4. Includes proper section headers (WORK EXPERIENCE, EDUCATION, SKILLS, etc.)
5. Maintains all the original information but presents it more effectively
6. Uses bullet points for achievements and responsibilities
7. Quantifies achievements where possible
8. Is concise and fits within 2 pages maximum
9. Has consistent formatting throughout

Format the resume with:
- Name at the top in ALL CAPS with proper spacing between letters (e.g., "A L E X A N D R U  D I N C")
- Contact information on one line with pipe separators (e.g., "Location | Phone | Email | Website | LinkedIn | GitHub")
- Clear section headers in ALL CAPS (e.g., "WORK EXPERIENCE")
- Proper spacing between sections
- Bullet points for work experience items
- Dates aligned properly

HEADER FORMAT EXAMPLE:
A L E X A N D R U  D I N C

Brasov, Romania  |  +40 722 301 831  |  alexdinca.dev@gmail.com  |  https://alexdinca.com  |  linkedin.com/in/alexandrudinca1  |  github.com/ironessence

IMPORTANT FORMATTING INSTRUCTIONS:
1. DO NOT use any markdown formatting like **, *, or ''' in your response
2. DO NOT include any code block markers
3. Use plain text formatting only
4. For section headers, use ALL CAPS (e.g., "WORK EXPERIENCE")
5. For emphasis, use spacing rather than special characters
6. Use standard bullet points (•) for list items
7. Make sure the name at the top has proper spacing between letters as shown in the example

Return ONLY the complete, formatted resume text that I can directly use.`;

    // Instantiate the Gemini client
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
    });

    const result = await model.generateContent(prompt);
    let formattedResume = result.response.text();

    // Clean up any markdown that might still be present
    formattedResume = formattedResume
      .replace(/```/g, "")
      .replace(/\*\*/g, "")
      .replace(/\*/g, "")
      .trim();

    // Update user tokens and CV text in DB
    const updatedUser = await User.findOneAndUpdate(
      { email },
      {
        $inc: { tokens: -constants.PRICE_CV_FIX },
        $set: {
          cv_full_text: formattedResume,
          cv_suggestions: [], // Clear suggestions since they've been applied
        },
      },
      { new: true },
    );

    if (!updatedUser) {
      throw new Error("Failed to update user document");
    }

    return NextResponse.json({
      formattedResume,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }

    console.error("Error fixing resume:", error);
    return NextResponse.json({ error: "Failed to fix resume" }, { status: 500 });
  }
}
