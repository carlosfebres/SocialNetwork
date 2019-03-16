import {Component} from '@angular/core';
import {ActionSheetController, ModalController} from '@ionic/angular';
import {HelperService} from '../../services/helper.service';
import {NewChatPage} from '../new-chat/new-chat.page';
import {Chat, ChatService} from '../../services/chat.service';
import {delay, repeat} from 'rxjs/operators';

@Component({
    selector: 'page-chats-list',
    templateUrl: './chats-list.page.html',
    styleUrls: ['./chats-list.page.scss']
})
export class ChatsListPage {

    public chats$ = this.chatService.chats$.pipe(
        delay(5000),
        repeat()
    );

    constructor(
        public actionSheetCtrl: ActionSheetController,
        public helper: HelperService,
        public chatService: ChatService,
        public modalCtrl: ModalController
    ) {
    }

    refresh(refresher) {
        console.log('Refreshing...');
        setTimeout(async () => {
            await this.chats$.toPromise();
            refresher.complete();
        }, 500);
    }

    async showOptions(chat: Chat) {
        const actionSheet = await this.actionSheetCtrl.create({
            header: 'ChatService With ' + chat.user1.name,
            buttons: [
                {
                    text: 'Go To Profile',
                    icon: 'user',
                    handler: () => {
                        // TODO Go To Profile
                    }
                }, {
                    text: 'Cancel',
                    role: 'cancel'
                }
            ]
        });
        return await actionSheet.present();
    }

    // goToChat(chat: any) {
    //     this.navCtrl.push(ChatPage, {chat});
    // }

    // async newChat() {
    //     const modal = await this.modalCtrl.create({
    //         component: NewChatPage
    //     });
    //     return await modal.present();
    // }

}
