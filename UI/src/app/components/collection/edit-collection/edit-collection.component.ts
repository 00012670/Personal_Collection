import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { CategoryOptions, Collection } from 'src/app/models/collection.model';
import { CollectionService } from 'src/app/services/collection.service';
import { UserIdentityService } from 'src/app/services/user-identity.service';
import { FormValidationService } from 'src/app/services/form-validation.service';
import { KeyInputService } from 'src/app/services/key-input.service';

@Component({
  selector: 'app-edit-collection',
  templateUrl: './edit-collection.component.html',
  styleUrls: ['./edit-collection.component.css']
})
export class EditCollectionComponent implements OnInit {
  collectionDetails!: Collection;
  categoryOptions = CategoryOptions;
  collectionId!: number;
  userId: any;
  collectionForm: FormGroup;
  submited = false;

  constructor(
    private route: ActivatedRoute,
    public collectionService: CollectionService,
    private userIdentityService: UserIdentityService,
    private formValidation: FormValidationService,
    private router: Router,
    private keyInputService: KeyInputService
  ) {
    this.collectionForm = this.formValidation.collectionValidator({} as Collection);
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
                this.collectionId = response.collectionId;
                this.collectionForm = this.formValidation.collectionValidator(this.collectionDetails);
              }
            })
        }
      }
    });
  }

  // updateCollection(event?: Event) {
  //   if (event) {
  //     event.preventDefault();
  //   }
  //   this.submited = true;
  //   if (this.collectionForm.valid) {
  //     this.formValidation.submitForm(this.collectionForm, this.collectionDetails,
  //       (body) => this.collectionService.editCollection(this.collectionDetails.collectionId, body))
  //       .subscribe({
  //         next: () => this.formValidation.handleSuccess('Collection updated successfully', this.router, 'collections'),
  //         error: (error) => this.formValidation.handleError(error, 'Error updating collection')
  //       });
  //   }
  // }

  updateCollection() {
    this.submited = true;
    this.formValidation.submitForm(this.collectionForm, this.collectionDetails,
      (body) => this.collectionService.editCollection(this.collectionDetails.collectionId, body))
      .subscribe({
        next: () => this.formValidation.handleSuccess('Collection updated successfully', this.router, 'collections'),
        error: (error) => this.formValidation.handleError(error, 'Error updating collection')
      });
  }

  deleteCollection(collectionId: number) {
    if (this.collectionDetails.collectionId && confirm('Are you sure you want to remove the collection?')) {
      this.collectionService.deleteCollection(collectionId)
        .subscribe(
          () => this.formValidation.handleSuccess('Collection deleted successfully', this.router, 'collections'),
          (error) => this.formValidation.handleError(error, 'This collection cannot be deleted')
        );
    }
  }
}
