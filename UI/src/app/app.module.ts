import { SignupComponent } from './components/signup/signup.component';
import { NgModule } from '@angular/core';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpClientModule } from '@angular/common/http';
import { NgToastModule } from 'ng-angular-popup';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
//import { FilterPipe } from './components/filter.pipe';
import { CommonModule } from '@angular/common';
import { JwtModule } from '@auth0/angular-jwt';
import { NavbarComponent } from './components/navbar/navbar.component';
import { CollectionComponent } from './components/collection/collection.component';
import { AddCollectionComponent } from './components/collection/add-collection/add-collection.component';
import { EditCollectionComponent } from './components/collection/edit-collection/edit-collection.component';
import { LoginComponent } from './components/login/login.component';

export function tokenGetter() {
  return localStorage.getItem('access_token');
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
    EditCollectionComponent
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
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: ["localhost:5176"],
        disallowedRoutes: ["http://localhost:5176/login"]
      },
    }),

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
