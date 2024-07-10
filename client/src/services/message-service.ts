import { baseInstance } from "../axios/instance";
import { MessagePayload, MessagesByChatAfterPayload, MessagesByChatPayload } from "../types/message";

export const getMessagesByChat = async (payload: MessagesByChatPayload) => {
    const { chatId, limit, page } = payload
    const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
    });
    const res = await baseInstance.get(`/message/${chatId}/?${params.toString()}`);
    return res.data;
};

export const getMessagesByChatAfter = async (payload: MessagesByChatAfterPayload) => {
    const { chatId, lastMessageId } = payload
    const res = await baseInstance.get(`/messages/after/${chatId}/${lastMessageId}`);
    return res.data;
};

export const sendMsg = async (payload: MessagePayload) => {
    const res = await baseInstance.post(`/message`, payload);
    return res.data;
};

export const readMessages = async (payload: Array<string>) => {
    const res = await baseInstance.patch(`/message/read`, { messageIds: payload, read: true });
    return res.data;
};