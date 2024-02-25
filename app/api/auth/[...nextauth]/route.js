import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import User from "@/models/user/User";
import { connectUserDB } from "@/utils/db";
import bcrypt from "bcryptjs";
import { getIdWithName } from '@/utils/routeMethods.js'

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      async authorize(credentials) {
        await connectUserDB();

        try {
          let user = await User.findOne({
            email: credentials.email,
          });

          if (user) {
            const isPasswordCorrect = await bcrypt.compare(
              credentials.password,
              user.password
            );

            if (isPasswordCorrect) {
              // Add the MongoDB document ID to the user object
              const userId = user._id.toString();

              const sessionUser = {
                id: userId,
                username: user.username,
                email: user.email,
                // Add other properties as needed
              };

              return sessionUser
            } else {
              throw new Error("Wrong Credentials!");
            }
          } else {
            throw new Error("User not found!");
          }
        } catch (err) {
          throw new Error(err);
        }
      },
    }),
  ],
  secret: process.env.SECRET_KEY,
  pages: {
    signIn: "/",
    error: "/dashboard/login",
  },
});

export { handler as GET, handler as POST };
