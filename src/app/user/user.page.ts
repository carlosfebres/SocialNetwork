import {Component} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {UserService} from '../services/user.service';
import {HelperService} from '../services/helper.service';
import {Observable, of} from 'rxjs';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {switchMap, tap} from 'rxjs/operators';


export interface User {
    _id?: string;
    name?: string;
    email?: string;
    username?: string;
    profileImage?: string;
    followers?: string[];
    following?: string[];
    token?: string;
}

@Component({
    selector: 'page-user',
    templateUrl: 'user.page.html',
})
export class UserPage {


    public loggedUser: boolean;
    public following = false;
    private user: User;
    user$: Observable<User> = this.route.paramMap.pipe(
        switchMap((params: ParamMap) => {
            if (params.get('username') && params.get('username') !== this.userService.user._id) {
                this.loggedUser = false;
                return this.userService.getUser(params.get('username'));
            } else {
                this.loggedUser = true;
                return of(this.userService.user);
            }
        }),
        tap((user: User) => {
            this.user = user;
            this.following = !this.loggedUser && this.userService.user.following.indexOf(user._id) >= 0;
            user.tweets.forEach(tweet => {
                if (tweet.user._id === this.userService.user._id) {
                    tweet.user = this.userService.user;
                }
            });
        })
    );

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        public modalController: ModalController,
        public helper: HelperService,
        public userService: UserService,
    ) {
    }


    myData() {
        this.router.navigate(['user/edit']);
    }

    chat() {
        this.router.navigate(['chat', this.user.username]);
    }

    goToFollowing(user: User) {
        this.router.navigate(['user', user.username, 'following']);
    }

    goToFollowers(user: User) {
        this.router.navigate(['user', user.username, 'followers']);
    }

    followManager() {
        if (this.following) {
            this.unFollow();
        } else {
            this.follow();
        }
    }

    private unFollow() {
        this.userService.unfollow(this.user._id).subscribe(() => {
            const index = this.user.followers.indexOf(this.userService.user._id);
            if (index >= 0) {
                this.user.followers.splice(index, 1);
            }
            this.following = false;
        });
    }

    private follow() {
        this.userService.follow(this.user._id).subscribe(() => {
            const index = this.user.followers.indexOf(this.userService.user._id);
            if (index < 0) {
                this.user.followers.push(this.userService.user._id);
            }
            this.following = true;
        });
    }

    // async updateProfilePicture() {
    //     const modal = await this.modalController.create({
    //         component: UpdatePicturePage,
    //         componentProps: {
    //             title: 'Update Profile Picture',
    //             callback: (file) => this.userService.updateProfilePicture(file)
    //         }
    //     });
    //     modal.present();
    // }
}
