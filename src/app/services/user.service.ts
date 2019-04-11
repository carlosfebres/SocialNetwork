import {Injectable} from '@angular/core';
import {HttpService} from './http.service';
import {User} from '../user/user-page/user.page';
import {BehaviorSubject, from, Observable} from 'rxjs';
import {map, switchMap, tap} from 'rxjs/operators';
import {Storage} from '@ionic/storage';

@Injectable({
    providedIn: 'root'
})
export class UserService {

    public user$: BehaviorSubject<User> = new BehaviorSubject(<User>{});
    public user: User = {} as User;

    private _users: User[] = [];
    private _usernames: string[] = [];

    constructor(
        public http: HttpService,
        private storage: Storage
    ) {
    }

    getLoggedUserFromServer(): Observable<User> {
        return this.http.get('user')
            .pipe(
                map((response: { user: User }) => response.user),
                map(user => this.storageSetUser(user)),
                tap(user => {
                    console.log('User from server: ', user);
                    this.user = user;
                })
            );
    }

    getLoggedUser(): Observable<User> {
        if (this.user$.getValue()._id) {
            return this.user$;
        }
        return from(this.storage.get('token'))
            .pipe(
                tap(token => {
                    if (!this.http.getToken() && token) {
                        this.http.setToken(token);
                    }
                }),
                switchMap(() => this.getLoggedUserFromServer())
            );
    }

    login(email, password): Observable<User> {
        return this.http.post('login', {email, password})
            .pipe(
                map((response: any) => response.user),
                map(user => this.storageSetUser(user)),
                tap((user: User) => {
                    this.user = user;
                    this.user$.next(user);
                    this.http.setToken(user.token);
                    this.storage.set('token', user.token);
                })
            );
    }

    signUp(data) {
        return this.http.post('signup', data);
    }

    getUsersByName(value: String): Observable<User[]> {
        return this.http.post('user/search', {search: value})
            .pipe(
                map(
                    (users: User[]) => users.map(user => this.storageSetUser(user))
                )
            );
    }


    getUserByUsername(username: string): Observable<User> {
        if (this.user.username === username) {
            return this.getLoggedUser();
        } else {
            return this.http.get(`user/${encodeURIComponent(username)}`)
                .pipe(
                    map((response: any) => response.user),
                    map(user => this.storageSetUser(user))
                );
        }
    }

    updateInfo(data: any): Observable<User> {
        return this.http.put('user', data).pipe(
            map((response: any) => response.user),
            map(user => this.storageSetUser(user))
        );
    }

    getUserList(users_id: string[]): Observable<User[]> {
        return this.http.post('user/getList', {ids: users_id})
            .pipe(
                map((response: any) => response.users),
                map(
                    (users: User[]) => users.map(user => this.storageSetUser(user))
                )
            );
    }


    unFollow(id: string): Observable<void | {}> {
        return this.http.delete(`user/${id}/follow`).pipe(
            tap(() => {
                const index = this.user.following.indexOf(id);
                if (index > -1) {
                    this.user.following.splice(index, 1);
                }
            })
        );
    }

    follow(id: string): Observable<void | {}> {
        return this.http.post(`user/${id}/follow`, {}).pipe(
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

        return this.http.post('user/photo', formData)
            .pipe(
                map((data: any) => data.user),
                map(user => this.storageSetUser(user))
            );
    }

    // TODO Remove Storage in HTTPService
    logout() {
        this.user = null;
        this.storage.remove('token');
        this.storage.remove('fingerprintToken');
        this.storage.remove('fingerprintUsername');
        this.http.removeToken();
    }

    getUsersByPhone(numbers: string[]): Observable<User[]> {
        return this.http.post('users/phone', {numbers}).pipe(
            map((result: { users: User[] }) => result.users)
        );
    }


    private storageSetUser(user: User): User {
        let storageUser = this.storageGetUser(user.username);
        if (storageUser) {
            Object.keys(user).forEach(x => {
                storageUser[x] = user[x];
            });
        } else {
            this._usernames.push(user.username);
            this._users.push(user);
            storageUser = user;
        }
        return storageUser;
    }

    private storageGetUser(username: string): User {
        const index = this._usernames.indexOf(username);
        return this._users[index];
    }
}
