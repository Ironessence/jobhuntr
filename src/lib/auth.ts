import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { NextAuthOptions, Profile } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { sendWelcomeEmail } from "./email";

interface GoogleProfile extends Profile {
  picture?: string;
  email_verified?: boolean;
  sub?: string;
}

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        await connectToDatabase();
        const user = await User.findOne({ email: credentials.email });

        if (!user) return null;

        const isValid = await bcrypt.compare(credentials.password, user.password);

        if (!isValid) return null;

        // Check if email is verified
        if (!user.emailVerified) {
          throw new Error("UNVERIFIED_EMAIL");
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          image: user.image,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        const googleProfile = profile as GoogleProfile;

        const { name, email } = user;
        await connectToDatabase();

        const existingUser = await User.findOne({ email });

        if (existingUser) {
          existingUser.image = googleProfile.picture;
          existingUser.emailVerified = true;
          await existingUser.save();
        } else {
          await User.create({
            name,
            email,
            image: googleProfile.picture,
            cv: "",
            tokens: 0,
            emailVerified: true,
          });

          await sendWelcomeEmail(email!);
        }
      }

      // For credentials, check if email is verified
      const dbUser = await User.findOne({ email: user.email });
      if (!dbUser?.emailVerified) {
        throw new Error("Please verify your email first");
      }

      return true;
    },
    async redirect({ baseUrl }) {
      return `${baseUrl}/dashboard`;
    },
  },
};
