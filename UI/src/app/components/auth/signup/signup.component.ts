import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { UserIdentityService } from 'src/app/services/user-identity.service';
import { FormValidationService } from 'src/app/services/form-validation.service';
import { ThemeService } from 'src/app/services/theme.service';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/services/language.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})

export class SignupComponent implements AfterViewInit {
  @ViewChild('nameInput')
  nameInput!: ElementRef;

  ngAfterViewInit() {
    this.nameInput.nativeElement.focus();
  }
  type: string = 'password';
  isText: boolean = false;
  eyeIcon: string = 'fa-eye-slash';
  signUpForm!: FormGroup;
  isDarkMode!: boolean;

  constructor(
    private identityService: UserIdentityService,
    private router: Router,
    private formValidation: FormValidationService,
    private themeService: ThemeService,
    private languageService: LanguageService,
    private translate: TranslateService
  ) {
    this.signUpForm = this.formValidation.SignupValidator();
  }

  ngOnInit(): void {
    this.themeService.isDarkMode().subscribe((isDarkMode: boolean) => {
      this.isDarkMode = isDarkMode;
    });
  }

  onSignup() {
    if (this.formValidation.validateForm(this.signUpForm)) {
      this.identityService.signUp(this.signUpForm.value).subscribe(
        (response: any) => {
          console.log('Signup response:', response);
          const token = response.token;
          const decodedToken = this.identityService.decodeToken(token);
          this.identityService.currentUser.next(decodedToken);
          this.formValidation.handleSuccess(this.translate.instant("Signup successfully"), this.router, 'dashboard');
        },
        (error) => {
          this.formValidation.handleError(error, error.message);
        }
      );
    }
  }

  hideShowPass() {
    this.isText = !this.isText;
    this.eyeIcon = this.isText ? 'fa-eye' : 'fa-eye-slash';
    this.type = this.isText ? 'text' : 'password';
  }
}
