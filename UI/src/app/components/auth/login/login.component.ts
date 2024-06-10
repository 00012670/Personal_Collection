import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { UserIdentityService } from 'src/app/services/user-identity.service';
import { FormValidationService } from 'src/app/services/validation-form.service';
import { ThemeService } from 'src/app/services/theme.service';
import { LanguageService } from 'src/app/services/language.service';
import { TranslateService } from '@ngx-translate/core';
import { HandlingMessageService } from 'src/app/services/handling-message.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})

export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  type: string = 'password';
  isText: boolean = false;
  eyeIcon: string = 'fa-eye-slash';
  resetPasswordEmail!: string;
  isValidEmail!: boolean;
  isDarkMode!: boolean;

  constructor(
    private identityService: UserIdentityService,
    private router: Router,
    private formValidation: FormValidationService,
    private themeService: ThemeService,
    private languageService: LanguageService,
    private translate: TranslateService,
    private handleMessages: HandlingMessageService,
  ) {
    this.loginForm = this.formValidation.LoginValidator();
  }

  ngOnInit(): void {
    this.themeService.isDarkMode().subscribe((isDarkMode: boolean) => {
      this.isDarkMode = isDarkMode;
    });
  }

  onSubmit() {
    if (this.formValidation.validateForm(this.loginForm)) {
      this.identityService.signIn(this.loginForm.value).subscribe(
        (response: any) => {
          const token = response.token;
          const decodedToken = this.identityService.decodeToken(token);
          this.identityService.currentUser.next(decodedToken);
          this.handleMessages.handleSuccess(this.translate.instant("Login successfully"), this.router, 'dashboard');
        },
        (error) => {
          this.handleMessages.handleError(error, error.message);
        }
      );
    }
  }

  hideShowPass() {
    this.isText = !this.isText;
    this.eyeIcon = this.isText ? 'fa-eye' : 'fa-eye-slash';
    this.type = this.isText ? 'text' : 'password';
  }
};

