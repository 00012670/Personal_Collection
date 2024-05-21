import { Component, OnInit } from '@angular/core';
import { ThemeService } from 'src/app/services/theme.service';
import { UserIdentityService } from 'src/app/services/user-identity.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  showSearch: boolean | undefined;
  searchText: any;
  isDarkMode!: boolean;


  constructor(
    private userIdentity: UserIdentityService,
    public themeService: ThemeService,
  ) { }

  ngOnInit() {
    this.themeService.isDarkMode().subscribe((isDarkMode: boolean) => {
      this.isDarkMode = isDarkMode;
    });
  }

  logout(): void {
    this.userIdentity.signOut();
  }
}
