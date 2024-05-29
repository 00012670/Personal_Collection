import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Collection } from 'src/app/models/collection.model';
import { Item } from 'src/app/models/item.model';
import { CollectionService } from 'src/app/services/collection.service';
import { ItemService } from 'src/app/services/item.service';
import { ThemeService } from 'src/app/services/theme.service';
import { UserIdentityService } from 'src/app/services/user-identity.service';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrl: './item.component.css'
})
export class ItemComponent {
  @Input() collectionId!: number;
  isDarkMode!: boolean;
  itemList: Item[] = [];
  itemId!: number;
  loggedInUserId!: number;
  collectionDetails: Collection = {
    name: '',
    description: '',
    category: 0,
    collectionId: 0,
    userId: 0
  };

  constructor(
    private itemService: ItemService,
    public collectionService: CollectionService,
    private themeService: ThemeService,
    private route: ActivatedRoute,
    private userIdentityService: UserIdentityService

  ) { }

  ngOnInit(): void {
    this.loggedInUserId = this.userIdentityService.getUserId() ?? 0;
    this.SetThemeMode();
    this.RouteParams();
  }
  
  SetThemeMode(): void {
    this.themeService.isDarkMode().subscribe((isDarkMode: boolean) => {
      this.isDarkMode = isDarkMode;
    });
  }

  RouteParams(): void {
    this.route.params.subscribe(params => {
      this.collectionId = params['collectionId'];
      this.fetchCollectionDetails();
      this.fetchItemsByCollection();
    });
  }

  fetchCollectionDetails(): void {
    this.collectionService.getCollection(this.collectionId).subscribe((collection: Collection) => {
      this.collectionDetails = collection;
    });
  }

  fetchItemsByCollection(): void {
    this.itemService.getItemsByCollection(this.collectionId).subscribe((items: Item[]) => {
      this.itemList = items;
    });
  }

  isOwnCollection(): boolean {
    return this.collectionDetails.userId === Number(this.loggedInUserId);
  }
}
