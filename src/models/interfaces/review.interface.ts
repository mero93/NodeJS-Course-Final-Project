export interface ReviewModel {
  userId: number;
  vinylId: number;
  userName: string;
  userLastName: string;
  userAvatar?: string;
  rating: number;
  comment?: string;
  createdAt: Date;
  updatedAt: Date;
}
