import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '@environments/environment';
import { User,URL } from '@app/_models';

@Injectable({ providedIn: 'root' })
export class AccountService {
    private userSubject: BehaviorSubject<User>;
    public user: Observable<User>;
    public url: Observable<URL>

    constructor(
        private router: Router,
        private http: HttpClient
    ) {
        this.userSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('user')));
        this.user = this.userSubject.asObservable();
    }

    public get userValue(): User {
        return this.userSubject.value;
    }

    
    login(email, password) {
        return this.http.post<User>('/api/v1/users/login', { email, password })
            .pipe(map(user => {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                localStorage.setItem('token', user.token);
               // localStorage.setItem('token', user.token);
               localStorage.setItem('user', JSON.stringify(user));

                this.userSubject.next(user);
                return user;
            }));
    }

    logout() {
        // remove user from local storage and set current user to null
        localStorage.removeItem('user');
        this.userSubject.next(null);
        this.router.navigate(['/account/login']);
    }

    register(user: URL) {
        return this.http.post('/api/v1/users/signup', user);
    }

    generateUrl(longUrl) {
        var headers_object = new HttpHeaders().set("Authorization", "Bearer " +localStorage.getItem('token'));
        const httpOptions = {
            headers: headers_object
          };
        return this.http.post<User>('/api/v1/url/Short', { longUrl },httpOptions)
        .pipe(map(user => {
            this.userSubject.next(user);
            return user;
        }));
    }

    getAll() {
        var headers_object = new HttpHeaders().set("Authorization", "Bearer " +localStorage.getItem('token'));
        const httpOptions = {
            headers: headers_object
          };
        
        return this.http.get('/api/v1/url/listeUrlUser',httpOptions);  
    }
    

    postClick(ob) {
        var headers_object = new HttpHeaders().set("Authorization", "Bearer " +localStorage.getItem('token'));
        const httpOptions = {
            headers: headers_object
          };
        return this.http.post<User>('/api/v1/url/click', ob,httpOptions)
        .pipe(map(click => {
            this.userSubject.next(click);
            return click;
        }));
    }

    getNombrVisite(id) {
        var headers_object = new HttpHeaders().set("Authorization", "Bearer " +localStorage.getItem('token'));
        const httpOptions = {
            headers: headers_object
          };
        
        return this.http.get('/api/v1/url/nombreClick/'+id,httpOptions);  
    }
}