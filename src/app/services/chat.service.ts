import {Injectable} from '@angular/core';
import {HttpService} from './http.service';
import {UserService} from './user.service';
import {Observable, ReplaySubject} from 'rxjs';
import {first, map, switchMap, tap} from 'rxjs/operators';
import {User} from '../user/user-page/user.page';
import {SocketService} from './socket.service';

export interface Message {
	type: string;
	message: string;
	sentBy: any;
	sentAt: string;
}

export interface Chat {
	_id?: string;
	messages: Message[];
	user: User;
	createdAt?: string;
}

@Injectable({
	providedIn: 'root'
})
export class ChatService {

	private chatsSubject$ = new ReplaySubject(1);
	public chats$ = this.chatsSubject$.asObservable()
		.pipe(
			tap(() => console.log('Emit')),
			map(this.sortChats)
		);
	private dataChat: Chat;


	constructor(
		public http: HttpService,
		public userService: UserService,
		public socket: SocketService
	) {
		this.http.get('chats').subscribe((response: { chats: Chat[] }) => {
			this.chatsSubject$.next(response.chats);
		});

		socket.fromEvent('message')
			.pipe(
				tap(console.log),
				map((data: { chat: Chat }) => this.dataChat = data.chat),
				switchMap(dataChat => this.getChat(dataChat.user.username)
					.pipe(first())
				)
			)
			.subscribe(chat => {
				if (chat !== null) {
					chat.messages.push(this.dataChat.messages[0]);
				} else {
					this.addChat(this.dataChat);
				}
			});
	}

	getChat(username: string): Observable<Chat> {
		return this.chats$.pipe(
			map(chats => {
				console.log('Searching chat for: ', username);
				console.log(chats);
				for (const x of Object.keys(chats)) {
					if (chats[x].user.username === username) {
						return chats[x];
					}
				}
				return null;
			})
		);
	}

	addChat(chat: Chat) {
		this.chatsSubject$.pipe(first()).subscribe((chats: Chat[]) => {
			chats.push(chat);
			this.chatsSubject$.next(chats);
		});
	}


	sendMessageImage(chat: Chat, image: File) {
		const formData = new FormData();
		formData.append('message', image, image.name);
		return this.http.post(`message/${chat.user._id}/image`, formData);
	}

	sendMessage(to: User, message: string) {
		this.socket.emit('message', {
			userId: to._id,
			message
		});
	}

	private sortChats(chats: Chat[]) {
		return chats.sort((a: Chat, b: Chat) => {
			const lastMessageA: Message = a.messages[a.messages.length - 1];
			const lastMessageB: Message = b.messages[b.messages.length - 1];
			if (lastMessageA.sentAt > lastMessageB.sentAt) {
				return -1;
			}
			return 1;
		});
	}
}
