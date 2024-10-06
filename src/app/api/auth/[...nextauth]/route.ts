import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
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
          await existingUser.save();
        } else {
          // Create new user
          await User.create({
            name,
            email,
            image,
            cv: "",
          });
        }

        return true;
      }
      return false;
    },
    async redirect({ baseUrl }) {
      // Redirect to dashboard after successful login
      return `${baseUrl}/dashboard`;
    },
  },
});

export { handler as GET, handler as POST };
