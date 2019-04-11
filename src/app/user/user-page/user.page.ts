import {Component} from '@angular/core';
import {LoadingController, ModalController, ToastController} from '@ionic/angular';
import {UserService} from '../../services/user.service';
import {HelperService} from '../../services/helper.service';
import {merge, Observable, Subject, timer} from 'rxjs';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {first, map, share, switchMap, tap} from 'rxjs/operators';
import {Tweet, TweetService} from '../../services/tweets.service';
import {UploadPicturePage} from '../../upload-picture/upload-picture-page.component';


export interface User {
    _id: string;
    name: string;
    email?: string;
    username: string;
    profileImage: string;
    followers?: string[];
    following?: string[];
    token?: string;
    tweets?: Tweet[];
    mobile?: string;
    mobileVerified?: boolean;
    code?: string;
    codeSent?: boolean;
}

@Component({
    selector: 'page-user',
    templateUrl: './user.page.html',
    styleUrls: ['./user.page.scss']
})
export class UserPage {


    public loggedUser: boolean;
    public following = false;
    private user: User;
    private username;
    private refreshUser$ = new Subject();
    private username$ = this.route.paramMap
        .pipe(
            tap((params: ParamMap) => {
                this.username = params.get('username');
            })
        );

    public user$: Observable<User> = merge(this.username$, this.refreshUser$)
        .pipe(
            switchMap(() => {
                console.log('Route');
                if (this.username && this.username !== this.userService.user._id) {
                    this.loggedUser = false;
                    return this.userService.getUserByUsername(this.username);
                } else {
                    this.loggedUser = true;
                    return this.userService.getLoggedUser();
                }
            }),
            switchMap((user: User) => {
                this.user = user;
                return this.tweetService.getTweets(user);
            }),
            tap(tweets => {
                this.following = !this.loggedUser && this.userService.user.following.indexOf(this.user._id) >= 0;
                this.user.tweets = tweets;
                if (this.loggedUser) {
                    this.user.tweets.forEach(tweet => tweet.user = this.userService.user);
                }
            }),
            map(() => this.user),
            share()
        );

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private toastController: ToastController,
        private modalController: ModalController,
        public loadingController: LoadingController,
        public helper: HelperService,
        public userService: UserService,
        public tweetService: TweetService
    ) {
        console.log('Loaded');
    }

    refresh(refresher) {
        console.log('Refreshing...');
        timer(500).subscribe(() => this.refreshUser$.next(null));
        this.user$.pipe(first()).subscribe(refresher.target.complete);
    }

    chat() {
        this.router.navigate(['tabs/chat/user', this.user.username]);
    }

    goToFollowing(user: User) {
        this.router.navigate(['tabs/user', user.username, 'following']);
    }

    goToFollowers(user: User) {
        this.router.navigate(['tabs/user', user.username, 'followers']);
    }

    unFollow() {
        this.userService.unFollow(this.user._id).subscribe(() => {
            const index = this.user.followers.indexOf(this.userService.user._id);
            if (index >= 0) {
                this.user.followers.splice(index, 1);
            }
            this.following = false;
        });
    }

    follow() {
        this.userService.follow(this.user._id).subscribe(() => {
            const index = this.user.followers.indexOf(this.userService.user._id);
            if (index < 0) {
                this.user.followers.push(this.userService.user._id);
            }
            this.following = true;
        });
    }

    async updateProfilePicture() {
        const modal = await this.modalController.create({
            component: UploadPicturePage,
            componentProps: {
                title: 'Update Profile Picture'
            }
        });

        modal.onDidDismiss().then(async (file) => {
            console.log(file.data);
            if (file.data) {
                const loader = await this.loadingController.create({message: 'Uploading Image...'});
                loader.present();
                this.userService.updateProfilePicture(file.data).subscribe(() => {
                    loader.dismiss();
                    this.toastController.create({
                        message: 'Picture Uploaded!',
                        duration: 2000
                    }).then(toast => toast.present());

                });
            }
        });
        modal.present();
    }
}
