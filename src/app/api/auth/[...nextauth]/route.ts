import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        const { name, email, image } = user;
        await connectToDatabase();

        const existingUser = await User.findOne({ email });

        if (existingUser) {
          // Update existing user
          existingUser.profilePicture = image;
          await existingUser.save();
        } else {
          // Create new user
          await User.create({
            name,
            email,
            profilePicture: image,
            // Add any other default values here
          });
        }

        return true;
      }
      return false;
    },
    async redirect({ url, baseUrl }) {
      // Redirect to dashboard after successful login
      return `${baseUrl}/dashboard`;
    },
  },
});

export { handler as GET, handler as POST };
