import ApiResponseClass from "@/helpers/ApiResponseObj";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { usernameValidation } from "@/schemas/signupSchema";
import { z } from "zod";

const UsernameQuerySchema = z.object({
  username: usernameValidation,
});

export async function GET(request: Request) {
  await dbConnect();

  try {
    const { searchParams } = new URL(request.url);

    const queryParams = { username: searchParams.get("username") };
    const result = UsernameQuerySchema.safeParse(queryParams);

    //checking zod validations
    if (!result.success) {
      const usernameErrors = result.error.format().username?._errors || [];

      return Response.json(
        new ApiResponseClass(
          false,
          `${
            usernameErrors?.length > 0
              ? usernameErrors.join(", ")
              : "invalid query parameters"
          }`
        ),
        { status: 400 }
      );
    }

    const { username } = result.data;

    const existingVerifiedUser = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingVerifiedUser) {
      return Response.json(
        new ApiResponseClass(true, "Username is already taken"),
        { status: 200 }
      );
    }

    return Response.json(new ApiResponseClass(true, "username is unique"), {
      status: 200,
    });
  } catch (error) {
    console.error("Error checking username", error);

    return Response.json(
      new ApiResponseClass(
        false,
        "Something went wrong while checking username"
      ),
      { status: 500 }
    );
  }
}
