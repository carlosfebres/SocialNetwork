import {Component, Input} from '@angular/core';
import {LoadingController, NavParams, ToastController} from '@ionic/angular';

@IonicPage()
@Component({
    selector: 'page-update-profile-picture',
    templateUrl: 'update-picture.page.html',
})
export class UpdatePicturePage {

    profileImageSrc;
    file: File;
    @Input() title;
    @Input() callback;

    constructor(
        public navParams: NavParams,
        public toastCtrl: ToastController,
        public loadingCtrl: LoadingController
    ) {
    }

    async send() {
        if (this.file) {
            const loader = await this.loadingCtrl.create({message: 'Please wait...'});
            loader.present();
            try {
                await this.callback(this.file);
                loader.dismiss();
                const toast = await this.toastCtrl.create({
                    message: 'Picture Uploaded!',
                    duration: 3000
                });
                toast.present();
                this.dismiss();
            } catch (err) {
                console.log(err);
                const toast = await this.toastCtrl.create({
                    message: 'Error',
                    duration: 3000
                });
                toast.present();
                loader.dismiss();
            }
        } else {
            const toast = this.toastCtrl.create({
                message: 'Choose an Image...',
                duration: 3000
            });
            toast.present();
        }
    }

    onFileChanged(fileInput: any) {
        if (fileInput.files[0]) {
            this.file = fileInput.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                this.profileImageSrc = reader.result;
            };
            if (this.file) {
                reader.readAsDataURL(this.file);
            }
        } else {
            this.file = null;
            this.profileImageSrc = null;
        }
    }

    // TODO implement dismiss
    // dismiss() {
    //     this.viewCtrl.dismiss();
    // }

}
