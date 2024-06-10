import { Component, Input } from '@angular/core';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { JiraService } from 'src/app/services/jira.service';
import { FormValidationService } from 'src/app/services/form-validation.service';
import { ThemeService } from 'src/app/services/theme.service';
import { LanguageService } from 'src/app/services/language.service';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalContent } from './create-modal/create-modal.component';

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
    private modalService: NgbModal

  ) {}

  ngOnInit(): void {
    this.themeService.isDarkMode().subscribe(isDarkMode => {
      this.isDarkMode = isDarkMode;
    });
  }

  open(): void {
    const modalRef = this.modalService.open(ModalContent);
  }
}
