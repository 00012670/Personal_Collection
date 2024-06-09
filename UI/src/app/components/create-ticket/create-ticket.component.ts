import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { JiraService } from 'src/app/services/jira.service';
import { FormValidationService } from 'src/app/services/form-validation.service';
import { Router } from '@angular/router';
import { ThemeService } from 'src/app/services/theme.service';
import { LanguageService } from 'src/app/services/language.service';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-create-ticket',
  templateUrl: './create-ticket.component.html',
  styleUrls: ['./create-ticket.component.css']
})

export class CreateTicketComponent {
  ticketForm: FormGroup;
  ticketLink: string | undefined;
  isDarkMode!: boolean;


  constructor(
    private fb: FormBuilder,
    private jiraService: JiraService,
    private location: Location,
    private message: FormValidationService,
    private router: Router,
    private themeService: ThemeService,
    private languageService: LanguageService,
    private translate: TranslateService,
    private modalService: NgbModal

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
  }

  // open(): void {
  //   const modalRef = this.modalService.open(ModalContent);
  //   modalRef.componentInstance.skillRequestedId = this.skillDetails.skillId;
  //   modalRef.componentInstance.receiverId = this.userProfile.userId;
  // }
  
  onSubmit() {
    if (this.ticketForm.valid) {
      const currentUrl = window.location.origin + this.location.path();
      this.ticketForm.patchValue({ link: currentUrl });
      this.jiraService.createTicket(this.ticketForm.value).subscribe(response => {
        this.ticketLink = `https://kazimovadinora.atlassian.net/browse/${response.key}`;
      });
      this.message.handleSuccess('Ticket created successfully', this.router, '', [], false);
    }
  }
}
