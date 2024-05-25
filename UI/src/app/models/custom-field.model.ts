import { Collection } from "./collection.model";
import { ItemCustomField } from "./item.model";

export interface CustomField {
  customFieldId: number;
  name?: string;
  type: FieldType;
  collectionId: number;
  collection?: Collection;
  itemCustomFields?: ItemCustomField[];
}

export enum FieldType {
  String = 0,
  Int = 1,
  Text = 2,
  Boolean = 3,
  Date = 4
}

export const TypeOptions: FieldType[] = [
  FieldType.String,
  FieldType.Int,
  FieldType.Text,
  FieldType.Boolean,
  FieldType.Date
];
