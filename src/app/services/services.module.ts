import {NgModule} from '@angular/core';
import {HttpService} from './http.service';
import {UserService} from './user.service';
import {CommonModule} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import {TweetsService} from './tweets.service';
import {HelperService} from './helper.service';
import {ChatService} from './chat.service';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HttpClientModule
  ],
  providers: [
    UserService,
    HttpService,
    HelperService,
    TweetsService,
    ChatService
  ]
})
export class ServicesModule {
}
