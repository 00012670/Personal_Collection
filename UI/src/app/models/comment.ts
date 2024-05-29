import { Item } from "./item.model";
import { User } from "./user.model";

export interface Review {
    commentId: number;
    text: string;
    userId: number;
    user?: User;
    itemId: number;
    item?: Item;
}
