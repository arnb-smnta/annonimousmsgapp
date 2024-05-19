import dbConnect from "@/lib/dbConnect";
import { User, getServerSession } from "next-auth";
import { authOptions } from "../auth/options";
import ApiResponseClass from "@/helpers/ApiResponseObj";
import UserModel from "@/model/User";

export async function POST(request: Request) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

  if (!session || !session.user) {
    return Response.json(new ApiResponseClass(false, "not authenticated"), {
      status: 401,
    });
  }

  const userId = user._id;
  const { acceptMessages } = await request.json();

  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { isAcceptingMessages: acceptMessages },
      { new: true }
    );

    if (!updatedUser) {
      return Response.json(
        new ApiResponseClass(
          false,
          "Unable to find user to update message acceptance status"
        ),
        { status: 404 }
      );
    }

    return Response.json(
      new ApiResponseClass(
        true,
        "Message accepted status updated succesfully",
        200
      ),
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "Something went wrong while updating message acceptance status",
      error
    );

    return Response.json(
      new ApiResponseClass(
        false,
        "Something went wrong while updating message acceptance status",
        500
      ),
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  //connect to the database

  await dbConnect();

  //Get the user session

  const session = await getServerSession(authOptions);
  const user = session?.user;

  //check if the user is authenticated

  if (!session || !user) {
    return Response.json(
      new ApiResponseClass(false, "not authenticated", 401),
      { status: 401 }
    );
  }

  try {
    //Retrieve the user from the DB using the ID

    const foundUser = await UserModel.findById(user._id);

    if (!foundUser) {
      return Response.json(new ApiResponseClass(false, "User not found"), {
        status: 404,
      });
    }
    //return the users message acceptance status

    return Response.json(
      new ApiResponseClass(true, "Success", 200, {
        isAcceptingMessages: foundUser.isAcceptingMessage,
      })
    );
  } catch (error) {
    console.error("Error retrieving message acceptance status:", error);
    return Response.json(
      { success: false, message: "Error retrieving message acceptance status" },
      { status: 500 }
    );
  }
}
