import {Injectable} from '@angular/core';
import {HttpService} from './http.service';
import {User} from '../user/user';
import {Observable} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class UserService {

    public user: User = {};
    public users: Array<User> = [];
    public usersTweets: any = {
        page: 1,
        totalPages: 1,
        tweets: []
    };

    constructor(public http: HttpService) {
    }

    getDashboardTweets(add?: boolean) {
        return new Promise(resolve => {
            this.http.get(`?page=${this.usersTweets.page}`).subscribe(
                (page: any) => {
                    this.usersTweets.totalPages = page.pages;
                    page.tweets.forEach(tweet => {
                        if (tweet.user._id === this.user._id) {
                            tweet.user = this.user;
                        }
                    });
                    if (add) {
                        this.usersTweets.tweets = page.tweets;
                    } else {
                        this.usersTweets.tweets = [...this.usersTweets.tweets, ...page.tweets];
                    }
                    this.usersTweets.page++;
                    resolve(this.usersTweets);
                }
            );
        });
    }


    login(email, password) {
        return new Promise((resolve, reject) => {
            this.http.post('login', {
                email: email,
                password: password
            }).subscribe((res: any) => {
                    if (!res.error) {
                        this.user = res.user;
                        this.http.setToken(this.user.token);
                        resolve(res.user);
                    } else {
                        reject(res);
                    }
                },
                err => reject(err)
            );
        });
    }

    getUsersByName(value: String) {
        return this.http.post('users/search', {
            search: value
        });
    }

    getUser(_id: String): Observable<User> {
        return this.http.get<User>(`users/${_id}`);
    }

    postTweet(text: string, img: File) {
        return new Promise((resolve, reject) => {
            const formData = new FormData();
            formData.append('body', text);
            if (img) {
                formData.append('image', img, img.name);
            }

            this.http.post('tweets', formData).subscribe(
                tweet => {
                    this.usersTweets.page = 1;
                    this.usersTweets.tweets = [];
                    this.getDashboardTweets();
                    resolve(tweet);
                },
                reject
            );
        });
    }

    updateInfo(data: any) {
        return new Promise((resolve, reject) => {
            this.http.put('users', data).subscribe(
                (responseData: any) => {
                    this.user.name = responseData.user.name;
                    this.user.email = responseData.user.email;
                    this.user.username = responseData.user.username;
                    resolve(this.user);
                },
                error => {
                    reject(error);
                }
            );
        });
    }

    getUserList(users_id: Array<String>) {
        return this.http.post('users/get', {
            ids: users_id
        });
    }

    signup(data) {
        return this.http.post('signup', data);
    }

    unfollow(id: string) {
        return new Promise(resolve => {
            this.http.delete(`users/${id}/follow`).subscribe(
                () => {
                    const index = this.user.following.indexOf(id);
                    if (index > -1) {
                        this.user.following.splice(index, 1);
                    }
                    resolve();
                }
            );
        });
    }

    follow(id: string) {
        return new Promise(resolve => {
            this.http.post(`users/${id}/follow`, {}).subscribe(
                () => {
                    const index = this.user.following.indexOf(id);
                    if (index === -1) {
                        this.user.following.push(id);
                    }
                    resolve();
                }
            );
        });
    }

    comment(_id: any, comment: string) {
        return this.http.post(`tweets/${_id}/comments`, {
            tweet: _id,
            comment: comment
        });
    }

    like(tweet_id) {
        return this.http.post(`tweets/${tweet_id}/favorites`, {
            tweet: tweet_id
        });
    }

    unlike(tweet_id) {
        return this.http.post(`tweets/${tweet_id}/favorites/unlike`, {
            tweet: tweet_id
        });
    }

    deleteComment(tweet_id, comment_id) {
        return this.http.delete(`tweets/${tweet_id}/comment/${comment_id}`);
    }

    deleteTweet(tweet) {
        return new Promise(resolve => {
            this.http.delete(`tweets/${tweet._id}`).subscribe(
                () => {
                    const index = this.usersTweets.tweets.indexOf(tweet);
                    if (index >= 0) {
                        this.usersTweets.tweets.splice(index, 1);
                    }
                    resolve();
                }
            );
        });
    }

    updateProfilePicture(file: File) {
        return new Promise((resolve, reject) => {
            const formData = new FormData();
            formData.append('image', file, file.name);

            this.http.post('users/photo', formData).subscribe(
                (data: any) => {
                    this.user.profileImage = data.user.profileImage;
                    resolve(data);
                },
                reject
            );
        });
    }

    logout() {
        this.user = null;
        this.http.removeToken();
        this.usersTweets = {
            page: 1,
            totalPages: 1,
            tweets: []
        };
    }
}
