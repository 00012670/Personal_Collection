import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Collection } from 'src/app/models/collection.model';

@Injectable({
  providedIn: 'root'
})
export class CollectionFormService {
  constructor(private formBuilder: FormBuilder) {}

  createForm(collection: Collection): FormGroup {
    return this.formBuilder.group({
      name: [collection.name, Validators.required],
      description: [collection.description, Validators.required],
      category: [collection.category, Validators.required],
    });
  }

  getFormValues(form: FormGroup, collection: Collection) {
    return {
      collectionId: collection.collectionId,
      userId: collection.userId,
      name: form.get('name')?.value,
      description: form.get('description')?.value,
      category: +form.get('category')?.value,
    };
  }
}
