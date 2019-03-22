import {Injectable} from '@angular/core';
import {User} from '../user/user-page/user.page';
import {HttpService} from './http.service';
import {Observable} from 'rxjs';
import {map, tap} from 'rxjs/operators';


export interface Tweet {
    user: User;
    comments: any[];
    _id: string;
    favorites?: string[];
    body?: string;
    image?: string;
    createdAt: string;
}

@Injectable({
    providedIn: 'root'
})
export class TweetService {

    constructor(public http: HttpService) {
    }

    getUserTweets(pageNum: number) {
        return this.http.get(`?page=${pageNum}`);
    }

    // TWEETS

    getTweets(user: User): Observable<Tweet[]> {
        return this.http.get(`user/${user._id}/tweets`)
            .pipe(
                map((response: any) => response.tweets),
                tap((tweets: Tweet[]) => tweets.forEach((tweet: Tweet) => tweet.user = user))
            );
    }

    postTweet(text: string, img: File) {
        const formData = new FormData();
        formData.append('body', text);
        if (img) {
            formData.append('image', img, img.name);
        }
        return this.http.post('tweets', formData);
    }

    deleteTweet(tweet: Tweet) {
        return this.http.delete(`tweets/${tweet._id}`);
    }

    // COMMENTS

    comment(_id: any, comment: string) {
        return this.http.post(`tweets/${_id}/comments`, {tweet: _id, comment: comment});
    }

    deleteComment(tweet_id, comment_id) {
        return this.http.delete(`tweets/${tweet_id}/comment/${comment_id}`);
    }

    // LIKES

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
}
