import {Component} from '@angular/core';
import {UserService} from '../../services/user.service';
import {ToastController} from '@ionic/angular';
import {User} from '../user.page';


@Component({
    selector: 'page-user-info',
    templateUrl: 'user-info.html',
})
export class UserInfoPage {

    public data: User = {
        email: '',
        username: '',
        name: ''
    };

    constructor(
        public toastCtrl: ToastController,
        public userService: UserService
    ) {
        this.data.email = userService.user.email;
        this.data.username = userService.user.username;
        this.data.name = userService.user.name;
    }

    update() {
        if (!this.data.email || !this.data.name || !this.data.username) {
            this.toastCtrl.create({
                message: 'Fill all inputs.',
                duration: 3000
            }).then(toast => toast.present());
            return;
        }

        this.userService.updateInfo(this.data).then(
            user => {
                this.navCtrl.pop();
            }
        ).catch(error => {
            console.log(error);
            if (error.error.error.code === 11000) {
                let msg;
                if (error.error.error.errmsg.indexOf('username_') >= 0) {
                    msg = 'Username Already exists';
                } else {
                    msg = 'Email Already exists';
                }
                this.toastCtrl.create({
                    message: msg,
                    duration: 3000
                }).then(toast => toast.present());
            }
        });
    }

}
