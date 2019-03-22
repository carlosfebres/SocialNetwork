import {Component} from '@angular/core';
import {LoadingController, ModalController, ToastController} from '@ionic/angular';
import {UserService} from '../../services/user.service';
import {TweetService} from '../../services/tweets.service';


@Component({
    selector: 'page-new-tweet',
    templateUrl: './new-tweet.page.html',
    styleUrls: ['./new-tweet.page.scss']
})
export class NewTweetPage {

    constructor(
        public userService: UserService,
        public tweetService: TweetService,
        public toastCtrl: ToastController,
        public loadingCtrl: LoadingController,
        public modalController: ModalController
    ) {
    }

    text = '';
    file: any;
    imageSource: any;

    async send() {
        if (this.text) {
            const loader = await this.loadingCtrl.create({message: 'Please wait...'});
            loader.present();
            this.tweetService.postTweet(this.text, this.file).subscribe(
                res => {
                    loader.dismiss();
                    this.toastCtrl.create({
                        message: 'Tweet Created',
                        duration: 3000
                    }).then(toast => toast.present());
                    this.modalController.dismiss(true);
                },
                (err) => {
                    console.log(err);
                    this.toastCtrl.create({
                        message: JSON.stringify(err),
                        duration: 3000
                    }).then(toast => toast.present());
                    loader.dismiss();
                }
            );
        } else {
            this.toastCtrl.create({
                message: 'Tweet Something...',
                duration: 3000
            }).then(toast => toast.present());
        }
    }

    close() {
        this.modalController.dismiss();
    }

    onFileChanged(fileInput: any) {
        if (fileInput.files[0]) {
            this.file = fileInput.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                this.imageSource = reader.result;
            };
            if (this.file) {
                reader.readAsDataURL(this.file);
            }
        }
    }
}
