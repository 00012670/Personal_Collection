import { Component, Input } from '@angular/core';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { JiraService } from 'src/app/services/jira.service';
import { FormValidationService } from 'src/app/services/validation-form.service';
import { ThemeService } from 'src/app/services/theme.service';
import { LanguageService } from 'src/app/services/language.service';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalContent } from './create-modal/create-modal.component';
import { UserIdentityService } from 'src/app/services/user-identity.service';
import { Router } from '@angular/router';
import { HandlingMessageService } from 'src/app/services/handling-message.service';

@Component({
  selector: 'app-create-ticket',
  templateUrl: './create-ticket.component.html',
  styleUrls: ['./create-ticket.component.css']
})

export class CreateTicketComponent {
  isDarkMode!: boolean;
  @Input() collectionId!: number;

  constructor(
    private themeService: ThemeService,
    private languageService: LanguageService,
    private translate: TranslateService,
    private modalService: NgbModal,
    private identityService: UserIdentityService,
    private router: Router,
    private handleMessages: HandlingMessageService,
  ) { }

  ngOnInit(): void {
    this.themeService.isDarkMode().subscribe(isDarkMode => {
      this.isDarkMode = isDarkMode;
    });
  }

  open(): void {
    if (this.identityService.isLoggedIn()) {
      const modalRef = this.modalService.open(ModalContent);
    } else {
      this.router.navigate(['login']);
      this.handleMessages.handleError(null, 'Please login first');
    }
  }
}
