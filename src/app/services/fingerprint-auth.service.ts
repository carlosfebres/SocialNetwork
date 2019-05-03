import {Injectable} from '@angular/core';
import {AFAEncryptResponse, AndroidFingerprintAuth} from '@ionic-native/android-fingerprint-auth/ngx';
import {from, NEVER, Observable, of} from 'rxjs';
import {catchError, map, switchMap, tap} from 'rxjs/operators';
import {Storage} from '@ionic/storage';


@Injectable({
	providedIn: 'root'
})
export class FingerprintAuthService {

	private readonly clientId = 'twitter-app';

	constructor(
		private androidFingerprintAuth: AndroidFingerprintAuth,
		private storage: Storage
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
				switchMap(result => {
					if (!result.withBackup && !result.withFingerprint) {
						return NEVER;
					}
					return of(result.password);
				})
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

	forLogging(): Observable<never | { username: string, password: string }> {
		let username: string;
		return from(this.storage.get('fingerprintUsername'))
			.pipe(
				switchMap(fingerprintUsername => {
					if (fingerprintUsername) {
						username = fingerprintUsername;
						return of(fingerprintUsername);
					}
					return NEVER;
				}),
				switchMap(() => this.storage.get('fingerprintToken')),
				switchMap((token: any) => this.getStoreAuth(username, token)),
				map(password => ({username, password}))
			);
	}
}
