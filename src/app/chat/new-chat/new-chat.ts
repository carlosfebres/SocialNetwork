import {Component, OnInit, ViewChild} from '@angular/core';
import {NavParams} from '@ionic/angular';
import {ChatService} from '../../services/chat.service';
import {UserService} from '../../services/user.service';
import {fromEvent} from 'rxjs';
import {User} from '../../user/user';
import {debounceTime, distinctUntilChanged, filter, map, switchMap, tap} from 'rxjs/operators';


@Component({
    selector: 'page-new-chat',
    templateUrl: './new-chat.html',
    styleUrls: ['./new-chat.scss']
})
export class NewChatPage implements OnInit {

    @ViewChild('searchInput') searchInput;

    public users: User[] = [];
    public clean = true;

    constructor(
        public navParams: NavParams,
        public userProvider: UserService,
        public chatService: ChatService
    ) {
    }

    close() {
        this.navCtrl.pop();
    }

    ngOnInit() {
        // TODO Check
        fromEvent(this.searchInput, 'input').pipe(
            map((e: KeyboardEvent) => e.target.value),
            filter(value => value.length > 2),
            debounceTime(100),
            distinctUntilChanged(),
            switchMap(value => this.userProvider.getUsersByName<User[]>(value)),
            tap(users => {
                this.clean = false;
                this.users = users;
            })
        );
    }

    // getUsers(evt) {
    //     this.loading = true;
    //     setTimeout(() => {
    //         if (evt.target.value.length) {
    //             if (!this.observable.closed) {
    //                 this.observable.unsubscribe();
    //             }
    //             this.observable = this.userProvider.getUsersByName(evt.target.value).subscribe((users: Array<any>) => {
    //                 this.clean = false;
    //                 this.users = users;
    //                 this.loading = false;
    //             });
    //         } else {
    //             this.loading = false;
    //             this.users = [];
    //         }
    //     }, 200);
    // }

    // TODO Go to new Chat
    // async createChat(user: any) {
    //   const chat: Chat = await this.chatProvider.getChat(user).toPromise();
    //   this.close();
    //   // this.navCtrl.push(ChatPage, {chat});
    // }

}
