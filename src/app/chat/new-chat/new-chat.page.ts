import {Component, OnInit} from '@angular/core';
import {UserService} from '../../services/user.service';
import {Subject} from 'rxjs';
import {User} from '../../user/user.page';
import {debounceTime, distinctUntilChanged, filter, switchMap, tap} from 'rxjs/operators';
import {Router} from '@angular/router';


@Component({
    selector: 'page-new-chat',
    templateUrl: './new-chat.page.html',
    styleUrls: ['./new-chat.page.scss']
})
export class NewChatPage implements OnInit {


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
            switchMap(value => this.userProvider.getUsersByName<User[]>(value)),
            tap(users => {
                this.clean = false;
                this.users = users;
            })
        );
    }

    search(event) {
        this.searchTerm.next(event.target.value);
    }

    createChat(user: User) {
        this.router.navigate(['chat', user.username]);
    }

}
