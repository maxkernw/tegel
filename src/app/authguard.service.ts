import { AuthService } from './services/auth.service';
import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AngularFireAuth } from 'angularfire2/auth';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';
import 'rxjs/add/observable/from';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private auth: AngularFireAuth, private router: Router) { }
    canActivate(): Observable<boolean> {
        return Observable.from(this.auth.authState)
            .take(1)
            .map(state => !!state)
            .do(authenticated => {
                if (!authenticated) {
                    this.router.navigate(['/']);
                }
            });
    }
}