import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import NextAuth, { Profile } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

interface GoogleProfile extends Profile {
  picture?: string;
  email_verified?: boolean;
  sub?: string;
}

const handler = NextAuth({
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
            //TODO: Test if this works
            image: googleProfile.picture,
            cv: "",
          });
        }
      }
      return true;
    },
    async redirect({ baseUrl }) {
      // Redirect to dashboard after successful login
      return `${baseUrl}/dashboard`;
    },
  },
});

export { handler as GET, handler as POST };
