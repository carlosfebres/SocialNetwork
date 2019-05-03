import {Injectable} from '@angular/core';
import {Storage} from '@ionic/storage';
import {ToastController} from '@ionic/angular';


@Injectable({
	providedIn: 'root'
})
export class HelperService {

	serverAddress = '192.168.43.7';
	serverPort = 3000;
	socketPort = 4000;

	constructor(
		private storage: Storage,
		private toastController: ToastController
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

	formatPhone(phone: string): string {
		phone = phone.replace(/ |-|(|)/g, '');
		if (phone.substr(0, 3) !== '+58') {
			if (phone.substr(0, 2) === '04') {
				return '+58' + parseInt(phone).toString();
			}
			console.warn('Invalid Phone Number: ', phone);
		}
		return phone;
	}

	replaceIfExists<T>(newList: T[], oldList: T[], compareBy: string = '_id'): T[] {
		const sortFunction = (next: T, actual: T) => next[compareBy] > actual[compareBy] ? 1 : -1;
		newList = newList.sort(sortFunction);
		oldList = oldList.sort(sortFunction);

		let newListIndex = 0;
		let oldListIndex = 0;
		while (true) {
			if (newList[newListIndex] === undefined || oldListIndex[oldListIndex] === undefined) {
				return newList;
			} else if (newList[newListIndex][compareBy] === oldList[oldListIndex][compareBy]) {
				console.log("Equals replacing");
				newList[newListIndex] = oldList[oldListIndex];
				newListIndex++;
				oldListIndex++;
			} else if (newList[newListIndex][compareBy] > oldList[oldListIndex][compareBy]) {
				oldListIndex++;
			} else {
				newListIndex++;
			}
		}
	}

	async toast(msg: string) {
		const toast = await this.toastController.create({
			message: msg,
			duration: 3000
		});
		toast.present();
	}
}
