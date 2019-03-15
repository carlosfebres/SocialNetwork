import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, ToastController} from 'ionic-angular';
import {UserService} from "../services/user.service";
import {TabsPage} from "../tabs/tabs.page";
import {SMS} from "@ionic-native/sms";
import {FingerprintAIO} from "@ionic-native/fingerprint-aio/ngx";
import {AndroidPermissions} from "@ionic-native/android-permissions";


@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  public email: string = "carlosfebres97@hotmail.com";
  public password: string = "12312312";
  public name: string = "";
  public username: string = "";

  public loginForm: boolean = true;
  public error = "init";

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public userProvider: UserService,
    public toastCtrl: ToastController,
    public fingerprint: FingerprintAIO,
    private sms: SMS,
    private androidPermissions: AndroidPermissions
  ) {
  }

  change() {
    this.sendSMS();
    this.loginForm = !this.loginForm
  }

  execute() {
    this.error = "init";
    if (this.loginForm) {
      this.login();
    } else {
      this.signup();
    }
  }

  toast(...messages) {
    messages.forEach(message => {
      console.log(message);
      if (typeof message !== "string") {
        message = JSON.stringify(message);
      }
      this.toastCtrl.create({
        message,
        duration: 1000
      }).present();
    })
  }

  private async fingerprintTest() {
    console.log(this.fingerprint);
    const available = await this.fingerprint.isAvailable();
    if (available == "OK") {
      this.fingerprint.show({
        clientId: "twitter-app"
      });
    } else {
      alert("Fingerprint Sensor no available");
    }
  }

  private login() {
    this.userProvider.login(this.email, this.password).then(
      user => {
        this.navCtrl.setRoot(TabsPage);
      }
    ).catch(
      error => {
        if (error.error.error == "Invalid Input") {
          error.error.error = "Fill all inputs.";
          this.error = "input";
        } else if (error.error.error == "Invalid Password") {
          this.error = "password";
        } else if (error.error.error == "User not found") {
          this.error = "email";
        }
        this.toastCtrl.create({
          message: error.error.error,
          duration: 3000
        }).present();
      }
    )
  }

  private signup() {
    if (!this.error || !this.password || !this.name || !this.username) {
      this.error = "input"
      this.toastCtrl.create({
        message: "Fill all inputs.",
        duration: 3000
      }).present();
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
        if (error.error.error.code == 11000) {
          let msg;
          if (error.error.error.errmsg.indexOf("username_") >= 0) {
            this.error = "username";
            msg = "Username Already exists";
          } else {
            this.error = "email"
            msg = "Email Already exists";
          }
          this.toastCtrl.create({
            message: msg,
            duration: 3000
          }).present();
        }
      }
    )
  }

  private async sendSMS() {

    let hasPermision = await this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.SEND_SMS);

    console.log(hasPermision);

    let requestPermision = await this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.SEND_SMS);

    console.log(requestPermision);

    this.sms.send('4126528445', 'Test SMS.').then( data => {
      this.toast("Message Sent.", data);
    }).catch(error=> {
      this.toast("Message Error.", error);
    })
  }
}
