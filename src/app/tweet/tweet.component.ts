import {Component, Input, OnInit} from '@angular/core';
import {UserService} from '../services/user.service';
import {HelperService} from '../services/helper.service';
import {ActionSheetController, AlertController, ModalController, ToastController} from '@ionic/angular';
import {TweetService} from '../services/tweets.service';
import {SocialSharing} from '@ionic-native/social-sharing/ngx';


@Component({
    selector: 'tweet',
    templateUrl: 'tweet.component.html',
    styleUrls: ['tweet.component.scss']
})
export class TweetComponent implements OnInit {

    @Input() data: any = {
        favorites: []
    };
    liked = false;
    mine = false;
    @Input() tweets: Array<any>;

    constructor(
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
        this.liked = this.data.favorites.indexOf(this.userProvider.user._id) >= 0;
        this.mine = this.data.user._id === this.userProvider.user._id;
    }

    // goToUserDetail(user) {
    //     this.userProvider.getUser(user._id).subscribe(
    //         (data: any) => {
    //             this.navController.push(UserPage, {
    //                 user: data.user
    //             });
    //         }
    //     );
    // }

    async share() {
        const actionSheet = await this.actionSheetCtrl.create({
            title: 'Comment',
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
        if (this.data.image) {
            image = this.helper.getUrl(this.data.image);
        }
        this.socialSharing.shareVia(app, this.data.body, null, image).catch(() => {
            this.toastController.create({
                message: 'Can\'t Share Via ' + app,
                duration: 3000
            }).then(toast => toast.present());
        });
    }

    // async comment() {
    //     const modal = await this.modalController.create({
    //         component: CommentsPage,
    //         componentProps: {
    //             tweet: this.data
    //         }
    //     });
    //     return await modal.present();
    // }

    manageLike() {
        if (this.liked) {
            this.unlike();
        } else {
            this.like();
        }
    }

    private unlike() {
        this.tweetService.unlike(this.data._id).subscribe(
            res => {
                this.liked = false;
                const index = this.data.favorites.indexOf(this.userProvider.user._id);
                this.data.favorites.splice(index, 1);
            }
        );
    }

    private like() {
        this.tweetService.like(this.data._id).subscribe(
            res => {
                this.liked = true;
                this.data.favorites.push(this.userProvider.user._id);
            }
        );
    }

    removeTweet() {
        this.alertController.create({
            title: 'Delete Tweet',
            message: 'Are you sure you want to delete this tweet?',
            buttons: [
                {
                    text: 'No'
                },
                {
                    text: 'Yes',
                    handler: () => {
                        this.tweetService.deleteTweet(this.data).subscribe(res => {
                            if (this.tweets) {
                                const index = this.tweets.indexOf(this.data);
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
