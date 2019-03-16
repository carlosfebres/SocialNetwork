import {Component, OnInit} from '@angular/core';
import {UserService} from '../../services/user.service';
import {Router} from '@angular/router';
import {User} from '../user.page';
import {Subject} from 'rxjs';
import {debounceTime, distinctUntilChanged, filter, switchMap, tap} from 'rxjs/operators';

@Component({
    selector: 'page-search-users',
    templateUrl: './search-users.page.html',
    styleUrls: ['./search-users.page.scss']
})
export class SearchUsersPage implements OnInit {

    public users: User[] = [];
    public clean = true;
    private searchTerm = new Subject<string>();

    constructor(
        public userProvider: UserService,
        private router: Router
    ) {
    }

    ngOnInit() {
        this.searchTerm.pipe(
            filter(value => value.length > 2),
            debounceTime(1000),
            distinctUntilChanged(),
            switchMap(value => this.userProvider.getUsersByName(value)),
            tap(users => {
                this.clean = false;
                this.users = users;
            })
        );
    }

    search(event) {
        this.searchTerm.next(event.target.value);
    }

    goToUserDetail(user: User) {
        this.router.navigate(['user', user.username]);
    }
}
