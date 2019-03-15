import {Component} from '@angular/core';
import {IonicPage, ModalController, NavController, NavParams} from 'ionic-angular';
import {UserService} from '../services/user.service';
import {UserInfoPage} from './user-info/user-info';
import {UserListPage} from './user-list/user-list';
import {HelperService} from '../services/helper.service';
import {UpdatePicturePage} from '../update-picture/update-picture.page';
import {ChatPage} from '../chat/chat.page';
import {ChatService} from '../services/chat.service';


export interface User {
    _id?: string;
    name?: string;
    email?: string;
    username?: string;
    profileImage?: string;
    followers?: Array<any>;
    following?: Array<any>;
    token?: string;
}

@IonicPage()
@Component({
    selector: 'page-user',
    templateUrl: 'user.html',
})
export class UserPage {

    public user: User = {
        followers: [],
        following: []
    };

    public tweets: Array<any> = [];
    public loggedUser: boolean;
    public following: boolean = false;

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public userProvider: UserService,
        public modalCtrl: ModalController,
        public helper: HelperService,
        public chatProvider: ChatService
    ) {
        if (this.navParams.get('user')) {
            this.user = this.navParams.get('user');
        } else {
            this.user = userProvider.user;
        }

        this.loggedUser = this.user._id == userProvider.user._id;

        if (!this.loggedUser) {
            this.following = userProvider.user.following.indexOf(this.user._id) >= 0;
        }
    }


    ionViewDidLoad() {
        this.userProvider.getUser(this.user._id).subscribe(
            (userData: any) => {
                userData.tweets.forEach(tweet => {
                    if (tweet.user._id == this.userProvider.user._id) {
                        tweet.user = this.userProvider.user;
                    }
                });
                this.tweets = userData.tweets;
            }
        );
    }

    myData() {
        this.navCtrl.push(UserInfoPage);
    }

    chat() {
        let chat = this.chatProvider.getChat(this.user);
        this.navCtrl.push(ChatPage, {chat});
    }

    goToUserList(title: string, list: Array<string>) {
        this.navCtrl.push(UserListPage, {
            usersId: list,
            title
        });
    }

    followManager() {
        if (this.following) {
            this.unfollow();
        } else {
            this.follow();
        }
    }

    private unfollow() {
        this.userProvider.unfollow(this.user._id).then(
            res => {
                let index = this.user.followers.indexOf(this.userProvider.user._id);
                if (index >= 0) {
                    this.user.followers.splice(index, 1);
                }
                this.following = false;
            }
        );
    }

    private follow() {
        this.userProvider.follow(this.user._id).then(
            res => {
                let index = this.user.followers.indexOf(this.userProvider.user._id);
                if (index < 0) {
                    this.user.followers.push(this.userProvider.user._id);
                }
                this.following = true;
            }
        );
    }

    updateProfilePicture() {
        this.modalCtrl.create(UpdatePicturePage, {
            title: 'Update Profile Picture',
            callback: (file) => this.userProvider.updateProfilePicture(file)
        }).present();
    }
}
