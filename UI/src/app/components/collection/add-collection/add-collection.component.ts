import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Collection, CollectionCategory } from 'src/app/models/collection.model';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { CollectionService } from 'src/app/services/collection.service';
import { UserIdentityService } from 'src/app/services/user-identity.service';
import { CollectionFormService } from 'src/app/services/collection-form.service';

@Component({
  selector: 'app-add-collection',
  templateUrl: './add-collection.component.html',
  styleUrl: './add-collection.component.css'
})
export class AddCollectionComponent {
  collectionForm!: FormGroup;
  userId!: number;
  submited = false;

  collection: Collection = {
    collectionId: 0,
    name: '',
    description: '',
    userId: 0,
    category: CollectionCategory.Other,
  };

  categoryOptions: CollectionCategory[] = [
    CollectionCategory.Books,
    CollectionCategory.Stamps,
    CollectionCategory.Coins,
    CollectionCategory.Art,
    CollectionCategory.Antiques,
    CollectionCategory.Toys,
    CollectionCategory.Memorabilia,
    CollectionCategory.Plants,
    CollectionCategory.Photographs,
    CollectionCategory.MusicalInstruments,
    CollectionCategory.Other
  ];

  constructor(
    public collectionService: CollectionService,
    private userIdentityService: UserIdentityService,
    private router: Router,
    private toast: NgToastService,
    private collectionFormService: CollectionFormService
  ) {
    this.collectionForm = this.collectionFormService.createForm(this.collection);
  }

  ngOnInit(): void {
    this.userId = this.userIdentityService.getUserId() ?? 0;
  }

  createCollection(): void {
    this.submited = true;
    if (this.collectionForm.invalid || !this.userId) {
      return;
    }
    this.collection.userId = this.userId;
    const requestBody = this.collectionFormService.getFormValues(this.collectionForm, this.collection);
    this.collectionService.createCollection(requestBody).subscribe(
      () => this.handleSuccess(),
      (error) => this.handleError(error)
    );
  }

  handleSuccess(): void {
    this.router.navigate(['/collections']);
    this.toast.success({ detail: 'SUCCESS', summary: 'Skill added successfully', duration: 4000 });
  }

  handleError(error: any): void {
    console.error(error);
    this.toast.error({ detail: 'ERROR', summary: 'Error adding skill', duration: 4000 });
  }
}



