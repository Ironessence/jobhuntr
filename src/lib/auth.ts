import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import { NextAuthOptions, Profile } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

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
          await existingUser.save();
        } else {
          await User.create({
            name,
            email,
            image: googleProfile.picture,
            cv: "",
            tokens: 1000,
            tier: "FREE",
          });
        }
      }
      return true;
    },
    async redirect({ baseUrl }) {
      return `${baseUrl}/dashboard`;
    },
  },
};
