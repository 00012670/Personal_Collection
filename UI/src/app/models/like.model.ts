import { Collection } from "./collection.model";
import { User } from "./user.model";

export interface UserLike {
  userId: number;
  user?: User;
  collectionId: number;
  collection?: Collection;
}
