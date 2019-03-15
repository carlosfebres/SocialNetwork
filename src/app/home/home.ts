import {Component} from '@angular/core';
import {UserService} from "../services/user.service";
import {NewTweetPage} from "../tweet/new-tweet/new-tweet";
import {LoginPage} from "../login/login";
import {ModalController, NavController} from '@ionic/angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  public user: any;
  public tweets: any = {
    tweets: []
  };

  constructor(public navCtrl: NavController, public userProvider: UserService, public modalCtrl: ModalController) {
    this.user = userProvider.user;
  }

  ionViewDidLoad() {
    this.userProvider.getDashboardTweets().then((page: any) => {
        this.tweets = page;
      }
    )
  }

  refresh(refresher) {
    console.log("Refresing...");
    setTimeout(() => {
      this.userProvider.usersTweets.page = 1;
      this.userProvider.getDashboardTweets(true).then((page: any) => {
          this.tweets = page;
          refresher.complete();
        }
      )
    }, 500)
  }

  loadData(event) {
    setTimeout(() => {
      this.userProvider.getDashboardTweets().then((page: any) => {
          this.tweets = page;
          event.complete();
          if (page.page > page.totalPages)
            event.enable(false);
        }
      );
    }, 1000)
  }

  newTweet() {
    this.modalCtrl.create(NewTweetPage).present();
  }

  logout() {
    this.userProvider.logout();
    this.navCtrl.parent.parent.setRoot(LoginPage);
  }
}
