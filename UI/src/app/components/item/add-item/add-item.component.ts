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
    private route: ActivatedRoute,
    private languageService: LanguageService,
    private translate: TranslateService,
    private handleMessages: HandlingMessageService,
    private submiForm: submissionFormService
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
    this.submiForm.submitItemForm(this.itemForm, this.item, this.collectionId, (body) =>
      this.itemService.addItem(body, this.collectionId))
      .subscribe(
        () => this.handleMessages.handleSuccess(this.translate.instant('Item added successfully'), this.router, '/items', [this.collectionId]),
        (error) => this.handleMessages.handleError(error, this.translate.instant('Error adding item'))
      );
  }
}
