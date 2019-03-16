import {Injectable} from '@angular/core';
import {HttpService} from './http.service';
import {User} from '../user/user.page';
import {Observable} from 'rxjs';
import {catchError, map, tap} from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class UserService {

    public user: User = {};
    public users: User[] = [];

    constructor(public http: HttpService) {
    }

    login(email, password): Observable<User> {
        return this.http.post<User>('login', {email, password})
            .pipe(
                tap(response => {
                    if (!response.error) {
                        this.user = response.user;
                        this.http.setToken(this.user.token);
                    } else {
                        throw new Error('Invalid Login!');
                    }
                }),
                map(response => response.user),
                catchError(err => err.error.error)
            );
    }

    signup(data) {
        return this.http.post('signup', data);
    }


    getUsersByName(value: String): Observable<User[]> {
        return this.http.post<User[]>('users/search', {search: value});
    }


    getUserByUsername(username: string) {
        return this.http.post<User>('user/username', {username})
            .pipe(
                map(response => response.user)
            );
    }

    getUser(_id: String): Observable<User> {
        return this.http.get<User>(`users/${_id}`);
    }

    updateInfo(data: any) {
        return new Promise((resolve, reject) => {
            this.http.put('users', data).subscribe(
                (responseData: any) => {
                    this.user.name = responseData.user.name;
                    this.user.email = responseData.user.email;
                    this.user.username = responseData.user.username;
                    resolve(this.user);
                },
                error => {
                    reject(error);
                }
            );
        });
    }

    getUserList(users_id: string[]) {
        return this.http.post('users/get', {ids: users_id})
            .pipe(
                map(response => response.users)
            );
    }


    unfollow(id: string) {
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


    updateProfilePicture(file: File) {
        return new Promise((resolve, reject) => {
            const formData = new FormData();
            formData.append('image', file, file.name);

            this.http.post('users/photo', formData).subscribe(
                (data: any) => {
                    this.user.profileImage = data.user.profileImage;
                    resolve(data);
                },
                reject
            );
        });
    }

    logout() {
        this.user = null;
        this.http.removeToken();
    }
}
