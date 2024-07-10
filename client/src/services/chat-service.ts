import { baseInstance } from "../axios/instance";
import { AllChatsPayload } from "../types/chat";

export const getChats = async (payload: AllChatsPayload) => {
    const { user_id, limit, page, unread } = payload
    const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        unread: unread ? "true" : "false"
    });
    const res = await baseInstance.get(`/chat/all/${user_id}/?${params.toString()}`);
    return res.data;
};