import {Injectable} from '@angular/core';
import {Storage} from '@ionic/storage';


@Injectable({
    providedIn: 'root'
})
export class HelperService {

    serverAddress = '192.168.43.7';
    serverPort = 3000;

    constructor(
        private storage: Storage
    ) {
        storage.get('serverAddress').then(
            address => {
                if (address) {
                    this.serverAddress = address;
                }
            }
        );
        storage.get('serverPort').then(
            port => {
                if (port) {
                    this.serverPort = +port;
                }
            }
        );
    }

    public getUrl(path) {
        return `http://${this.serverAddress}:${this.serverPort}/` + path;
    }

    profileImage(profileImage: string): any {
        if (profileImage) {
            return this.getUrl(profileImage);
        } else {
            return 'assets/imgs/img_avatar.png';
        }
    }

}
