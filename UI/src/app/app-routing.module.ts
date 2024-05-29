import { DashboardComponent } from './components/dashboard/dashboard.component';
import { SignupComponent } from './components/auth/signup/signup.component';
import { LoginComponent } from './components/auth/login/login.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CollectionComponent } from './components/collection/collection.component';
import { AddCollectionComponent } from './components/collection/add-collection/add-collection.component';
import { EditCollectionComponent } from './components/collection/edit-collection/edit-collection.component';
import { AuthGuard } from './guards/auth.guard';
import { ItemComponent } from './components/item/item.component';
import { AddItemComponent } from './components/item/add-item/add-item.component';
import { EditItemComponent } from './components/item/edit-item/edit-item.component';
import { ItemDetailsComponent } from './components/item/item-details/item-details.component';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'collections', component: CollectionComponent },
  { path: 'add-collection', component: AddCollectionComponent, canActivate: [AuthGuard]},
  { path: 'edit-collection/:id', component: EditCollectionComponent},
  { path: 'items/:collectionId', component: ItemComponent},
  { path: 'add-item/:collectionId', component: AddItemComponent},
  { path: 'edit-item/:id', component: EditItemComponent},
  { path: 'item-details/:id', component: ItemDetailsComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
