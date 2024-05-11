import { Component, OnInit } from '@angular/core';
import { SearchService } from 'src/app/services/search.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { UserIdentityService } from 'src/app/services/user-identity.service';
import { Role, Status, User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent implements OnInit {

  userId: number | null = null;
  role!: string;
  users: User[] = [];
  currentUser: any;
  selectedUsers: User[] = [];
  searchText: any;

  constructor(
    public userIdentity: UserIdentityService,
    public userService: UserService,
    private modalService: NgbModal,
  ) { }

  ngOnInit(): void {
    this.userIdentity.currentUser.subscribe(user => {
      this.currentUser = user;
    });
    if (this.currentUser.role === 'Admin') {
      this.userService.getAllUsers().subscribe(users => {
        this.users = users;
      });
    }
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
    this.userService.deleteUsers(this.selectedUsers).subscribe(() => {
      this.users = this.users.filter(user => !this.selectedUsers.includes(user));
      this.selectedUsers = [];
    });
  }

  blockSelectedUsers(): void {
    const usersToBlock = this.selectedUsers.length > 0 ? this.selectedUsers : this.users;
    usersToBlock.forEach(user => {
      this.userService.setAccountStatus(user.userId, Status.Blocked).subscribe(() => {
        user.status = Status.Blocked;
      });
    });
    this.selectedUsers = [];
  }

  unblockSelectedUsers(): void {
    const usersToUnblock = this.selectedUsers.length > 0 ? this.selectedUsers : this.users;
    usersToUnblock.forEach(user => {
      this.userService.setAccountStatus(user.userId, Status.Active).subscribe(() => {
        user.status = Status.Active;
      });
    });
    this.selectedUsers = [];
  }

  addSelectedToAdmins(): void {
    const usersToAdd = this.selectedUsers.length > 0 ? this.selectedUsers : this.users;
    usersToAdd.forEach(user => {
      this.userService.setAccountRole(user.userId, Role.Admin).subscribe(() => {
        user.role = Role.Admin;
      });
    });
    this.selectedUsers = [];
  }

  removeSelectedFromAdmins(): void {
    const usersToRemove = this.selectedUsers.length > 0 ? this.selectedUsers : this.users;
    usersToRemove.forEach(user => {
      this.userService.setAccountRole(user.userId, Role.User).subscribe(() => {
        user.role = Role.User;
      });
    });
    this.selectedUsers = [];
  }
}
