import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryOptions, Collection } from 'src/app/models/collection.model';
import { CollectionService } from 'src/app/services/collection.service';
import { LikeService } from 'src/app/services/like.service';
import { UserIdentityService } from 'src/app/services/user-identity.service';

@Component({
  selector: 'app-collection-details',
  templateUrl: './collection-details.component.html',
  styleUrl: './collection-details.component.css'
})
export class CollectionDetailsComponent {
  collectionDetails: Collection = {
    name: '',
    description: '',
    category: 0,
    collectionId: 0,
    userId: 0
  };
  categoryOptions = CategoryOptions;
  collectionId!: number;
  likes = 0;
  userId!: number;
  hasLiked = false;

  constructor(
    private route: ActivatedRoute,
    public collectionService: CollectionService,
    private likeService: LikeService,
    private userIdenqityService: UserIdentityService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe({
      next: (params) => {
        const id = params.get('id');
        if (id) {
          this.collectionService.getCollection(+id)
            .subscribe({
              next: (response) => {
                this.collectionDetails = response;
                this.collectionId = response.collectionId;
                this.userId = this.userIdenqityService.getUserId() ?? 0;
                this.updateLikes();
                this.updateHasLiked();
              }
            })
        }
      }
    });
  }

  updateLikes(): void {
    this.likeService.getLikes(this.collectionId)
      .subscribe({
        next: (response) => {
          this.likes = response;
        }
      });
  }

  updateHasLiked(): void {
    this.likeService.hasLiked(this.userId, this.collectionId)
      .subscribe({
        next: (hasLiked) => {
          this.hasLiked = hasLiked;
        }
      });
  }

  like(): void {
    if (this.hasLiked) {
      this.likeService.deleteLike(this.userId, this.collectionId)
        .subscribe({
          next: () => {
            this.decrementLikes();
            this.hasLiked = false;
          }
        });
    } else {
      this.likeService.addLike(this.userId, this.collectionId)
        .subscribe({
          next: () => {
            this.incrementLikes();
            this.hasLiked = true;
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
