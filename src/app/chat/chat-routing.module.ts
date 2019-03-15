import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

const routes: Routes = [
    {path: 'chat/:id', loadChildren: './chat/chat.module#ChatModule'},
    {path: 'chats', loadChildren: './chat/chat-list/chat-list.module#ChatsListModule'},
    {path: 'chat/new', component: './chat/new-chat/new-chat.module#NewChatModule'}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ChatRoutingModule {
}
