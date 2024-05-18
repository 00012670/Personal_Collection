import { Item } from "./item.model";

export interface ItemTag {
  itemId: number;
  item?: Item;
  tagId: number;
  tag?: Tag;
}

export interface Tag {
  tagId: number;
  name?: string;
  itemTags?: ItemTag[];
}
