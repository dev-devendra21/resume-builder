import connectDB from "@/lib/mongodb";
import { RegisterBody } from "@/types/user.type";
import { NextResponse, NextRequest } from "next/server";
import UserModel from "@/models/User.model";
import { ApiResponse } from "@/types/api.type";
import { generateToken } from "@/lib/jwt";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body: RegisterBody = await req.json();

    const { name, email, password, mobile } = body;

    if (!name || !email || !password || !mobile) {
      return NextResponse.json<ApiResponse>(
        { message: "All fields are required", success: false },
        {
          status: 400,
        },
      );
    }

    const userExists = await UserModel.findOne({ email });
    if (userExists) {
      return NextResponse.json<ApiResponse>(
        { message: "User already exists", success: false },
        { status: 400 },
      );
    }

    const user = await UserModel.create({
      name,
      email,
      password,
      mobile,
    });

    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
    });

    const response = NextResponse.json<ApiResponse>(
      {
        message: "User registered successfully",
        data: {
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
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
