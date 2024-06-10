import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Item } from 'src/app/models/item.model';
import { CollectionService } from 'src/app/services/collection.service';
import { FormValidationService } from 'src/app/services/validation-form.service';
import { ItemService } from 'src/app/services/item.service';
import { LanguageService } from 'src/app/services/language.service';
import { HandlingMessageService } from 'src/app/services/handling-message.service';
import { submissionFormService } from 'src/app/services/submission-form.service';

@Component({
  selector: 'app-edit-item',
  templateUrl: './edit-item.component.html',
  styleUrl: './edit-item.component.css'
})
export class EditItemComponent {

  itemDetails!: Item;
  collectionId!: number;
  userId: any;
  itemForm!: FormGroup;
  submited = false;
  itemId!: number;
  item!: Item;

  constructor(
    private route: ActivatedRoute,
    public collectionService: CollectionService,
    private formValidation: FormValidationService,
    private handleMessages: HandlingMessageService,
    private router: Router,
    private itemService: ItemService,
    private languageService: LanguageService,
    private translate: TranslateService,
    private submitForm: submissionFormService
  ) {
    this.itemForm = this.formValidation.itemValidator({} as Item);
  }

  ngOnInit(): void {
    this.subscribeToRouteParams();
  }

  subscribeToRouteParams(): void {
    this.route.paramMap.subscribe({
      next: (params) => {
        const id = params.get('id');
        if (id && !isNaN(+id)) {
          this.fetchItemDetails(+id);
        }
      }
    });
  }

  fetchItemDetails(id: number): void {
    this.itemService.getItemById(id)
      .subscribe({
        next: (response: any) => {
          this.setItemDetails(response);
        }
      });
  }

  setItemDetails(item: any): void {
    this.itemDetails = item;
    this.itemId = item.itemId;
    this.collectionId = item.collectionId;
    this.itemForm.patchValue({
      name: this.itemDetails.name,
      description: this.itemDetails.description
    });
  }

  updateItem() {
    this.submited = true;
    this.submitForm.submitItemForm(this.itemForm, this.itemDetails, this.collectionId, (body) =>
      this.itemService.updateItem(this.itemDetails.itemId, body))
      .subscribe({
        next: () => this.handleMessages.handleSuccess(this.translate.instant('Item updated successfully'), this.router, '/items', [this.collectionId]),
        error: (error) => this.handleMessages.handleError(error, this.translate.instant('Error updating item'))
      });
  }

  deleteItem(itemId: number) {
    this.itemService.deleteItem(itemId)
      .subscribe(
        () => this.handleMessages.handleSuccess(this.translate.instant('Item deleted successfully'), this.router, '/items', [this.collectionId]),
        (error) => this.handleMessages.handleError(error, this.translate.instant('This item cannot be deleted'))
      );
  }
}
