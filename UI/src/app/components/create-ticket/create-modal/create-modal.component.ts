import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { FormValidationService } from 'src/app/services/form-validation.service';
import { JiraService } from 'src/app/services/jira.service';
import { LanguageService } from 'src/app/services/language.service';
import { ThemeService } from 'src/app/services/theme.service';
import { Location } from '@angular/common';
import { CollectionService } from 'src/app/services/collection.service';
import { Collection } from 'src/app/models/collection.model';


@Component({
  selector: 'app-create-modal',
  templateUrl: './create-modal.component.html',
  styleUrl: './create-modal.component.css'
})
export class ModalContent {
  ticketForm: FormGroup;
  ticketLink: string | undefined;
  isDarkMode!: boolean;
  submitted = false;
  collectionLoaded = false;

  constructor(
    private fb: FormBuilder,
    private jiraService: JiraService,
    private location: Location,
    private message: FormValidationService,
    private router: Router,
    private themeService: ThemeService,
    private languageService: LanguageService,
    private translate: TranslateService,
    private modalService: NgbModal,
    private collectionService: CollectionService,
    private route: ActivatedRoute,
  ) {
    this.ticketForm = this.fb.group({
      summary: ['', Validators.required],
      priority: ['', Validators.required],
      collection: [''],
      link: [''],
      reported: [''],
      status: ['']
    });
  }

ngOnInit(): void {
  this.themeService.isDarkMode().subscribe((isDarkMode: boolean) => {
    this.isDarkMode = isDarkMode;
  });
  this.handleCollection();
}

handleCollection(): void {
  const LAST_INDEX = -1;
  const pathParts = window.location.pathname.split('/');
  const collectionId = pathParts[pathParts.length + LAST_INDEX];

  if (collectionId) {
    this.getCollection(collectionId);
  }
}

getCollection(collectionId: string): void {
  const ITEMS_PATH = '/items/';
  const desiredUrl = `${window.location.origin}${ITEMS_PATH}${collectionId}`;

  this.collectionService.getCollection(+collectionId).subscribe((collection: Collection) => {
    this.ticketForm.patchValue({ collection: collection.name });
    this.collectionLoaded = true;
  });
}

  onSubmit() {
    this.submitted = true;
    if (this.ticketForm.valid) {
      const currentUrl = window.location.origin + this.location.path();
      this.ticketForm.patchValue({ link: currentUrl });
      this.ticketForm.patchValue({ collection: this.ticketForm.get('collection')?.value });
      this.jiraService.createTicket(this.ticketForm.value).subscribe(response => {
        this.ticketLink = `https://kazimovadinora.atlassian.net/browse/${response.key}`;
      });
      this.message.handleSuccess('Ticket created successfully', this.router, '', [], false);
    }
  }
}
