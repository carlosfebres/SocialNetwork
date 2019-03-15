import {Component} from '@angular/core';
import {ModalController, NavParams} from '@ionic/angular';
import {UserService} from '../services/user.service';
import {HelperService} from '../services/helper.service';
import {UpdatePicturePage} from '../update-picture/update-picture.page';
import {Chat, ChatService} from '../services/chat.service';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {Observable} from 'rxjs';
import {delay, repeat, switchMap} from 'rxjs/operators';


@Component({
    selector: 'page-chat',
    templateUrl: './chat.page.html',
    styleUrls: ['./chat.page.scss']
})
export class ChatPage {

    public chat$: Observable<Chat> = this.route.paramMap
        .pipe(
            switchMap((params: ParamMap) => this.chatService.getChat(params.get('id'))),
            delay(5000),
            repeat()
        );
    message = '';

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        public modalController: ModalController,
        public navParams: NavParams,
        public helper: HelperService,
        public userService: UserService,
        public chatService: ChatService
    ) {
    }

    refresh(refresher) {
        console.log('Refresing...');
        setTimeout(async () => {
            await this.chatService.refreshChat(this.chat).toPromise();
            refresher.complete();
        }, 500);
    }

    async sendImage() {
        const modal = await this.modalController.create({
            component: UpdatePicturePage,
            componentProps: {
                title: 'Send Image To @' + this.chat.user1.username,
                callback: (file) => this.chatService.sendMessageImage(this.chat, file).toPromise(),
            }
        });
        modal.present();
    }

    sendMessage() {
        this.chatService.sendMessage(this.chat, this.message).subscribe(() => {
            this.message = '';
        });
    }

    // close() {
    //     this.navCtrl.pop();
    // }

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
