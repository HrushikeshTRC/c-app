import { baseInstance } from "../axios/instance";
import { LoginPayload } from "../types/auth";

export const login = async (payload: LoginPayload) => {
    const res = await baseInstance.post(`/login`, payload);
    return res.data;
};