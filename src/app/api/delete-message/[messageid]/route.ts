import dbConnect from "@/lib/dbConnect";
import { User, getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import ApiResponseClass from "@/helpers/ApiResponseObj";
import UserModel from "@/model/User";

export async function DELETE(
  request: Request,
  { params }: { params: { messageid: string } }
) {
  await dbConnect();
  const messageid = params.messageid;
  const session = await getServerSession(authOptions);
  const _user: User = session?.user as User;

  if (!session || !session.user) {
    return Response.json(new ApiResponseClass(false, "Not autheticated", 401), {
      status: 401,
    });
  }

  try {
    const updateResult = await UserModel.updateOne(
      { id: _user._id },
      { $pull: { messages: { _id: messageid } } }
    );

    if (updateResult.modifiedCount === 0) {
      return Response.json(
        new ApiResponseClass(false, "Message not found or already deleted"),
        { status: 400 }
      );
    }

    return Response.json(
      new ApiResponseClass(true, "message deleted succesfully", 200),
      { status: 200 }
    );
  } catch (error) {}
}
