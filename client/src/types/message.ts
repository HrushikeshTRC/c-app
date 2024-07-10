export type Message = {
    id: string;
    chat_id: string;
    content: string;
    created_at: string;
    read: boolean;
    sender_id: string;
    recipient_id: string;
}

export type MessagesByChatPayload = {
    chatId: string;
    page: number;
    limit: number;
}

export type MessagesByChatAfterPayload = {
    chatId: string;
    lastMessageId: string;
}

export type MessagePayload = {
    content: string;
    chat_id: string;
    created_at: string;
    sender_id: string;
    recipient_id: string;
}
