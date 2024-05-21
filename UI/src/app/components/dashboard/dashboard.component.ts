import { Component, OnInit } from '@angular/core';
import { Role, Status, User } from 'src/app/models/user.model';
import { ThemeService } from 'src/app/services/theme.service';
import { UserIdentityService } from 'src/app/services/user-identity.service';
import { UserService } from 'src/app/services/user.service';
import { combineLatest } from 'rxjs';
import { UserOperationsService } from 'src/app/services/user-operaton.service';

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
  ) { }

  ngOnInit(): void {
    combineLatest([
      this.themeService.isDarkMode(),
      this.userIdentity.currentUser
    ]).subscribe(([isDarkMode, user]) => {
      this.isDarkMode = isDarkMode;
      this.currentUser = user;
      if (!this.currentUser) {
        this.currentUser = { role: 'User' };
      }
      if (this.currentUser.role === 'Admin') {
        this.loadAllUsers();
      }
    });
  }

  loadAllUsers(): void {
    this.userService.getAllUsers().subscribe(users => {
      this.users = users;
    });
  }

  toggleSelection(user: User): void {
    const index = this.selectedUsers.indexOf(user);
    if (index === -1) {
      this.selectedUsers.push(user);
    } else {
      this.selectedUsers.splice(index, 1);
    }
  }

  deleteSelectedUsers(): void {
    this.userOperations.deleteUsers(this.selectedUsers).subscribe(() => {
      this.users = this.users.filter(user => !this.selectedUsers.includes(user));
      this.selectedUsers = [];
    });
  }

  blockSelectedUsers(): void {
    this.updateUserStatus(Status.Blocked);
  }

  unblockSelectedUsers(): void {
    this.updateUserStatus(Status.Active);
  }

  grandAdminRole(): void {
    this.updateUserRole(Role.Admin);
  }

  removeAdminRole(): void {
    this.updateUserRole(Role.User);
  }

  private updateUserStatus(status: Status): void {
    const usersToUpdate = this.selectedUsers.length > 0 ? this.selectedUsers : this.users;
    this.userOperations.updateUsersStatus(usersToUpdate, status).subscribe(() => {
      usersToUpdate.forEach(user => user.status = status);
      this.selectedUsers = [];
    });
  }

  private updateUserRole(role: Role): void {
    const usersToUpdate = this.selectedUsers.length > 0 ? this.selectedUsers : this.users;
    this.userOperations.updateUsersRole(usersToUpdate, role).subscribe(() => {
      usersToUpdate.forEach(user => user.role = role);
      this.selectedUsers = [];
    });
  }
}
