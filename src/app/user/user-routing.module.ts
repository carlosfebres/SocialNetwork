import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

const routes: Routes = [
    {path: 'edit', loadChildren: ''},
    {path: ':username/following', data: {action: 'following'}, loadChildren: './user/user-list/user-list.module#UserListModule'},
    {path: ':username/followers', data: {action: 'followers'}, loadChildren: './user/user-list/user-list.module#UserListModule'},
    {path: 'user/:username', loadChildren: './user/user.module#UserModule'}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UserRoutingModule {
}
