import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      email: string;
      name?: string;
      image?: string;
      cv?: string;
      // Add any other custom properties from your User model
    };
  }
}
