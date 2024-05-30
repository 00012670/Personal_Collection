import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CategoryOptions, Collection } from 'src/app/models/collection.model';
import { CollectionService } from 'src/app/services/collection.service';
import { UserIdentityService } from 'src/app/services/user-identity.service';
import { FormValidationService } from 'src/app/services/form-validation.service';
import { Router } from '@angular/router';
import { LanguageService } from 'src/app/services/language.service';
import { TranslateService } from '@ngx-translate/core';

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
    private translate: TranslateService
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
    this.formValidation.submitForm(this.collectionForm, this.collection, (body) =>
      this.collectionService.createCollection(body))
      .subscribe(
        () => this.formValidation.handleSuccess(this.translate.instant('Collection added successfully'), this.router, '/collections'),
        (error) => this.formValidation.handleError(error, this.translate.instant('Error adding collection'))
      );
  }
}



