import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router} from '@angular/router';
import {Observable, of} from 'rxjs';
import {UserService} from '../services/user.service';
import {catchError, mapTo} from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class LoggedGuard implements CanActivate {

    constructor(
        public userService: UserService,
        public router: Router
    ) {
    }

    canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
        console.log('Checking if logged...');
        return this.userService.getLoggedUser()
            .pipe(
                mapTo(true),
                catchError(err => {
                    console.log(err);
                    this.router.navigate(['login']);
                    return of(false);
                })
            );
    }
}
