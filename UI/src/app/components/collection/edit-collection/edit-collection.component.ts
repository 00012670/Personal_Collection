import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgToastService } from 'ng-angular-popup';
import { Collection, CollectionCategory } from 'src/app/models/collection.model';
import { CollectionService } from 'src/app/services/collection.service';
import { UserIdentityService } from 'src/app/services/user-identity.service';
import { CollectionFormService } from 'src/app/services/collection-form.service';

@Component({
  selector: 'app-edit-collection',
  templateUrl: './edit-collection.component.html',
  styleUrls: ['./edit-collection.component.css']
})
export class EditCollectionComponent implements OnInit {
  collectionDetails!: Collection;
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

  userId: any;
  editCollectionForm: FormGroup;
  submited = false;

  constructor(
    private route: ActivatedRoute,
    public collectionService: CollectionService,
    private userIdentityService: UserIdentityService,
    private router: Router,
    private toast: NgToastService,
    private collectionFormService: CollectionFormService
  ) {
    this.editCollectionForm = this.collectionFormService.createForm({} as Collection);

  }

  ngOnInit(): void {
    this.userId = this.userIdentityService.getUserId() ?? 0;
    this.route.paramMap.subscribe({
      next: (params) => {
        const id = params.get('id');
        if (id) {
          this.collectionService.getCollection(+id)
            .subscribe({
              next: (response) => {
                this.collectionDetails = response;
                this.editCollectionForm = this.collectionFormService.createForm(this.collectionDetails);
              }
            })
        }
      }
    });
  }

  updateCollection() {
    this.submited = true;
    if (this.editCollectionForm.invalid || !this.userId) {
      return
    }
    const requestBody = this.collectionFormService.getFormValues(this.editCollectionForm, this.collectionDetails);
    this.collectionService.editCollection(this.collectionDetails.collectionId, requestBody)
      .subscribe({
        next: () => {
          this.navigateToCollections();
          this.showSuccessToast('Collection updated successfully');
        },
        error: (error) => {
          console.error('Error updating collection:', error);
        }
      });
  }

  deleteCollection(collectionId: number) {
    if (this.collectionDetails.collectionId && confirm('Are you sure you want to remove the collection?')) {
      this.collectionService.deleteCollection(collectionId).subscribe({
        next: () => {
          this.navigateToCollections();
          this.showSuccessToast('Collection deleted successfully');
        },
        error: (error) => {
          this.showErrorToast('This collection cannot be deleted.');
        }
      });
    }
  }

  private navigateToCollections() {
    this.router.navigate(['collections']);
  }

  private showSuccessToast(message: string) {
    this.toast.success({ detail: 'SUCCESS', summary: message, duration: 3000 });
  }

  private showErrorToast(message: string) {
    this.toast.error({ detail: "ERROR", summary: message, duration: 5000 });
  }
}
