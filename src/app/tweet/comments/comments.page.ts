import {Component} from '@angular/core';
import {ActionSheetController, ModalController, NavParams} from '@ionic/angular';
import {UserService} from '../../services/user.service';
import {HelperService} from '../../services/helper.service';
import {Comment, Tweet, TweetService} from '../../services/tweets.service';
import {Router} from '@angular/router';


@Component({
    selector: 'page-comments',
    templateUrl: './comments.page.html',
    styleUrls: ['./comments.page.scss']
})
export class CommentsPage {

    public tweet: Tweet;
    public comment = '';

    constructor(
        private router: Router,
        private navParams: NavParams,
        public userService: UserService,
        public tweetService: TweetService,
        public actionSheetController: ActionSheetController,
        public helper: HelperService,
        public modalController: ModalController
    ) {}

    ionViewWillEnter() {
        this.tweet = this.navParams.get('tweet');
    }

    send() {
        this.tweetService.comment(this.tweet._id, this.comment).subscribe(
            (comment: Comment) => {
                comment.user = this.userService.user;
                this.tweet.comments.push(comment);
                this.comment = '';
            }
        );
    }

    async showOptions(comment: Comment) {
        const buttons = [
            {
                text: 'Go To Profile',
                handler: () => {
                    this.close();
                    this.router.navigate(['tabs/user/', comment.user.username]);
                }
            }, {
                text: 'Cancel',
                role: 'cancel'
            }
        ];

        if (comment.user._id === this.userService.user._id || this.tweet.user._id === this.userService.user._id) {
            buttons.push({
                text: 'Delete Comment',
                handler: () => {
                    this.deleteComment(comment);
                }
            });
        }

        const actionSheet = await this.actionSheetController.create({
            header: 'Comment',
            buttons
        });
        await actionSheet.present();
    }

    close() {
        this.modalController.dismiss();
    }

    private deleteComment(comment: Comment) {
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
