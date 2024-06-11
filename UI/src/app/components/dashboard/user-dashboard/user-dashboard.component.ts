import { Component } from '@angular/core';
import { CategoryOptions, Collection } from 'src/app/models/collection';
import { CollectionService } from 'src/app/services/collection.service';
import { ThemeService } from 'src/app/services/theme.service';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrl: './user-dashboard.component.css'
})
export class UserDashboardComponent {
  collectionList: Collection[] = [];
  categoryOptions = CategoryOptions;
  isDarkMode!: boolean;

  constructor(
    public collectionService: CollectionService,
    public themeService: ThemeService
  ) { }

  ngOnInit(): void {
    this.collectionService.getCollections().subscribe(collections => {
      this.collectionList = collections;
    });
    this.themeService.isDarkMode().subscribe((isDarkMode: boolean) => {
      this.isDarkMode = isDarkMode;
    });
  }
}



