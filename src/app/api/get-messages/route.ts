import dbConnect from "@/lib/dbConnect";
import { User, getServerSession } from "next-auth";
import { authOptions } from "../auth/options";
import ApiResponseClass from "@/helpers/ApiResponseObj";
import mongoose from "mongoose";
import UserModel from "@/model/User";

export async function GET(request: Request) {
  await dbConnect();
  const session = await getServerSession(authOptions);

  const _user: User = session?.user as User;

  if (!session || !_user) {
    return Response.json(
      new ApiResponseClass(false, "Not authenticated", 401),
      { status: 401 }
    );
  }

  const userId = new mongoose.Types.ObjectId(_user._id);
  try {
    const user = await UserModel.aggregate([
      { $match: { _id: userId } },
      { $unwind: "$messages" },
      { $sort: { "messages.createdAt": -1 } },
      { $group: { _id: "$_id", messages: { $push: "$messages" } } },
    ]).exec();

    if (!user || user.length === 0) {
      return Response.json(new ApiResponseClass(false, "User not found", 404), {
        status: 404,
      });
    }

    return Response.json(
      new ApiResponseClass(true, `messages fetched succefully`, 200, {
        messages: user[0].messages,
      })
    );
  } catch (error) {
    console.error("Something went wrong while getting messages", error);

    return Response.json(
      new ApiResponseClass(
        false,
        "Something went wrong while getting messages",
        500
      ),
      { status: 500 }
    );
  }
}
