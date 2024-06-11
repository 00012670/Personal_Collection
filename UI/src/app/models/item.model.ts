import { Collection } from "./collection";

export interface Item {
  itemId: number;
  name?: string;
  description?: string;
  collectionId: number;
  collection?: Collection;
  likes?: number;
  hasLiked?: boolean;
}
