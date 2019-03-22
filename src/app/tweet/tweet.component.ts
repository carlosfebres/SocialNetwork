import {Component, Input, OnInit} from '@angular/core';
import {UserService} from '../services/user.service';
import {HelperService} from '../services/helper.service';
import {ActionSheetController, AlertController, ModalController, ToastController} from '@ionic/angular';
import {Tweet, TweetService} from '../services/tweets.service';
import {SocialSharing} from '@ionic-native/social-sharing/ngx';
import {Router} from '@angular/router';
import {CommentsPage} from './comments/comments.page';
import {User} from '../user/user-page/user.page';


@Component({
    selector: 'tweet',
    templateUrl: 'tweet.component.html',
    styleUrls: ['tweet.component.scss']
})
export class TweetComponent implements OnInit {

    @Input() tweet: Tweet;
    @Input() tweets: Tweet[];
    liked = false;
    mine = false;

    constructor(
        public router: Router,
        public modalController: ModalController,
        public userProvider: UserService,
        public tweetService: TweetService,
        public actionSheetCtrl: ActionSheetController,
        public alertController: AlertController,
        public socialSharing: SocialSharing,
        public toastController: ToastController,
        public helper: HelperService
    ) {
    }

    ngOnInit() {
        this.liked = this.tweet.favorites.indexOf(this.userProvider.user._id) >= 0;
        this.mine = this.tweet.user._id === this.userProvider.user._id;
    }

    goToUserDetail(user: User) {
        if (user._id !== this.userProvider.user._id) {
            this.router.navigate(['tabs/user', user.username]);
        }
    }

    async share() {
        const actionSheet = await this.actionSheetCtrl.create({
            header: 'Comment',
            buttons: [
                {
                    text: 'Twitter',
                    handler: () => this.shareVia('twitter')
                },
                {
                    text: 'Facebook',
                    handler: () => this.shareVia('facebook')
                },
                {
                    text: 'Instagram',
                    handler: () => this.shareVia('instagram')
                },
                {
                    text: 'Whatsapp',
                    handler: () => this.shareVia('whatsapp')
                }, {
                    text: 'Cancel',
                    role: 'cancel'
                }
            ]
        });
        actionSheet.present();
    }

    private shareVia(app: string) {
        let image = null;
        if (this.tweet.image) {
            image = this.helper.getUrl(this.tweet.image);
        }
        this.socialSharing.shareVia(app, this.tweet.body, null, image).catch(() => {
            this.toastController.create({
                message: 'Can\'t Share Via ' + app,
                duration: 3000
            }).then(toast => toast.present());
        });
    }

    async comment() {
        const modal = await this.modalController.create({
            component: CommentsPage,
            componentProps: {
                tweet: this.tweet
            }
        });
        return await modal.present();
    }

    manageLike() {
        if (this.liked) {
            this.unlike();
        } else {
            this.like();
        }
    }

    private unlike() {
        this.tweetService.unlike(this.tweet._id).subscribe(
            res => {
                this.liked = false;
                const index = this.tweet.favorites.indexOf(this.userProvider.user._id);
                this.tweet.favorites.splice(index, 1);
            }
        );
    }

    private like() {
        this.tweetService.like(this.tweet._id).subscribe(
            res => {
                this.liked = true;
                this.tweet.favorites.push(this.userProvider.user._id);
            }
        );
    }

    removeTweet() {
        this.alertController.create({
            header: 'Delete Tweet',
            message: 'Are you sure you want to delete this tweet?',
            buttons: [
                {
                    text: 'No'
                },
                {
                    text: 'Yes',
                    handler: () => {
                        this.tweetService.deleteTweet(this.tweet).subscribe(res => {
                            if (this.tweets) {
                                const index = this.tweets.indexOf(this.tweet);
                                if (index >= 0) {
                                    this.tweets.splice(index, 1);
                                }
                            }
                        });
                    }
                }
            ]
        }).then(actionSheet => actionSheet.present());
    }
}
