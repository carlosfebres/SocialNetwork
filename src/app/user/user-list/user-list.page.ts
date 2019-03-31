import {Component} from '@angular/core';
import {UserService} from '../../services/user.service';
import {User} from '../user-page/user.page';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {merge, Observable, Subject} from 'rxjs';
import {switchMap, switchMapTo, tap} from 'rxjs/operators';

@Component({
    selector: 'page-user-list',
    templateUrl: './user-list.page.html',
    styleUrls: ['./user-list.page.scss']
})
export class UserListPage {

    action: string;
    private user: User;
    user$: Observable<User> = this.route.paramMap
        .pipe(
            switchMap((params: ParamMap) => this.userProvider.getUserByUsername(params.get('username'))),
            tap(user => this.user = user)
        );

    private refresher$ = new Subject();
    users$: Observable<User[]> = merge(this.user$, this.refresher$).pipe(
        switchMapTo(this.route.data),
        tap(routeData => this.action = routeData.action),
        switchMap(routeData => this.userProvider.getUserList(this.user[routeData.action]))
    );

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        public userProvider: UserService
    ) {
    }

    ionViewWillEnter() {
        if (this.user) {
            console.log('Refreshing List');
            this.refresher$.next(null);
        }
    }

    goToUserDetail(user: User) {
        this.router.navigate(['tabs/user', user.username]);
    }

}
