import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { FormValidationService } from 'src/app/services/validation-form.service';
import { JiraService } from 'src/app/services/jira.service';
import { LanguageService } from 'src/app/services/language.service';
import { ThemeService } from 'src/app/services/theme.service';
import { Location } from '@angular/common';
import { CollectionService } from 'src/app/services/collection.service';
import { Collection } from 'src/app/models/collection.model';
import { HandlingMessageService } from 'src/app/services/handling-message.service';


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
    private handleMessages: HandlingMessageService,
  ) {
    this.ticketForm = this.fb.group({
      summary: ['', Validators.required],
      reported: [''],
      collection: [''],
      link: [''],
      priority: ['', Validators.required],
      status: [''],
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

  prepareForm() {
    this.submitted = true;
    if (this.ticketForm.valid) {
      const currentUrl = window.location.origin + this.location.path();
      this.ticketForm.patchValue({ collection: this.ticketForm.get('collection')?.value });
      this.ticketForm.patchValue({ link: currentUrl });
    }
  }
  createUserAndTicket() {
    const user = {
      email: 'user@example.com',
      username: 'username',
      password: 'password',
      displayName: 'User Name',
      applicationRoles: ['jira-software']
    };

    this.jiraService.checkUserExists(user.email).subscribe(response => {
      if (!response.userExists) {
        this.jiraService.createUser(user).subscribe(userResponse => {
          console.log('User created successfully', userResponse);
          this.createTicketAndHandleResponse();
        });
      } else {
        this.createTicketAndHandleResponse();
      }
    });
  }

  createTicketAndHandleResponse() {
    if (this.ticketForm.valid) {
      this.jiraService.createTicket(this.ticketForm.value).subscribe(response => {
        this.ticketLink = `https://yourjiraurl.atlassian.net/browse/${response.key}`;
        this.handleMessages.handleSuccess('Ticket created successfully', this.router, '', [], false);
      });
    }
  }

  onSubmit() {
    this.prepareForm();
    this.createUserAndTicket();
  }
}
