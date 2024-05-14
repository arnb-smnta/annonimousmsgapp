import { Message } from "@/model/User";
export interface ApiResponse {
  success: boolean;
  message: string;
  data?: {
    isAcceptingMessages?: boolean;
    messages?: Array<Message>;
  };
}
