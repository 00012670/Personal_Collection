import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { UserIdentityService } from 'src/app/services/user-identity.service';
//import { SearchService } from 'src/app/services/search.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  showSearch: boolean | undefined;
  searchText: any;

  constructor(
    private userIdentity: UserIdentityService,
  ) { }

  ngOnInit(): void {
  }

  logout(): void {
    this.userIdentity.signOut();
  }
}
