import { Routes } from '@angular/router';
import { MailBoxComponent } from './mail-box/mail-box.component';
import { ConnectMailComponent } from './connect-mail/connect-mail.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'mail-box',
        pathMatch: "full"
    },
    {
        path: 'connect-mail',
        component: ConnectMailComponent,
    },
    {
        path: 'mail-box',
        component: MailBoxComponent,
    },
];
