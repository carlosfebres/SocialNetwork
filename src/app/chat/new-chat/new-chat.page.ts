import {Component} from '@angular/core';
import {UserService} from '../../services/user.service';
import {Observable, Subject} from 'rxjs';
import {User} from '../../user/user-page/user.page';
import {debounceTime, delay, distinctUntilChanged, filter, switchMap, tap} from 'rxjs/operators';
import {Router} from '@angular/router';
import {LoadingController, ModalController} from '@ionic/angular';


@Component({
    selector: 'page-new-chat',
    templateUrl: './new-chat.page.html',
    styleUrls: ['./new-chat.page.scss']
})
export class NewChatPage {


    public clean = true;
    private searchTerm = new Subject<string>();
    public users$: Observable<User[]> = this.searchTerm.pipe(
        filter(value => value.length > 2),
        debounceTime(1000),
        distinctUntilChanged(),
        tap(() => this.showLoader()),
        delay(500),
        switchMap(value => this.userService.getUsersByName(value)),
        tap(() => this.hideLoader())
    );

    constructor(
        public userService: UserService,
        private router: Router,
        private loadingController: LoadingController,
        private modalController: ModalController
    ) {
    }

    private loader = this.loadingController.create({message: 'Loading search...'});

    async showLoader() {
        (await this.loader).present();
    }

    async hideLoader() {
        (await this.loader).dismiss();
    }

    close() {
        this.modalController.dismiss();
    }

    search(event) {
        this.searchTerm.next(event.target.value);
    }

    goToChat(user: User) {
        this.close();
        this.router.navigate(['tabs/chat/user', user.username]);
    }
}
