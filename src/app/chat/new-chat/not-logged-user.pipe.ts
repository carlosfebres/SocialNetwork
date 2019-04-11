import {Pipe, PipeTransform} from '@angular/core';
import {User} from '../../user/user-page/user.page';
import {UserService} from '../../services/user.service';
import {first, map} from 'rxjs/operators';

@Pipe({
    name: 'notLoggedUser'
})
export class NotLoggedUserPipe implements PipeTransform {

    constructor(
        public userService: UserService
    ) {
    }

    transform(users: User[]): any {
        return this.userService.user$.pipe(
            first(),
            map((loggedUser: User) => users.filter((user: User) => user._id !== loggedUser._id))
        );
    }

}
