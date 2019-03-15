import {Component, Input} from '@angular/core';
import {ActionSheetController, NavParams} from '@ionic/angular';
import {UserService} from '../../services/user.service';
import {UserPage} from '../../user/user';
import {HelperService} from '../../services/helper.service';
import {Tweet} from '../../services/tweets.service';


@Component({
    selector: 'page-comments',
    templateUrl: './comments.page.html',
    styleUrls: ['./comments.page.scss']
})
export class CommentsPage {

    @Input() public tweet: Tweet;
    public comment = '';

    constructor(
        public navParams: NavParams,
        public userProvider: UserService,
        public actionSheetController: ActionSheetController,
        public helper: HelperService
    ) {
    }

    // close() {
    //     this.navCtrl.pop();
    // }

    send() {
        this.userProvider.comment(this.tweet._id, this.comment).subscribe(
            (res: { comment: any }) => {
                res.comment.user = this.userProvider.user;
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
                    // this.goToProfile(comment.user);
                }
            }, {
                text: 'Cancel',
                role: 'cancel'
            }
        ];

        if (comment.user === this.userProvider.user._id || this.tweet.user._id === this.userProvider.user._id) {
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

    // TODO Go To Profile
    // private goToProfile(user: any) {
    //     this.userProvider.getUser(user).subscribe(
    //         (data: any) => {
    //             this.navCtrl.push(UserPage, {
    //                 user: data.user
    //             });
    //         }
    //     );
    // }

    // TODO Use Method
    private deleteComment(comment: any) {
        this.userProvider.deleteComment(this.tweet._id, comment._id).subscribe(
            () => {
                const index = this.tweet.comments.indexOf(comment);
                if (index >= 0) {
                    this.tweet.comments.splice(index, 1);
                }
            }
        );
    }
}
