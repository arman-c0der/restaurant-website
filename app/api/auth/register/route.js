import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import crypto from "crypto";

import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import VerificationToken from "@/models/VerificationToken";
import sendVerificationEmail from "@/lib/sendVerificationEmail";

export async function POST(request) {
  try {
    const body = await request.json();

    const name = body.name?.trim();
    const email = body.email?.trim().toLowerCase();
    const password = body.password;

    if (!name || !email || !password) {
      return NextResponse.json(
        {
          error: "Name, email and password are required",
        },
        {
          status: 400,
        }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        {
          error: "Password must be at least 6 characters",
        },
        {
          status: 400,
        }
      );
    }

    await dbConnect();

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      if (existingUser.isVerified) {
        return NextResponse.json(
          {
            error: "An account with this email already exists",
          },
          {
            status: 409,
          }
        );
      }

      // Delete old verification token
      await VerificationToken.deleteMany({ email });

      // Generate new token
      const token = crypto.randomBytes(32).toString("hex");

      const expires = new Date(
        Date.now() + 24 * 60 * 60 * 1000
      );

      await VerificationToken.create({
        email,
        token,
        expires,
      });

      await sendVerificationEmail({
        email,
        name: existingUser.name,
        token,
      });

      return NextResponse.json(
        {
          message: "A new verification email has been sent",
        },
        {
          status: 200,
        }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      provider: "credentials",
      role: "customer",
      isVerified: true,
    });

    const token = crypto.randomBytes(32).toString("hex");

    const expires = new Date(
      Date.now() + 24 * 60 * 60 * 1000
    );

    await VerificationToken.create({
      email: user.email,
      token,
      expires,
    });

    await sendVerificationEmail({
      email: user.email,
      name: user.name,
      token,
    });

    return NextResponse.json(
      {
        message: "Account created. Please verify your email.",
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("REGISTER ERROR:", error);

    return NextResponse.json(
      {
        error: "Something went wrong. Please try again.",
      },
      {
        status: 500,
      }
    );
  }
}