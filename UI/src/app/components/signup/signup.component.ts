import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import ValidateForm from '../../helpers/validateForm';
import { UserIdentityService } from '../../services/user-identity.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})

export class SignupComponent {
  type: string = 'password';
  isText: boolean = false;
  eyeIcon: string = 'fa-eye-slash';
  signUpForm!: FormGroup;

  constructor(
    private identityService: UserIdentityService,
    private fb: FormBuilder,
    private router: Router,
    private toast: NgToastService,
    // private userStore: UserStoreService,
  ) { }

  ngOnInit(): void {
    this.signUpForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSignup() {
    if (this.signUpForm.valid) {
      this.identityService.signUp(this.signUpForm.value).subscribe(
        (response: any) => {
          const token = response.token;
          const decodedToken = this.identityService.decodeToken(token);
          this.identityService.currentUser.next(decodedToken);
          this.toast.success({ detail: "Success", summary: "Registered successfully", duration: 5000 });
          this.router.navigate(['dashboard']);
        },
        (error) => {
          this.toast.error({ detail: "ERROR", summary: error.message, duration: 5000 });
        }
      );
    } else {
      ValidateForm.validateAllFormFileds(this.signUpForm);
      this.toast.error({ detail: "ERROR", summary: "Your form is invalid", duration: 5000 });
    }
  }

  hideShowPass() {
    this.isText = !this.isText;
    this.eyeIcon = this.isText ? 'fa-eye' : 'fa-eye-slash';
    this.type = this.isText ? 'text' : 'password';
  }
}
