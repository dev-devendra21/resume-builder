import { generateToken } from "@/lib/jwt";
import connectDB from "@/lib/mongodb";
import UserModel from "@/models/User.model";
import { ApiResponse } from "@/types/api.type";
import { LoginBody } from "@/types/user.type";
import { NextRequest, NextResponse } from "next/server";

async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body: LoginBody = await req.json();

    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json<ApiResponse>(
        { message: "All fields are required", success: false },
        {
          status: 400,
        },
      );
    }

    const userExists = await UserModel.findOne({ email });
    if (!userExists) {
      return NextResponse.json<ApiResponse>(
        { message: "User does not exist", success: false },
        { status: 404 },
      );
    }

    const matchPass = userExists.comparePassword(password);
    if (!matchPass) {
      return NextResponse.json<ApiResponse>(
        { message: "Invalid credentials", success: false },
        { status: 401 },
      );
    }

    const token = generateToken({
      userId: userExists._id.toString(),
      email: userExists.email,
    });

    const response = NextResponse.json<ApiResponse>(
      {
        message: "User registered successfully",
        data: {
          user: {
            _id: userExists._id,
            name: userExists.name,
            email: userExists.email,
          },
        },
        success: true,
      },
      { status: 201 },
    );

    response.cookies.set("token", token, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 1000,
    });

    return response;
  } catch (error) {
    console.log("error in register api", error);
    return NextResponse.json<ApiResponse>(
      {
        message: "Something went wrong",
        success: false,
        error: { error },
      },
      { status: 500 },
    );
  }
}
