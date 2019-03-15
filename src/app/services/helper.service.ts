import {Injectable} from '@angular/core';


@Injectable({
    providedIn: 'root'
})
export class HelperService {

    static readonly base_url: string = 'http://192.168.43.7:3000/';

    public getUrl(path) {
        return HelperService.base_url + path;
    }

}
