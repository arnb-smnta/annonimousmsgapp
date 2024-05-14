import { ApiResponse } from "@/types/ApiResponse";
import { Message } from "@/model/User";

class ApiResponseClass implements ApiResponse {
  success: boolean;
  message: string;
  statusCode?: number;
  data?: {
    isAcceptingMessages?: boolean;
    messages?: Array<Message>;
  };

  constructor(
    success: boolean,
    message: string,
    statusCode?: number,
    data?: { isAcceptingMessages?: boolean; messages?: Array<Message> }
  ) {
    this.success = success;
    this.message = message;
    this.statusCode = statusCode;
    this.data = data;
  }
}

export default ApiResponseClass;
