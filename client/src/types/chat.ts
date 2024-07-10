import { Message } from "./message";
import { User } from "./user";

export type Chat = {
    id: string;
    sender_details: User;
    last_message: Message;
    unread_count: number;
}

export type AllChatsPayload = {
    user_id: string;
    page: number;
    limit: number;
    unread?: boolean
}