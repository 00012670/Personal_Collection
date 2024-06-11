import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Collection } from '../models/collection';
import { Observable, throwError } from 'rxjs';
import { Item } from '../models/item.model';
import { TranslateService } from '@ngx-translate/core';
import { FormValidationService } from './validation-form.service';
@Injectable({
  providedIn: 'root'
})
export class submissionFormService {

  userId!: number;
  submitted = false;
  collection!: Collection;

  constructor(
    private translate: TranslateService,
    private validateForm: FormValidationService
  ) { }

  submitForm(form: FormGroup, collection: Collection, submitAction: (body: any) => Observable<any>) {
    if (this.validateForm.validateForm(form)) {
      const requestBody = this.validateForm.getFormValues(form, collection);
      return submitAction(requestBody);
    } else {
      return throwError(this.translate.instant('Form is invalid'));
    }
  }

  submitItemForm(form: FormGroup, item: Item, collectionId: number, submitAction: (body: any, collectionId: number) => Observable<any>) {
    if (this.validateForm.validateForm(form)) {
      const requestBody = this.validateForm.getItemFormValues(form, item);
      return submitAction(requestBody, collectionId);
    } else {
      return throwError(this.translate.instant('Form is invalid'));
    }
  }
}
