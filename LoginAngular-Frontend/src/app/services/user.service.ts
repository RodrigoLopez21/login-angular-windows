import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../interfaces/user';
import { Observable } from 'rxjs';
import { environments } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private myAppUrl: string;
  private myAPIUrl: string;

  constructor(private http: HttpClient) {
    this.myAppUrl = environments.endpoint
    this.myAPIUrl = 'api/user';
    
  }

  signIn(user: User): Observable<any>{
    return this.http.post(`${this.myAppUrl}${this.myAPIUrl}/register`, user);
  }
  login(user: User): Observable<string>{
    return this.http.post<string>(`${this.myAppUrl}${this.myAPIUrl}/login`, user);
  }
  
}
