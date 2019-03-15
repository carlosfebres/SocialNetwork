import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {UserService} from "../../services/user.service";
import {UserPage} from "../user";

/**
 * Generated class for the UserListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-user-list',
  templateUrl: 'user-list.html',
})
export class UserListPage {

  public usersId: Array<String>;
  public users: Array<any> = [];
  public title: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public userProvider: UserService) {
    this.usersId = this.navParams.get("usersId");
    this.title = this.navParams.get("title");
  }

  ionViewDidLoad() {
    this.userProvider.getUserList(this.usersId).subscribe(
      (data:any) => {
        this.users = data.users;
      }
    );
  }

  goToUserDetail(user) {
    this.navCtrl.push(UserPage, {
      user
    });
  }

}
