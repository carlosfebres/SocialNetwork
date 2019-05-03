import {Component, OnInit} from '@angular/core';
import {UserService} from '../../services/user.service';
import {from, Observable, of, pipe, Subject} from 'rxjs';
import {User} from '../../user/user-page/user.page';
import {debounceTime, delay, distinctUntilChanged, filter, map, switchMap, tap} from 'rxjs/operators';
import {Router} from '@angular/router';
import {LoadingController, ModalController, NavParams} from '@ionic/angular';
import {Contact, Contacts, IContactField} from '@ionic-native/contacts/ngx';
import {HelperService} from '../../services/helper.service';


interface UserSelectable {
	user: User;
	selected: boolean;
}

@Component({
	selector: 'page-new-chat',
	templateUrl: './new-chat.page.html',
	styleUrls: ['./new-chat.page.scss']
})
export class NewChatPage implements OnInit {

	public cleanUsers = true;
	private searchUsersTerm = new Subject<string>();
	public users = [] as UserSelectable[];
	public users$: Observable<UserSelectable[]> = this.searchUsersTerm.pipe(
		this.searchPipe(),
		tap(() => this.showLoader()),
		delay(500),
		switchMap((value: string) => this.userService.getUsersByName(value)),
		switchMap(users => this.formatUsers(users)),
		tap(() => {
			this.cleanUsers = false;
			this.hideLoader();
		})
	);

	public cleanContacts = true;
	private searchContactsTerm = new Subject<string>();
	public contacts: Contact[] = [] as Contact[];
	public contacts$ = this.searchContactsTerm.pipe(
		this.searchPipe(),
		tap(() => this.showLoader()),
		switchMap(search => this.searchContacts(search) ),
		tap(() => {
			this.cleanContacts = false;
			this.hideLoader();
		})
	);

	public registeredContact = [] as UserSelectable[];
	public registeredContact$: Observable<UserSelectable[]> = this.contacts$.pipe(
		switchMap((contacts: Contact[]) => this.userService.getUsersByPhone(this.flatContactNumbers(contacts))),
		switchMap(users => this.formatUsers(users))
	);


	private loader = this.loadingController.create({message: 'Loading search...'});
	private action: string;
	public showingList = 'contacts';
	public channelUsers = [] as User[];

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
		this.registeredContact$.subscribe(users => this.registeredContact = users);
		this.searchContactsTerm.next('');
	}

	ionViewWillEnter() {
		this.channelUsers = [];
		this.action = this.navParams.get('action') || 'user';
	}

	userClicked(user: UserSelectable) {
		if (this.action === 'user') {
			this.goToChat(user.user);
		} else {
			if (!this.alreadySelected(user)) {
				this.addUserToChannel(user);
			} else {
				this.removeUserFromChannel(user.user);
			}
		}
	}

	goToChat(user: User) {
		this.close();
		this.router.navigate(['tabs/chat/user', user.username]);
	}

	private addUserToChannel(user: UserSelectable) {
		user.selected = true;
		this.channelUsers.push(user.user);
	}

	private removeUserFromChannel(user: User) {
		const userInList = this.users.find((userSelectable: UserSelectable) => user === userSelectable.user);
		userInList.selected = false;

		const index = this.channelUsers.indexOf(user);
		if (index >= 0) {
			this.channelUsers.splice(index, 1);
		}
	}

	createChannel() {
		this.close();
	}


	private alreadySelected(user: UserSelectable) {
		for (const x of Object.keys(this.channelUsers)) {
			if (this.channelUsers[x]._id === user.user._id) {
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
			this.searchUsersTerm.next(event.target.value);
		} else {
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

	private formatUsers(users: User[]): Observable<UserSelectable[]> {
		users = this.helper.replaceIfExists<User>(users, this.channelUsers);
		return this.userService.getLoggedUser().pipe(
			map(loggedUser => users.filter((user: User) => user._id !== loggedUser._id)),
			map(users => users.map(user => ({selected: this.channelUsers.indexOf(user) >= 0, user})))
		);
	}

	private searchContacts(search: any) {
		const contacts = this.contactsService.find(
			['name', 'nickname', 'phoneNumbers', 'photos'],
			{
				filter: search,
				hasPhoneNumber: true
			}
		);
		if (!contacts) {
			this.helper.toast('Couldn\'t fetch contacts.');
			this.hideLoader();
			return of([]);
		}
		return from(contacts);
	}
}
