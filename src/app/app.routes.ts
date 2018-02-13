import { AuthGuard } from './authguard.service';
import { CalendarComponent } from './calendar/calendar.component';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { Routes } from '@angular/router/src/config';

const appRoutes: Routes = [
    { path: '', component: LoginComponent },
    { path: 'calendar', component: CalendarComponent, canActivate: [AuthGuard] }
  ];

  export default appRoutes;
