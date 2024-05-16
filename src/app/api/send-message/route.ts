import ApiResponseClass from "@/helpers/ApiResponseObj";
import dbConnect from "@/lib/dbConnect";
import UserModel, { Message } from "@/model/User";

export async function POST(request: Request) {
  await dbConnect();

  const { username, content } = await request.json();

  try {
    const user = await UserModel.findOne({ username }).exec();

    if (!user) {
      return Response.json(new ApiResponseClass(false, "User not found", 404), {
        status: 404,
      });
    }

    if (!user.isAcceptingMessage) {
      return Response.json(
        new ApiResponseClass(false, "User not accepting messages", 403),
        { status: 403 }
      );
    }

    const newMessage = { content, createdAt: new Date() };

    //Push the new message to the user's messages array

    user.message.push(newMessage as Message);
    await user.save();
    return Response.json(
      new ApiResponseClass(true, "Message sent succesfully", 200),
      { status: 200 }
    );
  } catch (error) {
    console.error("Something went wrong while sending message", error);
    return Response.json(
      new ApiResponseClass(
        false,
        "Something went wrong while sending message",
        500
      ),
      { status: 500 }
    );
  }
}
