import {Component} from '@angular/core';
import {LoadingController, ModalController} from '@ionic/angular';
import {UserService} from '../services/user.service';
import {HelperService} from '../services/helper.service';
import {Chat, ChatService} from '../services/chat.service';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {interval, merge, Observable, Subject} from 'rxjs';
import {delay, first, share, switchMap, tap} from 'rxjs/operators';
import {UploadPicturePage} from '../upload-picture/upload-picture-page.component';


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

    chat$: Observable<Chat> = merge(this.username$, this.refresher$, interval(5000))
        .pipe(
            switchMap(() => this.chatService.getChat(this.username)),
            share()
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

    refresh(refresher) {
        console.log('Refreshing...');
        this.refresher$.next();
        this.chat$.pipe(first()).subscribe(refresher.target.complete);
    }

    async sendImage(chat: Chat) {
        const modal = await this.modalController.create({
            component: UploadPicturePage,
            componentProps: {
                title: 'Send Image To @' + chat.user1.username
            }
        });

        modal.onDidDismiss().then(async res => {
            const loader = await this.loadingController.create({message: 'Loading search...'});
            loader.present();
            this.chatService.sendMessageImage(chat, res.data).subscribe(loader.dismiss);
        });

        modal.present();
    }

    sendMessage(chat: Chat) {
        this.chatService.sendMessage(chat, this.message).subscribe(() => {
            this.message = '';
        });
    }

    getUserImage(chat: Chat, message) {
        let img;
        if (message.sentBy === this.userService.user._id) {
            img = this.userService.user.profileImage;
        } else {
            img = chat.user1.profileImage;
        }
        return this.helper.profileImage(img);
    }


}
