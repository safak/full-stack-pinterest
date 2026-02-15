import type { Conversation, CreateMessagePayload, Messages } from "@/types/domain/message.type";
import api from "../axios";


export const getConversationById = ({ pageParam, conversationId }: { pageParam: string, conversationId: string }) => api.get<Messages[]>(`/conversations/${conversationId}?cursor=${pageParam}`);

export const getConversations = () => api.get<Conversation[]>(`/conversations`);

export const getConversationByUser = (receiverId: string) => api.get<Conversation>(`/conversations/participants/${receiverId}`);

export const sendMessage = (payload: CreateMessagePayload) => api.post<Messages>("/conversations", payload);

export const markMessagesAsRead = (conversationId: string) => api.put(`/conversations/mark-read/${conversationId}`);


