import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {UserService} from "../../services/user.service";
import {UserPage} from "../user";

@IonicPage()
@Component({
  selector: 'page-search-users',
  templateUrl: 'search-users.html',
})
export class SearchUsersPage {

  public users: Array<any> = [];
  public clean: boolean = true;
  public observable: any = {closed: true};
  public loading: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public userProvider: UserService) {
  }

  getUsers(evt) {
    this.loading = true;
    setTimeout(() => {
      if (evt.target.value.length) {
        if (!this.observable.closed)
          this.observable.unsubscribe();
        this.observable = this.userProvider.getUsersByName(evt.target.value).subscribe((users: Array<any>) => {
          this.clean = false;
          this.users = users;
          this.loading = false;
        });
      } else {
        this.users = [];
        this.loading = false;
      }
    }, 200);
  }

  goToUserDetail(user) {
    this.navCtrl.push(UserPage, {
      user
    });
  }
}
