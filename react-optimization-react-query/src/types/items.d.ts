export interface Item {
    id: number;
    name: string;
    price: number;
    category: string;
}

export interface ItemResponse {
    items: Item[];
  }