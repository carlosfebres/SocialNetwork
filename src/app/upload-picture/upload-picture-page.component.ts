import {Component} from '@angular/core';
import {ModalController, NavParams, ToastController} from '@ionic/angular';
import {HelperService} from '../services/helper.service';

@Component({
    selector: 'page-update-profile-picture',
    templateUrl: './upload-picture-page.component.html',
    styleUrls: ['./upload-picture-page.component.scss']
})
export class UploadPicturePage {

    profileImageSrc;
    file: File;
    title = '';

    constructor(
        private navParams: NavParams,
        private modalController: ModalController,
        private helper: HelperService
    ) {
    }

    ionViewWillEnter() {
        this.title = this.navParams.get('title');
    }

    async send() {
        if (this.file) {
            this.modalController.dismiss(this.file);
        } else {
            this.helper.toast('Choose an Image...');
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

}
