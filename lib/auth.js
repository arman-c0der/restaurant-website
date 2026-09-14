import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

import { dbConnect } from "./mongodb";
import User from "@/models/User";

export const authOptions = {
  providers: [
    // =========================
    // GOOGLE
    // =========================
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),

    // =========================
    // CREDENTIALS
    // =========================
    CredentialsProvider({
      name: "Credentials",

      credentials: {
        email: {
          label: "Email",
          type: "email",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },

      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error("Email and password are required");
          }

          const email = credentials.email.trim().toLowerCase();

          await dbConnect();

          const user = await User.findOne({ email }).select("+password");

          // Generic message on purpose — don't reveal whether the email exists
          if (!user || !user.password) {
            throw new Error("Invalid email or password");
          }

          if (!user.isVerified) {
            throw new Error("Please verify your email before logging in");
          }

          const isValid = await bcrypt.compare(credentials.password, user.password);

          if (!isValid) {
            throw new Error("Invalid email or password");
          }

          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            image: user.image || "",
            role: user.role,
          };
        } catch (error) {
          throw error;
        }
      },
    }),
  ],

  // =========================
  // SESSION
  // =========================
  session: {
    strategy: "jwt",
  },

  // =========================
  // LOGIN PAGE
  // =========================
  pages: {
    signIn: "/login",
  },

  // =========================
  // CALLBACKS
  // =========================
  callbacks: {
    async signIn({ user, account }) {
      try {
        if (account?.provider === "google") {
          await dbConnect();

          const email = user.email?.trim().toLowerCase();

          if (!email) {
            return false;
          }

          const existingUser = await User.findOne({ email });

          if (!existingUser) {
            await User.create({
              name: user.name || "Google User",
              email,
              image: user.image || "",
              provider: "google",
              role: "customer",
              isVerified: true,
            });
          } else {
            existingUser.isVerified = true;

            if (user.image) {
              existingUser.image = user.image;
            }

            await existingUser.save();
          }
        }

        return true;
      } catch (error) {
        return false;
      }
    },

    async jwt({ token, user }) {
      try {
        if (user?.email) {
          await dbConnect();

          const dbUser = await User.findOne({
            email: user.email.trim().toLowerCase(),
          });

          if (dbUser) {
            token.id = dbUser._id.toString();
            token.email = dbUser.email;
            token.name = dbUser.name;
            token.picture = dbUser.image || "";
            token.role = dbUser.role;
          }
        }

        return token;
      } catch (error) {
        return token;
      }
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.name = token.name;
        session.user.image = token.picture;
        session.user.role = token.role;
      }

      return session;
    },
  },

  // =========================
  // SECRET
  // =========================
  secret: process.env.NEXTAUTH_SECRET,
};