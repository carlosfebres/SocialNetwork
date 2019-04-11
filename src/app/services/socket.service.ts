import {Injectable} from '@angular/core';
import {Socket} from 'ngx-socket-io';
import {HelperService} from './helper.service';
import {HttpService} from './http.service';
import {Router} from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class SocketService extends Socket {

    constructor(
        helper: HelperService,
        http: HttpService,
        router: Router
    ) {
        super({url: `http://${helper.serverAddress}:${helper.socketPort}`});
        this.emit('authentication', {token: http.getToken()});
        this.on('unauthorized', err => {
            console.log('There was an error with the authentication:', err.message);
            this.disconnect();
            router.navigate(['login']);
        });
    }
}
