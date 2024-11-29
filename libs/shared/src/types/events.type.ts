export interface MyMessageEventPayload {
  message: string;
  user: {
    id: string;
    username: string;
  };
}
