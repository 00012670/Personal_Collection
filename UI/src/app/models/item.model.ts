import { Collection } from "./collection.model";
import { CustomField } from "./custom-field.model";
import { ItemTag } from "./tag.model";

export interface Item {
  itemId: number;
  name?: string;
  collectionId: number;
  collection?: Collection;
  customFields?: CustomField[];
  itemCustomFields?: ItemCustomField[];
  tags?: ItemTag[];
}

export interface ItemCustomField {
  itemId: number;
  item?: Item;
  customFieldId: number;
  customField?: CustomField;
  value?: string;
}
