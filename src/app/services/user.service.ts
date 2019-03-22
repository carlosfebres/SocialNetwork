import {Injectable} from '@angular/core';
import {HttpService} from './http.service';
import {User} from '../user/user-page/user.page';
import {BehaviorSubject, from, interval, merge, Observable, of} from 'rxjs';
import {debounceTime, map, share, switchMap, tap} from 'rxjs/operators';
import {Storage} from '@ionic/storage';

@Injectable({
    providedIn: 'root'
})
export class UserService {

    public user: User = <User>{};
    public users: User[] = [];
    private refresherUser$ = new BehaviorSubject(null);
    private user$: Observable<User> = merge(
        interval(10000)
            .pipe(
                tap(() => console.log('Refreshing User...'))
            ),
        this.refresherUser$
    ).pipe(
        debounceTime(2000),
        switchMap(() => this.http.get('user')
            .pipe(
                map((response: any) => {
                    if (response === 'Unauthorized') {
                        this.http.removeToken();
                        throw new Error('No user logged');
                    }
                    return response.user;
                }),
                tap(user => {
                    console.log('User: ', user);
                    if (!this.user._id) {
                        for (const x of Object.keys(user)) {
                            this.user[x] = user[x];
                        }
                    } else {
                        this.user = user;
                    }
                })
            )),
        share()
    );

    constructor(
        public http: HttpService,
        private storage: Storage
    ) {
    }

    refreshUser() {
        this.refresherUser$.next(null);
    }

    getLoggedUser(refresh: boolean = false): Observable<User> {
        console.log(this.user);
        if (this.user._id && !refresh) {
            return of(this.user);
        } else {
            return from(this.storage.get('token'))
                .pipe(
                    tap(token => {
                        console.log('Token: ', token);
                        if (!this.http.getToken() && token) {
                            console.log(this.http.getToken(), token);
                            this.http.setToken(token);
                        }
                    }),
                    switchMap(() => this.user$)
                );
        }
    }

    login(email, password): Observable<User> {
        return this.http.post('login', {email, password})
            .pipe(
                tap((response: any) => {
                    this.user = response.user;
                    this.http.setToken(this.user.token);
                }),
                map((response: any) => response.user),
                tap(user => this.storage.set('token', user.token))
            );
    }

    signup(data) {
        return this.http.post('signup', data);
    }


    getUsersByName(value: String): Observable<User[]> {
        return this.http.post('users/search', {search: value});
    }


    getUserByUsername(username: string): Observable<User> {
        return this.http.post('user/username', {username})
            .pipe(
                map((response: any) => response.user)
            );
    }

    getUser(_id: String): Observable<User> {
        return this.http.get(`users/${_id}`);
    }

    updateInfo(data: any) {
        return this.http.put('users', data).pipe(
            map((response: any) => response.user),
            tap(user => {
                this.user.name = user.name;
                this.user.email = user.email;
                this.user.username = user.username;
            })
        );
    }

    getUserList(users_id: string[]) {
        return this.http.post('users/get', {ids: users_id})
            .pipe(
                map((response: any) => response.users)
            );
    }


    unFollow(id: string) {
        return this.http.delete(`users/${id}/follow`).pipe(
            tap(() => {
                const index = this.user.following.indexOf(id);
                if (index > -1) {
                    this.user.following.splice(index, 1);
                }
            })
        );
    }

    follow(id: string) {
        return this.http.post(`users/${id}/follow`, {}).pipe(
            tap(() => {
                const index = this.user.following.indexOf(id);
                if (index === -1) {
                    this.user.following.push(id);
                }
            })
        );
    }


    updateProfilePicture(file: File): Observable<User> {
        const formData = new FormData();
        formData.append('image', file, file.name);

        return this.http.post('users/photo', formData)
            .pipe(
                map((data: any) => data.user),
                tap(user => this.user.profileImage = user.profileImage)
            );
    }

    logout() {
        this.user = null;
        this.storage.remove('token');
        this.storage.remove('fingerprintToken');
        this.storage.remove('fingerprintUsername');
        this.http.removeToken();
    }
}
