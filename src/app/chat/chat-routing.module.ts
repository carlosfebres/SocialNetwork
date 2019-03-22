import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ChatPage} from './chat.page';

const routes: Routes = [
    {path: 'list', loadChildren: './chats-list/chats-list.module#ChatsListModule'},
    {path: 'user/:username', component: ChatPage},
    {path: '', redirectTo: 'list', pathMatch: 'full'}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ChatRoutingModule {
}
