import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import ValidateForm from 'src/app/helpers/validateForm';
import { NgToastService } from 'ng-angular-popup';
import { Collection } from '../models/collection.model';
import { Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class FormValidationService {

  userId!: number;
  submitted = false;
  collection!: Collection;

  constructor(
    private toast: NgToastService,
    private formBuilder: FormBuilder,
  ) { }

  SignupValidator() {
    return this.formBuilder.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  LoginValidator() {
    return this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  collectionValidator(collection: Collection): FormGroup {
    return this.formBuilder.group({
      name: [collection.name, Validators.required],
      description: [collection.description, Validators.required],
      category: [collection.category || '', Validators.required],
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

  validateForm(form: FormGroup) {
    if (form.valid) {
      return true;
    } else {
      ValidateForm.validateAllFormFileds(form);
      this.toast.error({ detail: "ERROR", summary: "Your form is invalid", duration: 5000 });
      return false;
    }
  }

  submitForm(form: FormGroup, collection: Collection, submitAction: (body: any) => Observable<any>) {
    if (this.validateForm(form)) {
      const requestBody = this.getFormValues(form, collection);
      return submitAction(requestBody);
    } else {
      return throwError('Form is invalid');
    }
  }

  handleSuccess(message: string, router: Router, route: string, shouldNavigate: boolean = true): void {
    if (shouldNavigate) {
      router.navigate([route]);
    }
    this.toast.success({ detail: 'SUCCESS', summary: message, duration: 4000 });
  }

  handleError(error: any, message: string): void {
    this.toast.error({ detail: 'ERROR', summary: message, duration: 4000 });
  }
}
