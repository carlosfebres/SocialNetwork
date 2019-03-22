import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {UserPage} from './user-page/user.page';

const routes: Routes = [
    {path: ':username/following', data: {action: 'following'}, loadChildren: '../user/user-list/user-list.module#UserListModule'},
    {path: ':username/followers', data: {action: 'followers'}, loadChildren: '../user/user-list/user-list.module#UserListModule'},
    {path: ':username', loadChildren: '../user/user-page/user.module#UserModule'}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UserRoutingModule {
}
