import {Component} from '@angular/core';
import {ActionSheetController, ModalController} from '@ionic/angular';
import {HelperService} from '../../services/helper.service';
import {Chat, ChatService} from '../../services/chat.service';
import {delay, first, switchMap} from 'rxjs/operators';
import {Router} from '@angular/router';
import {BehaviorSubject, interval, merge, Observable} from 'rxjs';
import {NewChatPage} from '../new-chat/new-chat.page';

@Component({
    selector: 'page-chats-list',
    templateUrl: './chats-list.page.html',
    styleUrls: ['./chats-list.page.scss']
})
export class ChatsListPage {

    private refresher$ = new BehaviorSubject(null);
    public chats$: Observable<Chat[]> = merge(interval(5000), this.refresher$)
        .pipe(
            switchMap(() => this.chatService.chats$)
        );

    constructor(
        public router: Router,
        public actionSheetCtrl: ActionSheetController,
        public helper: HelperService,
        public chatService: ChatService,
        public modalController: ModalController
    ) {
    }

    refresh(refresher) {
        console.log('Refreshing...');
        this.refresher$.next(null);
        this.chats$.pipe(first(), delay(2000)).subscribe(refresher.target.complete);
    }

    showOptions(chat: Chat) {
        this.actionSheetCtrl.create({
            header: 'ChatService With ' + chat.user1.name,
            buttons: [
                {
                    text: 'Go To Profile',
                    icon: 'user',
                    handler: () => {
                        this.router.navigate(['tabs/user', chat.user1.username]);
                    }
                }, {
                    text: 'Cancel',
                    role: 'cancel'
                }
            ]
        }).then(actionSheet => actionSheet.present());
    }

    goToChat(chat: Chat) {
        this.router.navigate(['tabs/chat/user', chat.user1.username]);
    }

    async newChat() {
        const modal = await this.modalController.create({
            component: NewChatPage
        });
        await modal.present();
    }

}