import {Component, OnInit} from '@angular/core';
import {ActionSheetController, ModalController} from '@ionic/angular';
import {HelperService} from '../../services/helper.service';
import {Chat, ChatService} from '../../services/chat.service';
import {Router} from '@angular/router';
import {NewChatPage} from '../new-chat/new-chat.page';
import {UserService} from '../../services/user.service';

@Component({
    selector: 'page-chats-list',
    templateUrl: './chats-list.page.html',
    styleUrls: ['./chats-list.page.scss']
})
export class ChatsListPage implements OnInit {

    chats: Chat[] = [] as Chat[];

    constructor(
        public router: Router,
        public actionSheetCtrl: ActionSheetController,
        public helper: HelperService,
        public chatService: ChatService,
        public modalController: ModalController,
        public userService: UserService
    ) {
    }

    ngOnInit() {
        this.chatService.chats$.subscribe(chats => this.chats = chats);
    }

    showOptions(chat: Chat) {
        this.actionSheetCtrl.create({
            header: 'ChatService With ' + chat.user.name,
            buttons: [
                {
                    text: 'Go To Profile',
                    icon: 'user',
                    handler: () => {
                        this.router.navigate(['tabs/user', chat.user.username]);
                    }
                }, {
                    text: 'Cancel',
                    role: 'cancel'
                }
            ]
        }).then(actionSheet => actionSheet.present());
    }

    goToChat(chat: Chat) {
        this.router.navigate(['tabs/chat/user', chat.user.username]);
    }

    async newChat() {
        const modal = await this.modalController.create({
            component: NewChatPage,
            componentProps: {
                action: 'user'
            }
        });
        modal.present();
    }

    async newChannel() {
        const modal = await this.modalController.create({
            component: NewChatPage,
            componentProps: {
                action: 'channel'
            }
        });
        modal.present();
    }
}
