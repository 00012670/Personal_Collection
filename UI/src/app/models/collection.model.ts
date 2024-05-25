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
  customFields?: CustomField[];
  items?: Item[];
}

export enum CollectionCategory
{
  Books = 0,
  Stamps = 1,
  Coins = 2,
  Art = 3,
  Antiques = 4,
  Memorabilia = 5,
  Photographs = 6,
  Other = 7
}

export const CategoryOptions: CollectionCategory[] = [
  CollectionCategory.Books,
  CollectionCategory.Stamps,
  CollectionCategory.Coins,
  CollectionCategory.Art,
  CollectionCategory.Antiques,
  CollectionCategory.Memorabilia,
  CollectionCategory.Photographs,
  CollectionCategory.Other
];




