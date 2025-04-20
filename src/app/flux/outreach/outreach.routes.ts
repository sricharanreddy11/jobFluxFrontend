import { Routes } from '@angular/router';
import { MailBoxComponent } from './mail-box/mail-box.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'mail-box',
        pathMatch: "full"
    },
    {
        path: 'mail-box',
        component: MailBoxComponent,
    },
];
