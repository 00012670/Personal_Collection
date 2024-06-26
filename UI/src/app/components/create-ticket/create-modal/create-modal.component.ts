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
import { HandlingMessageService } from 'src/app/services/handling-message.service';
import { UserIdentityService } from 'src/app/services/user-identity.service';
import { Observable, of, switchMap, tap } from 'rxjs';
import { Collection } from 'src/app/models/collection';
import { IssueRequest } from 'src/app/models/jira';
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
    private userIdentity: UserIdentityService
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

  async onSubmit() {
    this.prepareForm();
    if (this.ticketForm.valid) {
      const response = await this.createIssue().toPromise();
      if (response && response.key) {
        const parsedKey = response.key;
        this.ticketLink = `https://kazimovadinora.atlassian.net/browse/${parsedKey}`;
        this.handleMessages.handleSuccess('Ticket created successfully', this.router, '', [], false);
      } else {
        console.error('Invalid response format', response);
      }
    }
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
    this.collectionService.getCollection(+collectionId).subscribe((collection: Collection) => {
      this.ticketForm.patchValue({ collection: collection.name });
      this.collectionLoaded = true;
    });
  }

  prepareForm() {
    this.submitted = true;
    if (this.ticketForm.valid) {
      const currentUrl = window.location.origin + this.location.path();
      this.ticketForm.patchValue({ reported: this.userIdentity.currentUser.value.email });
      this.ticketForm.patchValue({ collection: this.ticketForm.get('collection')?.value });
      this.ticketForm.patchValue({ link: currentUrl });
    }
  }

  createRequestObject(): IssueRequest {
    const email = this.userIdentity.currentUser.value.email;
    const username = this.userIdentity.currentUser.value.unique_name;
    return {
      email: email,
      username: username,
      password: "password",
      displayName: 'User',
      applicationRoles: ['jira-software'],
      issueSummary: this.ticketForm.get('summary')?.value,
      collection: this.ticketForm.get('collection')?.value,
      link: this.ticketForm.get('link')?.value,
      priority: this.ticketForm.get('priority')?.value
    };
  }

  createIssue(): Observable<any> {
    const userAndIssueRequest = this.createRequestObject();
    return this.jiraService.createaJiraTicket(userAndIssueRequest);
  }
}
