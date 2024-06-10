import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { UserIdentityService } from 'src/app/services/user-identity.service';
import { FormValidationService } from '../services/validation-form.service';
import { HandlingMessageService } from '../services/handling-message.service';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private identityService: UserIdentityService,
    private router: Router,
    private handleMessages: HandlingMessageService,
  ){

  }
  canActivate():boolean{
    if(this.identityService.isLoggedIn()){
      return true
    }else{
      this.handleMessages.handleError(null, 'Please login fist to access page');
      this.router.navigate(['login']);
      return false;
    }
  }
}
