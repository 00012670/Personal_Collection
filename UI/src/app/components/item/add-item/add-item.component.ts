import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Item } from 'src/app/models/item.model';
import { CollectionService } from 'src/app/services/collection.service';
import { FormValidationService } from 'src/app/services/form-validation.service';
import { ItemService } from 'src/app/services/item.service';

@Component({
  selector: 'app-add-item',
  templateUrl: './add-item.component.html',
  styleUrl: './add-item.component.css'
})
export class AddItemComponent {
  itemForm!: FormGroup;
  userId!: number;
  submited = false;
  item!: Item;
  collectionId!: number;

  constructor(
    private itemService: ItemService,
    public collectionService: CollectionService,
    private formValidation: FormValidationService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.item = {} as Item;
    this.itemForm = this.formValidation.itemValidator({} as Item);
  }

  ngOnInit(): void {
    this.collectionId = Number(this.route.snapshot.paramMap.get('collectionId'));
  }

  createCollection(): void {
    this.submited = true;
    this.item.collectionId = this.collectionId;
    this.formValidation.submitItemForm(this.itemForm, this.item, this.collectionId, (body) =>
      this.itemService.addItem(body, this.collectionId))
      .subscribe(
        () => this.formValidation.handleSuccess('Collection added successfully', this.router, '/items', [this.collectionId]),
        (error) => this.formValidation.handleError(error, 'Error adding item')
      );
  }
}
