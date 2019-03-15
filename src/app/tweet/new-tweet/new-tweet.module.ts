import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NewTweetPage } from './new-tweet';

@NgModule({
  declarations: [
    NewTweetPage,
  ],
  imports: [
    IonicPageModule.forChild(NewTweetPage),
  ],
})
export class NewTweetPageModule {}
