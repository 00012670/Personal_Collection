import { Collection } from "./collection.model";

export interface Category {
  categoryId: number;
  name?: string;
  collections?: Collection[];
}

