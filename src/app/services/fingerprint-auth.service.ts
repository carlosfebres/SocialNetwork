import {Injectable} from '@angular/core';
import {AFAEncryptResponse, AndroidFingerprintAuth} from '@ionic-native/android-fingerprint-auth/ngx';
import {from, Observable, of, throwError} from 'rxjs';
import {catchError, map, switchMap, tap} from 'rxjs/operators';
import {Storage} from '@ionic/storage';
import {UserService} from './user.service';


@Injectable({
    providedIn: 'root'
})
export class FingerprintAuthService {

    private readonly clientId = 'twitter-app';

    constructor(
        private androidFingerprintAuth: AndroidFingerprintAuth,
        private storage: Storage,
        private userService: UserService
    ) {
    }

    isAvailable(): Observable<boolean> {
        return from(this.androidFingerprintAuth.isAvailable())
            .pipe(
                map(result => result.isAvailable),
                catchError(() => of(false))
            );
    }

    getStoreAuth(email: string, token: string): Observable<string> {
        return from(this.androidFingerprintAuth.decrypt({clientId: this.clientId, username: email, token: token}))
            .pipe(
                tap(result => {
                    if (!result.withBackup && !result.withFingerprint) {
                        throw new Error('Authentication Error');
                    }
                }),
                map(result => result.password)
            );
    }

    storeAuth(email: string, password: string): Observable<AFAEncryptResponse> {
        return from(this.androidFingerprintAuth.encrypt({clientId: this.clientId, username: email, password: password}))
            .pipe(
                tap((result: AFAEncryptResponse) => {
                    if (result.withBackup || result.withFingerprint) {
                        this.storage.set('fingerprintToken', result.token);
                        this.storage.set('fingerprintUsername', email);
                        console.log('Auth saved with fingerprint');
                    } else {
                        throw new Error('Didn\'t authenticate');
                    }
                })
            );
    }

    forLogging() {
        let fingerprintUsername;
        return from(this.storage.get('fingerprintUsername'))
            .pipe(
                tap(username => {
                    console.log('fingerprintUsername: ', username);
                    if (username) {
                        fingerprintUsername = username;
                    } else {
                        throw new Error();
                    }
                }),
                switchMap(() => this.storage.get('fingerprintToken')),
                switchMap(
                    (token: any) => this.getStoreAuth(fingerprintUsername, token)
                        .pipe(
                            catchError(err => {
                                return from(this.storage.remove('fingerprintToken'))
                                    .pipe(
                                        switchMap(() => this.storage.remove('fingerprintUsername')),
                                        switchMap(() => throwError(err))
                                    );
                            })
                        )
                ),
                switchMap(password => this.userService.login(fingerprintUsername, password))
            );
    }
}
