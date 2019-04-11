import {Component, OnInit} from '@angular/core';
import {UserService} from '../../services/user.service';
import {from, Observable, of, pipe, Subject} from 'rxjs';
import {User} from '../../user/user-page/user.page';
import {debounceTime, delay, distinctUntilChanged, filter, switchMap, tap} from 'rxjs/operators';
import {Router} from '@angular/router';
import {LoadingController, ModalController, NavParams} from '@ionic/angular';
import {Contact, Contacts, IContactField} from '@ionic-native/contacts/ngx';
import {HelperService} from '../../services/helper.service';


@Component({
    selector: 'page-new-chat',
    templateUrl: './new-chat.page.html',
    styleUrls: ['./new-chat.page.scss']
})
export class NewChatPage implements OnInit {

    public cleanUsers = true;
    private searchUsersTerm = new Subject<string>();
    public users: User[] = [] as User[];
    public users$: Observable<User[]> = this.searchUsersTerm.pipe(
        this.searchPipe(),
        tap(() => this.showLoader()),
        delay(500),
        switchMap((value: string) => this.userService.getUsersByName(value)),
        tap(() => this.hideLoader())
    );

    public cleanContacts = true;
    private searchContactsTerm = new Subject<string>();
    public contacts: Contact[] = [] as Contact[];
    public contacts$ = this.searchContactsTerm.pipe(
        this.searchPipe(),
        tap(() => this.showLoader()),
        switchMap(search => {
            let contacts$ = from(this.contactsService.find(
                ['name', 'nickname', 'phoneNumbers', 'photos'],
                {
                    filter: search,
                    hasPhoneNumber: true
                }
            ));
            if (!contacts$) {
                this.helper.toast('Couldn\'t fetch contacts.');
                this.hideLoader();
                contacts$ = of([]);
            }
            return contacts$;
        }),
        tap(() => this.hideLoader())
    );

    public registeredContact: User[] = [] as User[];
    public registeredContact$: Observable<User[]> = this.contacts$.pipe(
        switchMap((contacts: Contact[]) => this.userService.getUsersByPhone(this.flatContactNumbers(contacts))),
    );


    private loader = this.loadingController.create({message: 'Loading search...'});
    private action: string;
    public showingList = 'contacts';
    public channelUsers: User[] = [] as User[];

    constructor(
        public userService: UserService,
        private router: Router,
        private navParams: NavParams,
        private loadingController: LoadingController,
        private modalController: ModalController,
        public helper: HelperService,
        private contactsService: Contacts
    ) {
    }

    ngOnInit() {
        this.users$.subscribe(users => this.users = users);
        this.contacts$.subscribe(contacts => this.contacts = contacts);
        this.registeredContact$.subscribe(users => this.registeredContact = users)
        this.searchContacts('');
    }

    ionViewWillEnter() {
        this.action = this.navParams.get('action') || 'user';
    }

    userClicked(user: User) {
        if (this.action === 'user') {
            this.goToChat(user);
        } else {
            this.addUserToChannel(user);
        }
    }

    goToChat(user: User) {
        this.close();
        this.router.navigate(['tabs/chat/user', user.username]);
    }


    private addUserToChannel(user: User) {
        if (!this.alreadySelected(user)) {
            this.channelUsers.push(user);
        }
    }

    removeUserFromChannel(user: User) {
        const index = this.channelUsers.indexOf(user);
        if (index >= 0) {
            this.channelUsers.splice(index, 1);
        }
    }

    createChannel() {
        this.close();
    }


    private alreadySelected(user: User) {
        for (const x of Object.keys(this.channelUsers)) {
            if (this.channelUsers[x]._id === user._id) {
                return true;
            }
        }
        return false;
    }

    showLoader() {
        this.loader.then(t => t.present());
    }

    hideLoader() {
        this.loader.then(t => t.dismiss());
    }

    close() {
        this.modalController.dismiss();
    }

    search(event) {
        if (this.showingList === 'users') {
            this.cleanUsers = false;
            this.searchUsersTerm.next(event.target.value);
        } else {
            this.cleanContacts = false;
            this.searchContactsTerm.next(event.target.value);
        }
    }

    segmentChanged($event) {
        this.showingList = $event.target.value;
    }

    private searchPipe() {
        return pipe(
            filter((value: string) => value.length > 2),
            debounceTime(500),
            distinctUntilChanged()
        );
    }

    private flatContactNumbers(contacts: Contact[]) {
        return contacts.reduce(
            (a: string[], contact: Contact) => a.concat(
                contact.phoneNumbers.map((phoneNumber: IContactField) => this.helper.formatPhone(phoneNumber.value))
            ),
            [] as string[]
        );
    }

}
