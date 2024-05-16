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
