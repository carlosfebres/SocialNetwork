import {Component} from '@angular/core';
import {HelperService} from '../services/helper.service';
import {Storage} from '@ionic/storage';
import {ModalController, ToastController} from '@ionic/angular';
import {Router} from '@angular/router';

@Component({
    selector: 'app-config',
    templateUrl: './config.page.html',
    styleUrls: ['./config.page.scss'],
})
export class ConfigPage {

    serverAddress = this.helper.serverAddress;
    serverPort = this.helper.serverPort;

    constructor(
        public helper: HelperService,
        private storage: Storage,
        private toastController: ToastController,
        private modalController: ModalController,
        private router: Router
    ) {
    }

    async save() {
        await this.storage.set('serverAddress', this.serverAddress);
        await this.storage.set('serverPort', this.serverPort);

        this.helper.serverAddress = this.serverAddress;
        this.helper.serverPort = this.serverPort;

        const toast = await this.toastController.create({
            message: 'Configuration Updated!',
            duration: 2000
        });
        toast.present();

        this.close();
    }


    server() {
        this.close();
        this.router.navigate(['sms']);
    }

    close() {
        this.modalController.dismiss();
    }
}
