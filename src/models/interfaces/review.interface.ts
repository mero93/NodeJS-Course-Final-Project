export interface ReviewModel {
  id: number;
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

export interface ReviewWithVinyl extends ReviewModel {
  vinylName: string;
}
