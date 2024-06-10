import { Injectable } from '@angular/core';
import { NgToastService } from 'ng-angular-popup';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class HandlingMessageService {

  constructor(
    private toast: NgToastService,
    private translate: TranslateService
  ) { }

  handleSuccess(message: string, router: Router, route: string, routeParams: any[] =[], shouldNavigate: boolean = true): void {
    if (shouldNavigate) {
      router.navigate([route, ...routeParams]);
    }
    this.toast.success({ detail: 'SUCCESS', summary: this.translate.instant(message), duration: 4000 });
  }

  handleError(error: any, message: string): void {
    this.toast.error({ detail: 'ERROR', summary: this.translate.instant(message), duration: 4000 });
  }
}
