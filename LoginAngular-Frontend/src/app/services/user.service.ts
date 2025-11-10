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
    // Map frontend User to backend DTO (U* fields)
    const dto: any = {
      Uname: user.firstName ?? user.Uname,
      Ulastname: user.lastName ?? user.Ulastname,
      Uemail: user.email ?? user.Uemail,
      Upassword: user.password ?? user.Upassword,
      Ucredential: user.credential ?? user.Ucredential
    };
    return this.http.post(`${this.myAppUrl}${this.myAPIUrl}/register`, dto);
  }
  login(user: User): Observable<string>{
    // Backend expects Uemail and Upassword
    const dto: any = {
      Uemail: user.email ?? user.Uemail,
      Upassword: user.password ?? user.Upassword
    };
    return this.http.post<string>(`${this.myAppUrl}${this.myAPIUrl}/login`, dto);
  }

  getProfile(): Observable<User> {
    return this.http.get<User>(`${this.myAppUrl}${this.myAPIUrl}/profile`);
  }

  updateProfile(user: User): Observable<User> {
    return this.http.put<User>(`${this.myAppUrl}${this.myAPIUrl}/profile`, user);
  }
  
}
