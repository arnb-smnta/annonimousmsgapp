// Next js serves api through the api folder only so it is important to create api folder and write routes inside it

// ! Database connection is required in every route because next js works on edge everytime it connects db or rejoins connected DB

import dbConnect from "@/lib/dbConnect";

import UserModel from "@/model/User";

import bcrypt from "bcryptjs";

import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import ApiResponseClass from "@/helpers/ApiResponseObj";

export async function POST(request: Request) {
  await dbConnect();

  try {
    // ! This await is required its a classic mistake withput await data wont be available from request
    const { username, email, password } = await request.json();
  } catch (error) {
    console.error("Error Registering user", error);
    return Response.json(
      new ApiResponseClass(false, "Error Registering User", 200)
    );
  }
}
