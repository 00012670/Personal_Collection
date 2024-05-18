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
  String,
  Int,
  Text,
  Boolean,
  Date
}
