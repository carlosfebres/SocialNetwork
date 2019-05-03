import {Component, OnInit} from '@angular/core';
import {LoadingController} from '@ionic/angular';
import {HttpService} from '../services/http.service';
import {UserService} from '../services/user.service';
import {Router} from '@angular/router';
import {tap} from 'rxjs/operators';
import {HelperService} from '../services/helper.service';

@Component({
	selector: 'app-mobile-verification',
	templateUrl: './mobile-verification.page.html',
	styleUrls: ['./mobile-verification.page.scss'],
})
export class MobileVerificationPage implements OnInit {

	code: string;
	load = false;

	constructor(
		public http: HttpService,
		public userService: UserService,
		public router: Router,
		public helper: HelperService,
		public loadingController: LoadingController
	) {
	}

	ngOnInit() {
		this.loadingController.create({message: 'Sending Code...'}).then(loading => {
			loading.present();
			this.requestCode().subscribe(() => {
				loading.dismiss();
				this.load = true;
			});
		});
	}


	resend() {
		this.requestCode().subscribe(() => this.helper.toast('Code Resent!'));
	}

	verify() {
		if (this.code) {
			this.http.post(`verify`, {code: this.code}).subscribe(
				(result: any) => {
					if (result.valid) {
						this.router.navigate(['tabs/dashboard']);
						this.userService.user.mobileVerified = true;
					} else {
						this.helper.toast('Code Invalid...');
					}
				}
			);
		} else {
			this.helper.toast('Please Enter a code.');
		}
	}

	mobileFormat(mobile: string) {
		return mobile.substr(0, 3) + '-' + mobile.substr(3);
	}

	private requestCode() {
		return this.http.get('verification/code').pipe(
			tap(() => console.log('code requested...'))
		);
	}
}
