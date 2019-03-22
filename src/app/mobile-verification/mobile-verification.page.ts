import {Component, OnInit} from '@angular/core';
import {LoadingController, ToastController} from '@ionic/angular';
import {HttpService} from '../services/http.service';
import {UserService} from '../services/user.service';
import {Router} from '@angular/router';
import {tap} from 'rxjs/operators';

@Component({
    selector: 'app-mobile-verification',
    templateUrl: './mobile-verification.page.html',
    styleUrls: ['./mobile-verification.page.scss'],
})
export class MobileVerificationPage implements OnInit {

    code: number;
    load = false;

    constructor(
        public toastController: ToastController,
        public http: HttpService,
        public userService: UserService,
        public router: Router,
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

    private async toast(msg: string) {
        const toast = await this.toastController.create({
            message: msg,
            duration: 3000
        });
        toast.present();
    }

    resend() {
        this.requestCode().subscribe(() => {
            this.toastController.create({
                message: 'Code Resent!',
                duration: 2000
            }).then(toast => toast.present());
        });
    }

    verify() {
        if (this.code) {
            this.http.post(`verify`, {code: this.code}).subscribe(
                (result: any) => {
                    if (result.valid) {
                        this.router.navigate(['tabs/dashboard']);
                        this.userService.user.mobileVerified = true;
                    } else {
                        this.toast('Code Invalid...');
                    }
                }
            );
        } else {
            this.toast('Please Enter a code.');
        }
    }

    mobileFormat(mobile: string) {
        return '0' + mobile.substr(0, 3) + '-' + mobile.substr(3);
    }

    private requestCode() {
        return this.http.get('verification/code').pipe(
            tap(() => console.log('code requested...'))
        );
    }
}
