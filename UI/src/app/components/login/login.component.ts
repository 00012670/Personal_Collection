import { Router } from '@angular/router';
import { Component, OnInit, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgToastService } from 'ng-angular-popup';
import ValidateForm from 'src/app/helpers/validateForm';
import { UserIdentityService } from 'src/app/services/user-identity.service';

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

  constructor(
    private fb: FormBuilder,
    private identityService: UserIdentityService,
    private router: Router,
    private toast: NgToastService,
    // private userStore: UserStoreService,
    private ngZone: NgZone,
  ) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }


  onSubmit() {
    if (this.loginForm.valid) {
      this.identityService.signIn(this.loginForm.value).subscribe(
        (response: any) => {
          const token = response.token;
          const decodedToken = this.identityService.decodeToken(token);
          this.identityService.currentUser.next(decodedToken);
           this.toast.success({ detail: "SUCCESS", summary: "Login successfuly", duration: 3000 });
          this.router.navigate(['dashboard'])
        },
        (error) => {
          this.toast.error({ detail: "ERROR", summary: error.message, duration: 5000 });
        }
      );
    } else {
      ValidateForm.validateAllFormFileds(this.loginForm);
      this.toast.error({ detail: "ERROR", summary: "Your form is invalid", duration: 5000 });
    }
  }

  // onSubmit() {
  //   // Check if form is valid
  //   if (this.loginForm.valid) {
  //     this.identityService.signIn(this.loginForm.value)
  //       .subscribe({
  //         next: (res) => {
  //           // Handle successful sign in
  //           this.loginForm.reset();
  //           this.auth.storeToken(res.accessToken);
  //           this.auth.storeRefreshToken(res.refreshToken);
  //           const tokenPayload = this.auth.decodedToken();
  //           this.userStore.setUsernameForStore(tokenPayload.name);
  //           this.userStore.setRoleForStore(tokenPayload.role);
  //           this.toast.success({ detail: "SUCCESS", summary: "Login successfuly", duration: 3000 });
  //           this.router.navigate(['dashboard/', res.userId]).then(() => {
  //             window.location.reload();
  //           });
  //         },
  //         error: (err) => {
  //           // Handle sign in error
  //           this.toast.error({ detail: "ERROR", summary: err.error.message, duration: 5000 });
  //         },
  //       });
  //   } else {
  //     // Handle invalid form
  //     ValidateForm.validateAllFormFileds(this.loginForm);
  //     this.toast.error({ detail: "ERROR", summary: "Your form is invalid", duration: 5000 });
  //   }
  // }

  // Toggle password visibility
  hideShowPass() {
    this.isText = !this.isText;
    this.eyeIcon = this.isText ? 'fa-eye' : 'fa-eye-slash';
    this.type = this.isText ? 'text' : 'password';
  }
};

