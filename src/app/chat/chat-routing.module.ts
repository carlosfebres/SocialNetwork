import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ChatPage} from './chat.page';

const routes: Routes = [
    {path: '', redirectTo: 'list', pathMatch: 'full'},
    {path: ':username', component: ChatPage},
    {path: 'list', loadChildren: './chat/chat-list/chat-list.module#ChatsListModule'},
    {path: 'new', loadChildren: './chat/new-chat/new-chat.module#NewChatModule'}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ChatRoutingModule {
}
