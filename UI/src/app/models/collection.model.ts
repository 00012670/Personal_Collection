import { Category } from "./category.model";
import { CustomField } from "./custom-field.model";
import { Item } from "./item.model";
import { User } from "./user.model";

export interface Collection {
  collectionId: number;
  name?: string;
  description?: string;
  userId: number;
  user?: User;
  category: CollectionCategory;
  // customFields?: CustomField[];
  // items?: Item[];
}

export enum CollectionCategory
{
  Books = 0,
  Stamps = 1,
  Coins = 2,
  Art = 3,
  Antiques = 4,
  Toys = 5,
  Memorabilia = 6,
  Plants = 7,
  Photographs = 8,
  MusicalInstruments = 9,
  Other = 10
}



