import {Component} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {UserService} from '../services/user.service';
import {HelperService} from '../services/helper.service';
import {Chat, ChatService} from '../services/chat.service';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {merge, Observable, Subject} from 'rxjs';
import {delay, first, repeat, share, switchMap, tap} from 'rxjs/operators';


@Component({
    selector: 'page-chat',
    templateUrl: './chat.page.html',
    styleUrls: ['./chat.page.scss']
})
export class ChatPage {

    username: string;
    username$ = this.route.paramMap
        .pipe(
            tap((params: ParamMap) => this.username = params.get('username'))
        );
    refresher$ = new Subject();

    chat: any;
    chat$: Observable<Chat> = merge(this.username$, this.refresher$)
        .pipe(
            delay(1000),
            switchMap(() => this.chatService.getChat(this.username)),
            delay(5000),
            repeat(),
            share()
        );
    message = '';

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        public modalController: ModalController,
        public helper: HelperService,
        public userService: UserService,
        public chatService: ChatService
    ) {
    }

    refresh(refresher) {
        console.log('Refreshing...');
        this.refresher$.next();
        this.chat$.pipe(first()).subscribe(refresher.complete);
    }

    // async sendImage() {
    //     const modal = await this.modalController.create({
    //         component: UpdatePicturePage,
    //         componentProps: {
    //             title: 'Send Image To @' + this.chat.user1.username,
    //             callback: (file) => this.chatService.sendMessageImage(this.chat, file).toPromise(),
    //         }
    //     });
    //     modal.present();
    // }

    sendMessage() {
        this.chatService.sendMessage(this.chat, this.message).subscribe(() => {
            this.message = '';
        });
    }

    getUserImage(message) {
        let img;
        if (message.sentBy === this.userService.user._id) {
            img = this.userService.user.profileImage;
        } else {
            img = this.chat.user1.profileImage;
        }

        if (!img) {
            img = 'assets/imgs/img_avatar.png';
        } else {
            img = this.helper.getUrl(img);
        }
        return img;
    }


}
