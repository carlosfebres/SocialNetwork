import { Injectable } from '@angular/core';
import {SMS} from '@ionic-native/sms/ngx';
import {AndroidPermissions} from '@ionic-native/android-permissions/ngx';

@Injectable({
  providedIn: 'root'
})
export class SmsService {

  constructor(
      private sms: SMS,
      private androidPermissions: AndroidPermissions
  ) { }

    public sendSMS(phone: number, message: string) {
        this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.SEND_SMS).then(
            result => {
                if (result.hasPermission) {
                    this.sms.send(phone + '', message).then(data => {
                        console.log('Message Sent', data);
                    }).catch(error => {
                        console.log('Message Error.', error);
                    });
                } else {
                    console.log('No Permission for SMS.');
                }
            },
            () => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.SEND_SMS)
        );
    }
}
