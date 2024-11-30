export interface JoinRoomPayload {
  roomId: string;
  username: string;
}
export interface MessagePayload {
  roomId: string;
  message: string;
  username: string;
  time: string;
}
export interface MyMessageEventPayload {
  message: string;
  user: {
    id: string;
    username: string;
  };
}
