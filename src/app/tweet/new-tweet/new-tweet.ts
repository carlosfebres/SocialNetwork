import {Component} from '@angular/core';
import {
  ActionSheetController,
  IonicPage,
  LoadingController,
  NavController,
  NavParams,
  ToastController
} from 'ionic-angular';
import {UserService} from "../../services/user.service";


@IonicPage()
@Component({
  selector: 'page-new-tweet',
  templateUrl: 'new-tweet.html',
})
export class NewTweetPage {

  public text: string = "";
  public file: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public userProvider: UserService,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    public actionSheetCtrl: ActionSheetController
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NewTweetPage');
  }

  close() {
    this.navCtrl.pop();
  }

  send() {
    if (this.text) {
      const loader = this.loadingCtrl.create({content: "Please wait..."});
      loader.present();
      this.userProvider.postTweet(this.text, this.file).then(
        res => {
          loader.dismiss();
          this.toastCtrl.create({
            message: "Tweet Created",
            duration: 3000
          }).present();
          this.close();
        },
        (err) => {
          console.log(err);
          this.toastCtrl.create({
            message: JSON.stringify(err),
            duration: 3000
          }).present();
          loader.dismiss();
        }
      ).catch(
        err => {
          console.log(err);
        }
      );
    } else {
      this.toastCtrl.create({
        message: "Tweet Something...",
        duration: 3000
      }).present();
    }
  }

  imageSource: any;

  onFileChanged(fileInput: any) {
    if (fileInput.files[0]) {
      this.file = fileInput.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        this.imageSource = reader.result;
      }
      if (this.file) {
        reader.readAsDataURL(this.file);
      }
    }
  }
}
