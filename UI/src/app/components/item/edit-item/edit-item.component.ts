import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Item } from 'src/app/models/item.model';
import { CollectionService } from 'src/app/services/collection.service';
import { FormValidationService } from 'src/app/services/form-validation.service';
import { ItemService } from 'src/app/services/item.service';

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
    private router: Router,
    private itemService: ItemService,
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
    this.formValidation.submitItemForm(this.itemForm, this.itemDetails, this.collectionId, (body) =>
      this.itemService.updateItem(this.itemDetails.itemId, body))
      .subscribe({
        next: () => this.formValidation.handleSuccess('Item updated successfully', this.router, '/items', [this.collectionId]),
        error: (error) => this.formValidation.handleError(error, 'Error updating item')
      });
  }

  deleteItem(itemId: number) {
    if (this.itemDetails.itemId && confirm('Are you sure you want to remove the collection?')) {
      this.itemService.deleteItem(itemId)
        .subscribe(
          () => this.formValidation.handleSuccess('Item deleted successfully', this.router, '/items', [this.collectionId]),
          (error) => this.formValidation.handleError(error, 'This item cannot be deleted')
        );
    }
  }
}
