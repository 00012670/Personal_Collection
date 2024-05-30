import { Component, OnInit } from '@angular/core';
import { Role, Status, User } from 'src/app/models/user.model';
import { ThemeService } from 'src/app/services/theme.service';
import { UserIdentityService } from 'src/app/services/user-identity.service';
import { UserService } from 'src/app/services/user.service';
import { combineLatest } from 'rxjs';
import { UserOperationsService } from 'src/app/services/user-operaton.service';
import { FormValidationService } from 'src/app/services/form-validation.service';
import { LanguageService } from 'src/app/services/language.service';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit {
  userId: number | null = null;
  role!: string;
  users: User[] = [];
  currentUser: any = { role: 'User' };
  selectedUsers: User[] = [];
  searchText: any;
  isDarkMode!: boolean;

  constructor(
    public userIdentity: UserIdentityService,
    public userService: UserService,
    private userOperations: UserOperationsService,
    private themeService: ThemeService,
    private formValidation: FormValidationService,
    private languageService: LanguageService,
    private translate: TranslateService
  ) { }

ngOnInit(): void {
  combineLatest([
    this.themeService.isDarkMode(),
    this.userIdentity.currentUser
  ]).subscribe(([isDarkMode, user]) => {
    this.isDarkMode = isDarkMode;
    this.currentUser = user || { role: 'User' };
    if (this.currentUser.role === 'Admin') {
      this.loadAllUsers();
      this.setSelectedUsers();
    }
  });
}

setSelectedUsers(): void {
  this.selectedUsers = this.userOperations.getSelectedUsersState();
  this.selectedUsers.forEach(selectedUser => {
    const user = this.users.find(user => user.userId === selectedUser.userId);
    if (user) {
      user.isSelected = true;
    }
  });
}

  loadAllUsers(): void {
    this.userService.getAllUsers().subscribe(users => {
      this.users = users;
    });
  }

  toggleSelection(user: User): void {
    this.userOperations.toggleUserSelection(user);
    this.selectedUsers = this.userOperations.getSelectedUsers(this.users);
    this.userOperations.storeSelectedUsersState(this.selectedUsers);
  }

  saveChanges(): void {
    this.userOperations.updateUsersSelection(this.selectedUsers, true).subscribe();
    this.selectedUsers = [];
  }

  deleteSelectedUsers(): void {
    this.userOperations.deleteUsers(this.selectedUsers).subscribe(() => {
      this.users = this.users.filter(user => !user.isSelected);
      this.selectedUsers = [];
    });
  }

  blockSelectedUsers(): void {
    if (!this.hasSelectedUsers()) return;
    this.updateUserStatus(Status.Blocked);
  }

  unblockSelectedUsers(): void {
    if (!this.hasSelectedUsers()) return;
    this.updateUserStatus(Status.Active);
  }

  grantAdminRole(): void {
    if (!this.hasSelectedUsers()) return;
    this.updateUserRole(Role.Admin);
  }

  removeAdminRole(): void {
    if (!this.hasSelectedUsers()) return;
    this.updateUserRole(Role.User);
  }

  private updateUserStatus(status: Status): void {
    const usersToUpdate = this.selectedUsers.length > 0 ? this.selectedUsers : this.users;
    this.userOperations.updateUsersStatus(usersToUpdate, status).subscribe(() => {
      this.updateLocalUsersStatus(status);
      this.selectedUsers = [];
    });
  }

  private updateUserRole(role: Role): void {
    const usersToUpdate = this.selectedUsers.length > 0 ? this.selectedUsers : this.users;
    this.userOperations.updateUsersRole(usersToUpdate, role).subscribe(() => {
      this.updateLocalUsersRole(role);
      this.selectedUsers = [];
    });
  }

  private hasSelectedUsers(): boolean {
    if (this.selectedUsers.length === 0) {
      this.formValidation.handleError(null, this.translate.instant('No users selected'));
      return false;
    }
    return true;
  }

  private updateLocalUsersStatus(status: Status): void {
    this.selectedUsers.forEach(user => {
      user.status = status;
      user.isSelected = false;
    });
  }

  private updateLocalUsersRole(role: Role): void {
    this.selectedUsers.forEach(user => {
      user.role = role;
      user.isSelected = false;
    });
  }
}
