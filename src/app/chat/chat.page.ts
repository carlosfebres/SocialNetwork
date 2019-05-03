import {Component, OnInit} from '@angular/core';
import {LoadingController, ModalController} from '@ionic/angular';
import {UserService} from '../services/user.service';
import {HelperService} from '../services/helper.service';
import {Chat, ChatService} from '../services/chat.service';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {map, switchMap, tap} from 'rxjs/operators';
import {UploadPicturePage} from '../upload-picture/upload-picture-page.component';
import {User} from '../user/user-page/user.page';


@Component({
	selector: 'page-chat',
	templateUrl: './chat.page.html',
	styleUrls: ['./chat.page.scss']
})
export class ChatPage implements OnInit {

	username: string;

	chat: Chat = {messages: []} as Chat;
	chatingWith: User = {} as User;
	chat$ = this.route.paramMap
		.pipe(
			map((params: ParamMap) => params.get('username')),
			tap(username => this.username = username),
			switchMap(username => this.chatService.getChat(username))
		);

	message = '';

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private loadingController: LoadingController,
		public modalController: ModalController,
		public helper: HelperService,
		public userService: UserService,
		public chatService: ChatService
	) {
	}

	ngOnInit() {
		this.chatService.chats$.subscribe(c => console.log(c));
		this.chat$.subscribe(
			chat => {
				if (chat !== null) {
					this.chat = chat;
				}
				this.userService.getUserByUsername(this.username)
					.subscribe((user: User) => this.chat.user = this.chatingWith = user);
			}
		);
	}


	async sendImage(chat: Chat) {
		const modal = await this.modalController.create({
			component: UploadPicturePage,
			componentProps: {
				title: 'Send Image To @' + chat.user.username
			}
		});

		modal.onDidDismiss().then(async res => {
			const loader = await this.loadingController.create({message: 'Loading search...'});
			loader.present();
			this.chatService.sendMessageImage(chat, res.data).subscribe(() => loader.dismiss());
		});

		modal.present();
	}

	sendMessage() {
		this.chatService.sendMessage(this.chatingWith, this.message);
		this.message = '';
	}

	getUserImage(chat: Chat, message) {
		let img;
		if (message.sentBy === this.userService.user._id) {
			img = this.userService.user.profileImage;
		} else {
			img = chat.user.profileImage;
		}
		return this.helper.profileImage(img);
	}

}
