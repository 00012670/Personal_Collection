import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { CategoryOptions, Collection } from 'src/app/models/collection.model';
import { CollectionService } from 'src/app/services/collection.service';
import { FormValidationService } from 'src/app/services/form-validation.service';
import { LanguageService } from 'src/app/services/language.service';
import { TranslateService } from '@ngx-translate/core';

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
    private formValidation: FormValidationService,
    private router: Router,
    private languageService: LanguageService,
    private translate: TranslateService
  ) {
    this.collectionForm = this.formValidation.collectionValidator({} as Collection);
  }

  ngOnInit(): void {
    this.subscribeToRouteParams();
  }

  subscribeToRouteParams(): void {
    this.route.paramMap.subscribe({
      next: (params) => {
        const id = params.get('id');
        if (id) {
          this.fetchCollectionDetails(+id);
        }
      }
    });
  }

  fetchCollectionDetails(id: number): void {
    this.collectionService.getCollection(id)
      .subscribe({
        next: (response) => {
          this.setCollectionDetails(response);
        }
      });
  }

  setCollectionDetails(collection: Collection): void {
    this.collectionDetails = collection;
    this.collectionId = collection.collectionId;
    this.collectionForm = this.formValidation.collectionValidator(this.collectionDetails);
  }

  updateCollection() {
    this.submited = true;
    this.formValidation.submitForm(this.collectionForm, this.collectionDetails,
      (body) => this.collectionService.editCollection(this.collectionDetails.collectionId, body))
      .subscribe({
        next: () => this.formValidation.handleSuccess(this.translate.instant('Collection updated successfully'), this.router, 'collections'),
        error: (error) => this.formValidation.handleError(error, this.translate.instant('Error updating collection'))
      });
  }

  deleteCollection(collectionId: number) {
    this.collectionService.deleteCollection(collectionId)
      .subscribe(
        () => this.formValidation.handleSuccess(this.translate.instant('Collection deleted successfully'), this.router, 'collections'),
        (error) => this.formValidation.handleError(error, this.translate.instant('This collection cannot be deleted'))
      );
  }
}
