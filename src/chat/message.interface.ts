export interface Message {
  id?: number;
  senderId: number;
  recipientId: number;
  content: string;
  senderName?: string;
  senderType? : string;
  recipientType? : string;

}
