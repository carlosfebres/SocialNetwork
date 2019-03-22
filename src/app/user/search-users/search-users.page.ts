import {Component, OnInit} from '@angular/core';
import {UserService} from '../../services/user.service';
import {Router} from '@angular/router';
import {User} from '../user-page/user.page';
import {Observable, Subject} from 'rxjs';
import {debounceTime, delay, distinctUntilChanged, filter, switchMap, tap} from 'rxjs/operators';
import {LoadingController, ModalController} from '@ionic/angular';

@Component({
    selector: 'page-search-users',
    templateUrl: './search-users.page.html',
    styleUrls: ['./search-users.page.scss']
})
export class SearchUsersPage {

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
        this.clean = false;
        this.searchTerm.next(event.target.value);
    }

    goToUserDetail(user: User) {
        this.router.navigate(['tabs/user', user.username]);
    }
}
