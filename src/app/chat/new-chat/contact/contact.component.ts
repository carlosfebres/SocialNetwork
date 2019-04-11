import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Contact} from '@ionic-native/contacts/ngx';
import {HelperService} from '../../../services/helper.service';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
    selector: 'contact',
    templateUrl: './contact.component.html',
    styleUrls: ['./contact.component.scss'],
})
export class ContactComponent implements OnInit {

    @Input() contact: Contact;
    @Output() click = new EventEmitter();

    public phone: string;

    constructor(
        public helper: HelperService,
        public sanitaze: DomSanitizer
    ) {
    }

    ngOnInit() {
        this.phone = this.helper.formatPhone(this.contact.phoneNumbers[0].value);
    }

    onClick() {
        this.click.emit();
    }
}
