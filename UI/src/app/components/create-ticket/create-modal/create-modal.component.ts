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

  createUserObject() {
    const email = this.userIdentity.currentUser.value.email;
    const username = this.userIdentity.currentUser.value.unique_name;
    const user = {
      email: email,
      username: username,
      password: "password",
      displayName: 'User',
      applicationRoles: ['jira-software']
    };
    return user;
  }

  checkAndCreateUser(user: any): Observable<any> {
    return this.jiraService.checkUserExists(user.email).pipe(
      switchMap(response => {
        if (!response.userExists) {
          return this.jiraService.createUser(user);
        } else {
          return of(true);
        }
      })
    );
  }

  validateAndCreateTicket() {
    if (this.ticketForm.valid) {
      this.createTicketAndHandleResponse();
    }
  }

  createUserAndTicket(): Observable<any> {
    const user = this.createUserObject();
    return this.checkAndCreateUser(user).pipe(
      tap(() => {
        this.validateAndCreateTicket();
      })
    );
  }

  createTicketAndHandleResponse() {
    if (this.ticketForm.valid) {
      this.jiraService.createTicket(this.ticketForm.value).subscribe(response => {
        const parsedKey = JSON.parse(response.key);
        this.ticketLink = `https://kazimovadinora.atlassian.net/browse/${parsedKey.key}`;
        this.handleMessages.handleSuccess('Ticket created successfully', this.router, '', [], false);
      });
    }
  }

  async onSubmit() {
    this.prepareForm();
    if (this.ticketForm.valid) {
      await this.createUserAndTicket().toPromise();
    }
  }
}
