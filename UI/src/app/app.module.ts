import { SignupComponent } from './components/auth/signup/signup.component';
import { NgModule } from '@angular/core';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgToastModule } from 'ng-angular-popup';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { JwtModule } from '@auth0/angular-jwt';
import { NavbarComponent } from './components/navbar/navbar.component';
import { CollectionComponent } from './components/collection/collection.component';
import { AddCollectionComponent } from './components/collection/add-collection/add-collection.component';
import { EditCollectionComponent } from './components/collection/edit-collection/edit-collection.component';
import { LoginComponent } from './components/auth/login/login.component';
import { UserDashboardComponent } from './components/dashboard/user-dashboard/user-dashboard.component';
import { MatIconModule } from '@angular/material/icon';
import { ThemeToggleComponent } from './components/theme-toggle/theme-toggle.component';
import { ItemComponent } from './components/item/item.component';
import { AddItemComponent } from './components/item/add-item/add-item.component';
import { EditItemComponent } from './components/item/edit-item/edit-item.component';
import { ItemDetailsComponent } from './components/item/item-details/item-details.component';
import { CommentComponent } from './components/comment/comment.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { CreateTicketComponent } from './components/create-ticket/create-ticket.component';
import { ModalContent } from './components/create-ticket/create-modal/create-modal.component';
import { TicketListComponent } from './components/create-ticket/ticket-list/ticket-list.component';

export function tokenGetter() {
  return localStorage.getItem('access_token');
}

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    DashboardComponent,
    NavbarComponent,
    CollectionComponent,
    AddCollectionComponent,
    EditCollectionComponent,
    UserDashboardComponent,
    ThemeToggleComponent,
    ItemComponent,
    AddItemComponent,
    EditItemComponent,
    ItemDetailsComponent,
    CommentComponent,
    CreateTicketComponent,
    ModalContent,
    TicketListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbModule,
    NgbModalModule,
    NgToastModule,
    CommonModule,
    MatIconModule,
    FormsModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: ["localhost:5176"],
        disallowedRoutes: ["http://localhost:5176/login"]
      },
    }),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }


