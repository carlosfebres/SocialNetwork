import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HelperService} from './helper.service';

interface Options {
    headers?: HttpHeaders | {
        [header: string]: string | string[];
    };
    observe?: 'body';
    params?: HttpParams | {
        [param: string]: string | string[];
    };
    reportProgress?: boolean;
    responseType?: 'json';
    withCredentials?: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class HttpService {

    defaultHeaders: any = {};


    constructor(public http: HttpClient, public helper: HelperService) {
        console.log('Hello HttpProvider Provider');

    }

    setToken(token: String) {
        this.defaultHeaders.Authorization = 'Bearer ' + token;
    }

    removeToken() {
        if (this.defaultHeaders.Authorization) {
            delete this.defaultHeaders.Authorization;
        }
    }

    public post<T>(url: string, body: any | null, options?: Options): Observable<T> {
        options = this._headers(options);
        return this.http.post<T>(this.helper.getUrl(url), body, options);
    }


    public get<T>(url: string, options?: Options): Observable<T> {
        options = this._headers(options);
        return this.http.get<T>(this.helper.getUrl(url), options);
    }

    delete<T>(url: string, options?: Options): Observable<T> {
        options = this._headers(options);
        return this.http.delete<T>(this.helper.getUrl(url), options);
    }


    put<T>(url: string, body: any | null, options?: Options): Observable<T> {
        options = this._headers(options);
        return this.http.put<T>(this.helper.getUrl(url), body, options);
    }


    private _headers(options) {
        if (JSON.stringify(this.defaultHeaders) !== '{}') {
            if (!options) {
                options = {};
            }
            if (!options.headers) {
                options.headers = new HttpHeaders(this.defaultHeaders);
            } else if (options.headers instanceof HttpHeaders) {
                for (const x of Object.keys(this.defaultHeaders)) {
                    options.headers.append(x, this.defaultHeaders[x]);
                }
            }
        }
        return options;
    }

}
