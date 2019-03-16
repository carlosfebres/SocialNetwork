import {Injectable} from '@angular/core';
import {HttpService} from './http.service';
import {UserService} from './user.service';
import {Observable, of} from 'rxjs';
import {map, tap} from 'rxjs/operators';
import {User} from '../user/user.page';

export interface Chat {
    _id?: string;
    messages: Array<{
        type: string,
        message: string,
        sentBy: any,
        sentAt: string
    }>;
    user1: User;
    createdAt?: string;
}

@Injectable({
    providedIn: 'root'
})
export class ChatService {

    public chats: Chat[] = [];
    public chats$: Observable<Chat[]> = this.http.get<Chat[]>('chats')
        .pipe(
            map(response => response.chats),
            tap(chats => this.chats = chats)
        );

    constructor(
        public http: HttpService,
        public userService: UserService
    ) {
        this.getChats();
    }

    private static newChat(user: User): Chat {
        return {
            user1: user,
            messages: []
        };
    }

    async getChats() {
        return this.chats = await this.chats$.toPromise();
    }

    getChat(username: string): Observable<Chat> {
        console.log('Get Chat By Username: ', username);
        for (const x of Object.keys(this.chats)) {
            if (this.chats[x].user1.username === username) {
                return of(this.chats[x]);
            }
        }
        return this.userService.getUserByUsername(username).pipe(
            map(user => ChatService.newChat(user))
        );
    }

    refreshChat(chat: Chat): Observable<Chat> {
        console.log('Refreshing...');
        return this.http.get<Chat>(`chat/${chat._id}`)
            .pipe(
                map(response => response.chat),
                tap((refreshedChat: Chat) => chat.messages = refreshedChat.messages)
            );
    }

    sendMessageImage(chat: Chat, image: File) {
        const formData = new FormData();
        formData.append('message', image, image.name);
        return this.http.post<Chat>(`message/${chat.user1._id}`, formData)
            .pipe(
                map(response => response.chat),
                tap(refreshedChat => this.handleSentSuccessful(chat, refreshedChat))
            );
    }

    sendMessage(chat: Chat, message: string): Observable<Chat> {
        return this.http.post<Chat>(`message/${chat.user1._id}`, {message})
            .pipe(
                map(response => response.chat),
                tap(refreshedChat => this.handleSentSuccessful(chat, refreshedChat))
            );
    }

    private handleSentSuccessful(chat: Chat, refreshedChat: Chat) {
        if (chat.messages) {
            for (const x of Object.keys(refreshedChat)) {
                if (x === 'user1') {
                    continue;
                }
                chat[x] = refreshedChat[x];
            }
            this.chats.push(chat);
        } else {
            chat.messages = refreshedChat.messages;
        }
    }

}
