import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CollectionService } from 'src/app/services/collection.service';
import { UserIdentityService } from 'src/app/services/user-identity.service';
import { FormValidationService } from 'src/app/services/validation-form.service';
import { Router } from '@angular/router';
import { LanguageService } from 'src/app/services/language.service';
import { TranslateService } from '@ngx-translate/core';
import { HandlingMessageService } from 'src/app/services/handling-message.service';
import { submissionFormService } from 'src/app/services/submission-form.service';
import { CategoryOptions, Collection } from 'src/app/models/collection';

@Component({
  selector: 'app-add-collection',
  templateUrl: './add-collection.component.html',
  styleUrl: './add-collection.component.css'
})
export class AddCollectionComponent {
  collectionForm!: FormGroup;
  userId!: number;
  submited = false;
  collection!: Collection;
  categoryOptions = CategoryOptions;
  collectionId!: number;

  constructor(
    public collectionService: CollectionService,
    private userIdentityService: UserIdentityService,
    private formValidation: FormValidationService,
    private router: Router,
    private languageService: LanguageService,
    private translate: TranslateService,
    private handleMessages: HandlingMessageService,
    private submiForm: submissionFormService
  ) {
    this.collection = {} as Collection;
    this.collectionForm = this.formValidation.collectionValidator({} as Collection);
  }

  ngOnInit(): void {
    this.userId = this.userIdentityService.getUserId() ?? 0;
    this.collection.userId = this.userId;
  }

  createCollection(): void {
    this.submited = true;
    this.collection.userId = this.userId;
    this.submiForm.submitForm(this.collectionForm, this.collection, (body) =>
      this.collectionService.createCollection(body))
      .subscribe(
        () => this.handleMessages.handleSuccess(this.translate.instant('Collection added successfully'), this.router, '/collections'),
        (error) => this.handleMessages.handleError(error, this.translate.instant('Error adding collection'))
      );
  }
}



