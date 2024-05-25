import { Component, OnInit, Input } from '@angular/core';
import { CustomField, FieldType, TypeOptions } from 'src/app/models/custom-field.model';
import { CustomFieldService } from 'src/app/services/custom-field.service';
import { CollectionService } from 'src/app/services/collection.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormValidationService } from 'src/app/services/form-validation.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-custom-field',
  templateUrl: './custom-field.component.html',
  styleUrls: ['./custom-field.component.css']
})
export class CustomFieldComponent implements OnInit {
  customFields!: CustomField[];
  @Input() collectionId!: number;
  FieldType = FieldType;
  typeOptions = TypeOptions
  customFieldForm!: FormGroup;
  submitted = false;
  customField!: CustomField;
collectionForm: any;

  constructor(
    public customFieldService: CustomFieldService,
    private collectionService: CollectionService,
    private formValidationService: FormValidationService,
    private router: Router,
    private formBuilder: FormBuilder) {
    this.customFieldForm = this.formBuilder.group({
      name: ['', Validators.required],
      type: ['', Validators.required],
    });
  }

  ngOnInit() {
    if (this.collectionId) {
      this.collectionService.getCollection(this.collectionId).subscribe(collection => {
        this.collectionId = collection.collectionId;
        this.getCustomFields();
      });
    }
  }

  customFieldValidator(customField: CustomField): FormGroup {
    return this.formBuilder.group({
      name: [customField.name, Validators.required],
      type: [customField.type || '', Validators.required],
    });
  }

  stringToFieldType(value: string): FieldType {
    return FieldType[value as keyof typeof FieldType];
  }

  getCustomFields(): void {
    this.customFieldService.getCustomFields(this.collectionId)
      .subscribe(customFields => {
        this.customFields = Object.values(customFields);
      });
  }

createCustomField(): void {
  this.submitted = true;
  this.customField = this.customFieldForm.value;
  this.customField.collectionId = this.collectionId;
  this.customField.type = this.stringToFieldType(this.customFieldForm.value.type);
  console.log(this.customField);
  this.collectionService.getCollection(this.collectionId).subscribe(collection => {
    this.formValidationService.submitForm(this.customFieldForm, collection, (body) =>
      this.customFieldService.addCustomField(this.collectionId, body))
      .subscribe(
        () => this.formValidationService.handleSuccess('Custom field added successfully', this.router, '', false),
        (error) => this.formValidationService.handleError(error, 'Error adding custom field')
      );
  })
}
  delete(customField: CustomField): void {
    this.customFields = this.customFields.filter(h => h !== customField);
    this.customFieldService.deleteCustomField(customField.customFieldId).subscribe();
  }
}
