import {Component, OnInit} from '@angular/core';
import {ModalController, ToastController} from '@ionic/angular';
import {UserService} from '../services/user.service';
import {Router} from '@angular/router';
import {ConfigPage} from '../config/config.page';
import {SmsService} from '../services/sms.service';
import {FingerprintAuthService} from '../services/fingerprint-auth.service';
import {of} from 'rxjs';
import {catchError, mapTo} from 'rxjs/operators';
import {User} from '../user/user-page/user.page';


@Component({
	selector: 'page-login',
	templateUrl: 'login.page.html',
	styleUrls: ['./login.page.scss']
})
export class LoginPage implements OnInit {

	public email = '';
	public password = '';
	public name = '';
	public username = '';
	public mobile = '';
	public mobileExt = '+58412';

	public loginForm = true;
	public error = 'init';

	constructor(
		private router: Router,
		public userService: UserService,
		public toastController: ToastController,
		private modalController: ModalController,
		private smsService: SmsService,
		private fingerprintAuthService: FingerprintAuthService
	) {
	}

	ngOnInit() {
		this.fingerprint();
	}

	setExt(ext) {
		this.mobileExt = ext;
	}

	fingerprint() {
		this.fingerprintAuthService
			.forLogging()
			.subscribe((loginData: { username: string, password: string }) => {
				this.userService.login(loginData.username, loginData.password);
			});
	}

	execute() {
		this.error = 'init';
		if (this.loginForm) {
			this.login();
		} else {
			this.signUp();
		}
	}

	toast(...messages) {
		messages.forEach((message, index) => {
			console.log(message);
			if (typeof message !== 'string') {
				message = JSON.stringify(message);
			}
			this.toastController.create({
				message,
				duration: 2000 * (messages.length - index)
			}).then(toast => toast.present());
		});
	}

	private login() {
		this.userService.login(this.email.trim(), this.password).subscribe(
			(user: User) => {
				this.fingerprintAuthService.isAvailable().subscribe(isAvailable => {
					let next$;
					if (isAvailable) {
						next$ = this.fingerprintAuthService.storeAuth(this.email, this.password)
							.pipe(
								catchError(() => of(null)),
								mapTo(user)
							);
					} else {
						next$ = of(user);
					}
					next$.subscribe(
						user => this.loginSuccess(user),
						error => {
							console.error(error);
						}
					);
				});
			},
			error => {
				error = error.error.error;
				switch (error) {
					case 'Invalid Input':
						error = 'Fill all inputs.';
						this.error = 'input';
						break;
					case 'Invalid Password':
						this.error = 'password';
						break;
					case 'User not found':
						this.error = 'email';
						break;
					default:
						error = 'Couldn\'t reach server...';
						break;
				}
				this.toastController.create({
					message: error,
					duration: 2000
				}).then(toast => toast.present());
			}
		);
	}

	private loginSuccess(user: User) {
		if (user.mobileVerified) {
			this.router.navigate(['tabs/dashboard']);
		} else {
			this.router.navigate(['verification']);
		}
	}

	private signUp() {
		this.mobile = this.formatMobile(this.mobile);
		if (!this.error || !this.password || !this.name || !this.username || !this.mobile) {
			this.error = 'input';
			this.toastController.create({
				message: 'Fill all inputs.',
				duration: 3000
			}).then(toast => toast.present());
			return;
		}
		this.userService.signUp({
			email: this.email.trim(),
			password: this.password,
			name: this.name.trim(),
			username: this.username.trim().toLowerCase(),
			mobile: this.mobileExt + this.mobile,
			provider: 'local'
		}).subscribe(
			() => this.login(),
			error => {
				console.log(error);
				let msg;
				if (error.error.error.code === 11000) {
					if (error.error.error.errmsg.indexOf('username_') >= 0) {
						this.error = 'username';
						msg = 'Username Already exists';
					} else {
						this.error = 'email';
						msg = 'Email Already exists';
					}
				} else {
					msg = 'Couldn\'t reach sms$...';
				}
				this.toastController.create({
					message: msg,
					duration: 3000
				}).then(toast => toast.present());
			}
		);
	}

	async config() {
		const modal = await this.modalController.create({
			component: ConfigPage
		});
		modal.present();
	}

	private formatMobile(mobile: string) {
		const phoneLength = 7;
		const mobileLength = mobile.length;
		return '0'.repeat(phoneLength - mobileLength) + mobile;
	}
}
