import { Component } from '@angular/core';
import { CategoryOptions, Collection } from 'src/app/models/collection.model';
import { Role } from 'src/app/models/user.model';
import { CollectionService } from 'src/app/services/collection.service';
import { ThemeService } from 'src/app/services/theme.service';
import { UserIdentityService } from 'src/app/services/user-identity.service';
import { UserService } from 'src/app/services/user.service';
@Component({
  selector: 'app-collection',
  templateUrl: './collection.component.html',
  styleUrl: './collection.component.css'
})
export class CollectionComponent {
  userId!: number;
  role!: string;
  isDarkMode!: boolean;
  collectionList: Collection[] = [];
  categoryOptions = CategoryOptions;
  collectionDetails: Collection = {
    name: '',
    description: '',
    category: 0,
    collectionId: 0,
    userId: 0
  };
  loggedInUserId!: number;


  constructor(
    public collectionService: CollectionService,
    private userIdentityService: UserIdentityService,
    private userService: UserService,
    private themeService: ThemeService
  ) { }

  ngOnInit(): void {
    this.userId = this.userIdentityService.getUserId() ?? 0;
    this.getUserRole().then(() => this.getCollections());
    this.themeService.isDarkMode().subscribe((isDarkMode: boolean) => {
      this.isDarkMode = isDarkMode;
    });
  }

  async getUserRole(): Promise<void> {
    const users = await this.userService.getAllUsers().toPromise();
    const user = users?.find(user => user.userId === this.userId);
    this.role = user?.role.toString() ?? '';
  }

  getCollections(): void {
    if (this.role === Role.Admin.toString()) {
      this.collectionService.getCollections().subscribe(collections => {
        this.collectionList = collections;
      });
    } else if (this.role === Role.User.toString() && this.userId !== null) {
      this.collectionService.getCollectionsByUser(this.userId).subscribe(collections => {
        this.collectionList = collections;
      });
    }
  }
}
