import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CategoryOptions, Collection, CollectionCategory } from 'src/app/models/collection.model';
import { CollectionService } from 'src/app/services/collection.service';
import { UserIdentityService } from 'src/app/services/user-identity.service';
import { FormValidationService } from 'src/app/services/form-validation.service';
import { Router } from '@angular/router';

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

  constructor(
    public collectionService: CollectionService,
    private userIdentityService: UserIdentityService,
    private formValidation: FormValidationService,
    private router: Router
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
    this.formValidation.submitForm(this.collectionForm, this.collection, (body) => this.collectionService.createCollection(body))
    .subscribe(
      () => this.formValidation.handleSuccess('Collection added successfully', this.router, 'collections'),
      (error) => this.formValidation.handleError(error, 'Error adding collection')
    );
  }
}



