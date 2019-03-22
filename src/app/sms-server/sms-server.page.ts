import {Component, OnInit} from '@angular/core';
import {interval} from 'rxjs';
import {retry, startWith, switchMap, tap} from 'rxjs/operators';
import {SmsService} from '../services/sms.service';
import {HttpService} from '../services/http.service';

@Component({
    selector: 'app-sms-server',
    templateUrl: './sms-server.page.html',
    styleUrls: ['./sms-server.page.scss'],
})
export class SmsServerPage implements OnInit {

    codes: { number: number, code: number }[] = [];

    server = interval(5000)
        .pipe(
            startWith(null),
            switchMap(() =>
                this.httpService.get('server/get_sms')
                    .pipe(
                        tap((codes: { number: number, code: number }[]) => codes.forEach(code => {
                            this.codes.push(code);
                            console.log('Sending Message To ', code);
                            this.smsService.sendSMS(
                                code.number,
                                `Twitter app for URU. Your verification code is ${code.code}, use it to finish your registration.`
                            );
                        })),
                        retry()
                    )
            )
        );

    constructor(
        public smsService: SmsService,
        public httpService: HttpService
    ) {
    }

    ngOnInit() {
        this.server.subscribe(() => {
            console.log('Fetching....');
        });
    }

}
