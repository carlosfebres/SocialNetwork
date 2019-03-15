import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, ToastController} from 'ionic-angular';
import {UserService} from "../../services/user.service";

/**
 * Generated class for the UserInfoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-user-info',
  templateUrl: 'user-info.html',
})
export class UserInfoPage {

  public data: any = {
    email: "",
    username: "",
    name: ""
  };

  constructor(public navCtrl: NavController, public navParams: NavParams, public userProvider: UserService, public toastCtrl: ToastController) {
    this.data.email = userProvider.user.email;
    this.data.username = userProvider.user.username;
    this.data.name = userProvider.user.name;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UserInfoPage');
  }

  update() {
    if (!this.data.email || !this.data.name || !this.data.username) {
      this.toastCtrl.create({
        message: "Fill all inputs.",
        duration: 3000
      }).present();
      return;
    }

    this.userProvider.updateInfo(this.data).then(
      user => {
        this.navCtrl.pop();
      }
    ).catch( error => {
      console.log(error);
      if (error.error.error.code == 11000) {
        let msg;
        if (error.error.error.errmsg.indexOf("username_")>=0) {
          msg = "Username Already exists";
        } else {
          msg = "Email Already exists";
        }
        this.toastCtrl.create({
          message: msg,
          duration: 3000
        }).present();
      }
    });
  }

}
