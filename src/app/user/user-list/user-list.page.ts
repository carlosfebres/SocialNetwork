import {Component} from '@angular/core';
import {UserService} from '../../services/user.service';
import {User} from '../user.page';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {Observable} from 'rxjs';
import {switchMap, tap} from 'rxjs/operators';

@Component({
    selector: 'page-user-list',
    templateUrl: './user-list.page.html',
    styleUrls: ['./user-list.page.scss']
})
export class UserListPage {

    action: string;
    title: string;
    users: User[];
    users$: Observable<User[]> = this.route.paramMap.pipe(
        tap((params: ParamMap) => this.action = params.get('action')),
        switchMap((params: ParamMap) => this.userProvider.getUserByUsername(params.get('username'))),
        switchMap(user => this.userProvider.getUserList(user[this.action])),
        tap(users => this.users = users)
    );

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        public userProvider: UserService
    ) {
    }


    goToUserDetail(user: User) {
        this.router.navigate(['user', user.username]);
    }

}
