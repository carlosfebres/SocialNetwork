import {Component, OnInit} from '@angular/core';
import {UserService} from '../services/user.service';
import {ModalController} from '@ionic/angular';
import {Tweet, TweetService} from '../services/tweets.service';
import {BehaviorSubject, Observable} from 'rxjs';
import {delay, first, map, share, switchMap, tap} from 'rxjs/operators';
import {Router} from '@angular/router';

@Component({
    selector: 'page-home',
    templateUrl: './home.page.html',
    styleUrls: ['./home.page.scss']
})
export class HomePage {

    constructor(
        private router: Router,
        public userService: UserService,
        public tweetService: TweetService,
        public modalCtrl: ModalController
    ) {
    }

    public pageNum$ = new BehaviorSubject<number>(1);
    private pagesTotal: number;
    public tweets: Tweet[] = [];
    public tweets$: Observable<Tweet[]> = this.pageNum$.pipe(
        switchMap(pageNum => {
            return this.tweetService.getUserTweets(pageNum)
                .pipe(
                    delay(1000),
                    tap((response: { pages: number, tweets: Tweet[] }) => this.pagesTotal = response.pages),
                    map((response: { pages: number, tweets: Tweet[] }) => this.tweets = this.tweets.concat(response.tweets))
                );
        }),
        share()
    );

    refresh(refresher) {
        console.log('Refreshing...');
        this.pageNum$.next(1);
        this.tweets$.pipe(first()).subscribe(refresher.complete);
    }

    loadData(event) {
        const nextPage = this.pageNum$.getValue() + 1;
        this.pageNum$.next(nextPage);
        this.tweets$.pipe(first()).subscribe(event.complete);
        if (nextPage >= this.pagesTotal) {
            event.enable(false);
        }
    }

    // newTweet() {
    //     this.modalCtrl.create({
    //         component: NewTweetPage
    //     }).present();
    // }

    logout() {
        this.userService.logout();
        this.router.navigate(['/login']);
    }
}
