export interface Order {
  status: orderStatus;
  totalItemCount: number;
  orderTotal: number;
  createdAt: Date;
}

export enum orderStatus {
  successful,
  failed,
}
