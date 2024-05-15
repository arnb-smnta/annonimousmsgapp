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

    if (!username || !email || !password) {
      return Response.json(
        new ApiResponseClass(false, "All three fields are required"),
        { status: 400 }
      );
    }

    const existingverifiedUserbyUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingverifiedUserbyUsername) {
      return Response.json(
        new ApiResponseClass(true, "Username is already taken", 400),
        { status: 400 }
      );
    }

    const existingUserByEmail = await UserModel.findOne({ email });
    let verifyCode = Math.floor(10000 + Math.random() * 90000).toString();

    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        return Response.json(
          new ApiResponseClass(false, "User already exists with email", 400),
          { status: 400 }
        );
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        existingUserByEmail.password = hashedPassword;
        existingUserByEmail.verifyCode = verifyCode;
        existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 360000);
        await existingUserByEmail.save();
      }
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);

      const newUser = new UserModel({
        username,
        email,
        password: hashedPassword,
        verifyCode,
        verifyCodeExpiry: expiryDate,
        isVerified: false,
        isAcceptingMessage: true,
        messages: [],
      });

      await newUser.save();
    }

    //send verification email

    const emailResponse = await sendVerificationEmail(
      email,
      username,
      verifyCode
    );

    console.log(emailResponse);
    if (!emailResponse.success) {
      return Response.json(new ApiResponseClass(false, emailResponse.message), {
        status: 500,
      });
    }

    return Response.json(
      new ApiResponseClass(
        true,
        "User registered succesfully please register your account"
      ),
      { status: 201 }
    );
  } catch (error) {
    console.error("Error Registering user", error);
    return Response.json(
      new ApiResponseClass(false, "Error Registering User", 400),
      { status: 400 }
    );
  }
}
