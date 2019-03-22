import {Component, ViewChild} from '@angular/core';
import {UserService} from '../services/user.service';
import {ModalController} from '@ionic/angular';
import {Tweet, TweetService} from '../services/tweets.service';
import {BehaviorSubject, interval, merge, Observable, timer} from 'rxjs';
import {first, map, share, switchMap, tap} from 'rxjs/operators';
import {Router} from '@angular/router';
import {NewTweetPage} from '../tweet/new-tweet/new-tweet.home';

@Component({
    selector: 'page-home',
    templateUrl: './home.page.html',
    styleUrls: ['./home.page.scss']
})
export class HomePage {

    @ViewChild('infinite') infiniteScroll;

    constructor(
        private router: Router,
        public userService: UserService,
        public tweetService: TweetService,
        public modalCtrl: ModalController
    ) {
    }

    private pagesTotal: number;

    public pageNum$ = new BehaviorSubject<number>(1);
    public interval$ = interval(15000);

    public tweets: Tweet[][];
    public tweets$: Observable<Tweet[]> = merge(this.pageNum$, this.interval$)
        .pipe(
            switchMap(() => {
                return this.tweetService.getUserTweets(this.pageNum$.getValue())
                    .pipe(
                        tap((response: { pages: number, tweets: Tweet[] }) => this.pagesTotal = response.pages),
                        map((response: { pages: number, tweets: Tweet[] }) => response.tweets),
                        map(tweets => {
                            if (this.pageNum$.getValue() === 1) {
                                this.tweets = [];
                            }
                            this.tweets[this.pageNum$.getValue()] = tweets;
                            return this.tweets.reduce((x, y) => x.concat(y), []);
                        })
                    );
            }),
            share()
        );

    refresh(refresher) {
        console.log('Refreshing...');
        timer(1000).subscribe(() => this.pageNum$.next(1));
        this.tweets$.pipe(first()).subscribe(() => {
            this.infiniteScroll.disabled = false;
            refresher.target.complete();
        });
    }

    loadData(event) {
        const nextPage = this.pageNum$.getValue() + 1;
        if (nextPage <= this.pagesTotal) {
            timer(1000).subscribe(() => {
                this.pageNum$.next(nextPage);
                this.tweets$.pipe(first()).subscribe(event.target.complete);
            });
        } else {
            event.target.disabled = true;
        }
    }

    async newTweet() {
        const modal = await this.modalCtrl.create({
            component: NewTweetPage
        });
        modal.onDidDismiss().then(value => {
            if (value.data) {
                this.pageNum$.next(1);
            }
        });
        modal.present();
    }

    logout() {
        this.userService.logout();
        this.router.navigate(['/login']);
    }
}
