import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {User} from '../user/user';


export interface Tweet {
    user: User;
    comments: Array<any>;
    _id: string;
}

@Injectable({
    providedIn: 'root'
})
export class TweetsService {

    constructor(public http: HttpClient) {
        console.log('Hello TweetsProvider Provider');
    }

}
