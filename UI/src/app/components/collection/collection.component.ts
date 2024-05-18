import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Collection, CollectionCategory } from 'src/app/models/collection.model';
import { CollectionService } from 'src/app/services/collection.service';
import { UserIdentityService } from 'src/app/services/user-identity.service';

@Component({
  selector: 'app-collection',
  templateUrl: './collection.component.html',
  styleUrl: './collection.component.css'
})
export class CollectionComponent {
  userId!: number;
  collectionList: Collection[] = [];
  categoryOptions: CollectionCategory[] = [
    CollectionCategory.Books,
    CollectionCategory.Stamps,
    CollectionCategory.Coins,
    CollectionCategory.Art,
    CollectionCategory.Antiques,
    CollectionCategory.Toys,
    CollectionCategory.Memorabilia,
    CollectionCategory.Plants,
    CollectionCategory.Photographs,
    CollectionCategory.MusicalInstruments,
    CollectionCategory.Other
  ];

  constructor(
    public collectionService: CollectionService,
    private userIdentityService: UserIdentityService
  ) { }

  ngOnInit(): void {
    this.userId = this.userIdentityService.getUserId() ?? 0;
    this.collectionService.getCollectionsByUser(this.userId).subscribe(collections => {
      this.collectionList = collections;
    });
  }
}
