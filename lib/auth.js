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
        console.log("========== CREDENTIAL LOGIN ==========");

        try {
          // 1. Check credentials
          if (!credentials?.email || !credentials?.password) {
            console.log("❌ Email or password missing");

            throw new Error("Email and password are required");
          }

          const email = credentials.email.trim().toLowerCase();

          console.log("📧 Login email:", email);

          // 2. Connect database
          await dbConnect();

          console.log("✅ Database connected");

          // 3. Find user
          const user = await User.findOne({
            email,
          }).select("+password");

          console.log("👤 User found:", !!user);

          if (!user) {
            console.log("❌ No user found with this email");

            throw new Error("No account found with this email");
          }

          // 4. Check password
          console.log("🔐 Password exists:", !!user.password);

          if (!user.password) {
            console.log(
              "❌ This user does not have a credentials password"
            );

            throw new Error(
              "This account does not have a password. Please use Google login."
            );
          }

          // 5. Check email verification
          console.log("✉️ Email verified:", user.isVerified);

          if (!user.isVerified) {
            console.log("❌ Email is not verified");

            throw new Error(
              "Please verify your email before logging in"
            );
          }

          // 6. Compare password
          const isValid = await bcrypt.compare(
            credentials.password,
            user.password
          );

          console.log("🔑 Password match:", isValid);

          if (!isValid) {
            console.log("❌ Password is incorrect");

            throw new Error("Incorrect password");
          }

          // 7. Successful login
          console.log("✅ CREDENTIAL LOGIN SUCCESS");
          console.log("====================================");

          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            image: user.image || "",
            role: user.role,
          };
        } catch (error) {
          console.error(
            "❌ AUTHORIZE ERROR:",
            error.message
          );

          console.log("====================================");

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
    // =========================
    // SIGN IN
    // =========================
    async signIn({ user, account }) {
      try {
        // Google login
        if (account?.provider === "google") {
          await dbConnect();

          const email = user.email?.trim().toLowerCase();

          if (!email) {
            return false;
          }

          const existingUser = await User.findOne({
            email,
          });

          // New Google user
          if (!existingUser) {
            await User.create({
              name: user.name || "Google User",
              email,
              image: user.image || "",
              provider: "google",
              role: "customer",
              isVerified: true,
            });

            console.log("✅ New Google user created");
          } else {
            // Existing user
            existingUser.isVerified = true;

            if (user.image) {
              existingUser.image = user.image;
            }

            await existingUser.save();

            console.log("✅ Existing Google user updated");
          }
        }

        return true;
      } catch (error) {
        console.error("❌ SIGN IN CALLBACK ERROR:", error);

        return false;
      }
    },

    // =========================
    // JWT
    // =========================
    async jwt({ token, user }) {
      try {
        // First login
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
        console.error("❌ JWT CALLBACK ERROR:", error);

        return token;
      }
    },

    // =========================
    // SESSION
    // =========================
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