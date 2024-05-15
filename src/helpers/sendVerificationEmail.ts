import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";
import ApiResponseClass from "./ApiResponseObj";

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    await resend.emails.send({
      from: "loveumearnab.2812000@gmail.com",
      to: email,
      subject: "Annonimous message verification code",
      react: VerificationEmail({ username, otp: verifyCode }),
    });
    return new ApiResponseClass(true, "Email sent succesfuuly");
  } catch (error) {
    console.error("Error Sending verification email", error);
    return new ApiResponseClass(false, "Error sending verification message");
  }
}
