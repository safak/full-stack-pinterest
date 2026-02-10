type Sender = {
  _id: string;
  img: string;
  username: string;
  displayName: string;
}

export type Messages = {
  _id?: string
  sender: string | Sender;
  receiver: string;
  conversationId: string;
  content: string;
  isRead: boolean;
  timestamp: string;
};

export type CreateMessagePayload = {
  content: string;
  receiver: string;
  conversationId?: string;
}

export type Conversation = {
  _id: string;
  participants: Sender[];
  messages: string[];
  lastMessage: Messages;
  timestamp: string;
}