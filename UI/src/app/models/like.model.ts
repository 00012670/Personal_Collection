import { Item } from "./item.model";
import { User } from "./user.model";

export interface UserLike {
  userId: number;
  user?: User;
  itemId: number;
  item?: Item;
}
