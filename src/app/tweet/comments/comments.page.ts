import {Component, Input} from '@angular/core';
import {ActionSheetController} from '@ionic/angular';
import {UserService} from '../../services/user.service';
import {HelperService} from '../../services/helper.service';
import {Tweet, TweetService} from '../../services/tweets.service';
import {Router} from '@angular/router';


@Component({
    selector: 'page-comments',
    templateUrl: './comments.page.html',
    styleUrls: ['./comments.page.scss']
})
export class CommentsPage {

    @Input() public tweet: Tweet;
    public comment = '';

    constructor(
        private router: Router,
        public userService: UserService,
        public tweetService: TweetService,
        public actionSheetController: ActionSheetController,
        public helper: HelperService
    ) {
    }

    send() {
        this.tweetService.comment(this.tweet._id, this.comment).subscribe(
            (res: { comment: any }) => {
                res.comment.user = this.userService.user;
                this.tweet.comments.push(res.comment);
                this.comment = '';
            }
        );
    }

    async showOptions(comment) {
        const buttons = [
            {
                text: 'Go To Profile',
                handler: () => {
                    this.router.navigate([`/user/${comment.user.username}`]);
                }
            }, {
                text: 'Cancel',
                role: 'cancel'
            }
        ];

        if (comment.user === this.userService.user._id || this.tweet.user._id === this.userService.user._id) {
            buttons.push({
                text: 'Delete Comment',
                role: 'destructive'
            });
        }

        const actionSheet = await this.actionSheetController.create({
            title: 'Comment',
            buttons
        });
        await actionSheet.present();
    }

    // TODO Use Method
    private deleteComment(comment: any) {
        this.tweetService.deleteComment(this.tweet._id, comment._id).subscribe(
            () => {
                const index = this.tweet.comments.indexOf(comment);
                if (index >= 0) {
                    this.tweet.comments.splice(index, 1);
                }
            }
        );
    }
}
