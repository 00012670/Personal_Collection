import { Collection } from "./collection.model";

export interface Item {
  itemId: number;
  name?: string;
  description?: string;
  collectionId: number;
  collection?: Collection;
  likes?: number;
  hasLiked?: boolean;
}
