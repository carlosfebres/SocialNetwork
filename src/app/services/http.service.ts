import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable, pipe, throwError} from 'rxjs';
import {HelperService} from './helper.service';
import {catchError} from 'rxjs/operators';
import {Router} from '@angular/router';

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
    private token;

    constructor(
        private router: Router,
        public http: HttpClient,
        public helper: HelperService
    ) {
    }

    setToken(token: String) {
        this.token = token;
        this.defaultHeaders.Authorization = 'Bearer ' + token;
    }

    getToken() {
        return this.token;
    }

    removeToken() {
        if (this.defaultHeaders.Authorization) {
            this.token = '';
            delete this.defaultHeaders.Authorization;
        }
    }

    public post<T>(url: string, body: any | null, options?: Options): Observable<T> {
        return this.http.post<T>(this.helper.getUrl(url), body, this._headers(options))
            .pipe(this.handleError()) as Observable<T>;
    }


    public get<T>(url: string, options?: Options): Observable<T> {
        return this.http.get<T>(this.helper.getUrl(url), this._headers(options))
            .pipe(this.handleError()) as Observable<T>;
    }

    delete<T>(url: string, options?: Options): Observable<T> {
        return this.http.delete<T>(this.helper.getUrl(url), this._headers(options))
            .pipe(this.handleError()) as Observable<T>;
    }


    put<T>(url: string, body: any | null, options?: Options): Observable<T> {
        return this.http.put<T>(this.helper.getUrl(url), body, this._headers(options))
            .pipe(this.handleError()) as Observable<T>;
    }

    private _headers(options) {
        if (JSON.stringify(this.defaultHeaders) !== '{}') {
            options = options || {};
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


    private handleError() {
        return pipe(
            catchError((err: HttpErrorResponse) => {
                    console.log(err);
                    if (err.error === 'Unauthorized') {
                        this.removeToken();
                        this.router.navigate(['login']);
                        this.helper.toast('Session invalid');
                        throw new Error('No user logged');
                    }
                    return throwError(err);
                }
            )
        );
    }

}
