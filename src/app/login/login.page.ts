import {Component} from '@angular/core';
import {ToastController} from '@ionic/angular';
import {UserService} from '../services/user.service';
import {SMS} from '@ionic-native/sms';
import {FingerprintAIO} from '@ionic-native/fingerprint-aio/ngx';
import {AndroidPermissions} from '@ionic-native/android-permissions';
import {Router} from '@angular/router';


@Component({
    selector: 'page-login',
    templateUrl: 'login.page.html',
    styleUrls: ['./login.page.scss']
})
export class LoginPage {

    public email = 'carlosfebres97@hotmail.com';
    public password = '12312312';
    public name = '';
    public username = '';

    public loginForm = true;
    public error = 'init';

    constructor(
        private router: Router,
        public userProvider: UserService,
        public toastController: ToastController,
        public fingerprint: FingerprintAIO,
        private sms: SMS,
        private androidPermissions: AndroidPermissions
    ) {
    }

    change() {
        this.sendSMS();
        this.loginForm = !this.loginForm;
    }

    execute() {
        this.error = 'init';
        if (this.loginForm) {
            this.login();
        } else {
            this.signup();
        }
    }

    toast(...messages) {
        messages.forEach(message => {
            console.log(message);
            if (typeof message !== 'string') {
                message = JSON.stringify(message);
            }
            this.toastController.create({
                message,
                duration: 1000
            }).then(toast => toast.present());
        });
    }

    private async fingerprintTest() {
        console.log(this.fingerprint);
        const available = await this.fingerprint.isAvailable();
        if (available === 'OK') {
            this.fingerprint.show({
                clientId: 'twitter-app'
            });
        } else {
            alert('Fingerprint Sensor no available');
        }
    }

    private login() {
        this.userProvider.login(this.email, this.password).subscribe(
            user => {
                this.router.navigate(['/tabs']);
            },
            error => {
                if (error === 'Invalid Input') {
                    error = 'Fill all inputs.';
                    this.error = 'input';
                } else if (error === 'Invalid Password') {
                    this.error = 'password';
                } else if (error === 'User not found') {
                    this.error = 'email';
                }
                this.toastController.create({
                    message: error,
                    duration: 3000
                }).then(toast => toast.present());
            }
        );
    }

    private signup() {
        if (!this.error || !this.password || !this.name || !this.username) {
            this.error = 'input';
            this.toastController.create({
                message: 'Fill all inputs.',
                duration: 3000
            }).then(toast => toast.present());
            return;
        }
        this.userProvider.signup({
            email: this.email,
            password: this.password,
            name: this.name,
            username: this.username.toLowerCase(),
            provider: 'local'
        }).subscribe(
            user => {
                this.login();
            }, error => {
                console.log(error);
                if (error.error.error.code === 11000) {
                    let msg;
                    if (error.error.error.errmsg.indexOf('username_') >= 0) {
                        this.error = 'username';
                        msg = 'Username Already exists';
                    } else {
                        this.error = 'email';
                        msg = 'Email Already exists';
                    }
                    this.toastController.create({
                        message: msg,
                        duration: 3000
                    }).then(toast => toast.present());
                }
            }
        );
    }

    private async sendSMS() {

        const hasPermission = await this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.SEND_SMS);
        console.log(hasPermission);

        const requestPermission = await this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.SEND_SMS);
        console.log(requestPermission);

        this.sms.send('4126528445', 'Test SMS.').then(data => {
            this.toast('Message Sent.', data);
        }).catch(error => {
            this.toast('Message Error.', error);
        });
    }
}
