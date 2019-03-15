import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UserListPage } from './user-list';
import {ComponentsModule} from "../../components/components.module";

@NgModule({
  declarations: [
    UserListPage,
  ],
  imports: [
    ComponentsModule,
    IonicPageModule.forChild(UserListPage),
  ],
})
export class UserListPageModule {}
