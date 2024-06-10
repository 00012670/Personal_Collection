import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Item } from 'src/app/models/item.model';
import { CollectionService } from 'src/app/services/collection.service';
import { ItemService } from 'src/app/services/item.service';
import { LikeService } from 'src/app/services/like.service';
import { UserIdentityService } from 'src/app/services/user-identity.service';
import { LanguageService } from 'src/app/services/language.service';

@Component({
  selector: 'app-item-details',
  templateUrl: './item-details.component.html',
  styleUrl: './item-details.component.css'
})
export class ItemDetailsComponent {
  itemDetails: { name?: string, description?: string, collectionId: number, itemId: number } = { name: '', description: '', collectionId: 0, itemId: 0 };
  collectionId!: number;
  likes = 0;
  userId!: number;
  hasLiked = false;
  itemId!: number;
  item!: Item;

  constructor(
    private route: ActivatedRoute,
    public collectionService: CollectionService,
    private likeService: LikeService,
    private userIdentityService: UserIdentityService,
    private itemService: ItemService,
    private languageService: LanguageService
  ) { }

  ngOnInit(): void {
    this.userId = this.userIdentityService.getUserId() ?? 0;
    this.route.paramMap.subscribe({
      next: (params) => {
        const id = params.get('id');
        if (id) {
          this.itemService.getItemById(Number(id))
            .subscribe({
              next: (response: any) => {
                const item = response as Item;
                this.itemDetails = item;
                this.itemId = item.itemId;
                this.collectionId = item.collectionId;
                this.updateLikes();
                this.updateHasLiked();
              }
            })
        }
      }
    });
  }

  updateLikes(): void {
    this.likeService.getLikes(this.itemId)
      .subscribe({
        next: (response) => {
          this.likes = response;
        }
      });
  }

  updateHasLiked(): void {
    this.likeService.hasLiked(this.userId, this.itemId)
      .subscribe({
        next: (hasLiked) => {
          this.hasLiked = hasLiked;
        }
      });
  }

  like(): void {
    if (this.hasLiked) {
      this.likeService.deleteLike(this.itemId)
        .subscribe({
          next: () => {
            this.hasLiked = false;
            this.decrementLikes();
          }
        });
    } else {
      this.likeService.addLike(this.itemId)
        .subscribe({
          next: () => {
            this.hasLiked = true;
            this.incrementLikes();
          }
        });
    }
  }
  incrementLikes(): void {
    this.likes++;
  }

  decrementLikes(): void {
    this.likes--;
  }
}


