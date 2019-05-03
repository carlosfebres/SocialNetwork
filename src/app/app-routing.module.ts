import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoggedGuard} from './guards/logged.guard';

const routes: Routes = [
	{
		path: 'login',
		loadChildren: './login/login.module#LoginModule',
	},
	{
		path: 'verification',
		canActivate: [LoggedGuard],
		loadChildren: './mobile-verification/mobile-verification.module#MobileVerificationModule'
	},
	{
		path: '',
		pathMatch: 'full',
		redirectTo: 'login'
	},
	{
		path: '',
		canActivate: [LoggedGuard],
		children: [
			{path: '', loadChildren: './tabs/tabs.module#TabsModule'},
			{path: 'tweet/:id/comments', loadChildren: './tweet/comments/comments.module#CommentsModule'}
		]
	},
	{path: 'sms', loadChildren: './sms-server/sms-server.module#SmsServerModule'},
	{
		path: 'mobile-verification',
		loadChildren: './mobile-verification/mobile-verification.module#MobileVerificationModule'
	}
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule {
}
