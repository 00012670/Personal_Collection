import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { interval, startWith, switchMap } from 'rxjs';
import { Review } from 'src/app/models/comment';
import { CommentService } from 'src/app/services/comment.service';
import { ThemeService } from 'src/app/services/theme.service';
import { UserIdentityService } from 'src/app/services/user-identity.service';
import  { LanguageService } from 'src/app/services/language.service';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.css'
})

export class CommentComponent {
  @Input() itemId!: number;
  isDarkMode!: boolean;
  loggedInUserId!: number;
  comments!: Review[];
  newCommentText: string = '';

  constructor(
    private themeService: ThemeService,
    private route: ActivatedRoute,
    private userIdentityService: UserIdentityService,
    private commentService: CommentService,
    private languageService: LanguageService
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
      this.itemId = params['id'];
      if (this.itemId) {
        interval(5000)
          .pipe(
            startWith(0),
            switchMap(() => this.commentService.getCommentsByItemId(this.itemId))
          )
          .subscribe(comments => {
            this.comments = comments;
          });
      }
    });
  }

  onSubmit(): void {
    const newComment: Review = {
      text: this.newCommentText,
      userId: this.loggedInUserId,
      itemId: this.itemId,
      commentId: 0,
      user: undefined
    };
    this.commentService.addComment(this.itemId, newComment).subscribe(comment => {
      this.comments.push(comment);
      this.newCommentText = '';
    });
  }
}
