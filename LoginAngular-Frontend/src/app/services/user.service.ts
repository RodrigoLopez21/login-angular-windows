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
  login(user: User): Observable<any>{ // Return type is now any
    // Backend expects Uemail and Upassword
    const dto: any = {
      Uemail: user.email ?? user.Uemail,
      Upassword: user.password ?? user.Upassword
    };
    return this.http.post<any>(`${this.myAppUrl}${this.myAPIUrl}/login`, dto);
  }

  loginVerify(email: string, code: string): Observable<any> {
    return this.http.post<any>(`${this.myAppUrl}${this.myAPIUrl}/login/verify`, { email, code });
  }

  getProfile(): Observable<User> {
    return this.http.get<User>(`${this.myAppUrl}${this.myAPIUrl}/profile`);
  }

  updateProfile(user: User): Observable<User> {
    return this.http.put<User>(`${this.myAppUrl}${this.myAPIUrl}/profile`, user);
  }

  requestVerification(type: 'email' | 'password' | 'phone', newValue?: string): Observable<any> {
    return this.http.post(`${this.myAppUrl}${this.myAPIUrl}/verify-request`, { type, newValue });
  }

  confirmVerification(type: 'email' | 'password' | 'phone', code: string, newValue?: string, newPassword?: string): Observable<any> {
    return this.http.post(`${this.myAppUrl}${this.myAPIUrl}/verify-confirm`, { type, code, newValue, newPassword });
  }
  
  getRole(): Observable<any> {
    return this.http.get<any>(`${this.myAppUrl}${this.myAPIUrl}/role`);
  }

  getAllUsers(): Observable<any> {
    return this.http.get<any>(`${this.myAppUrl}${this.myAPIUrl}/read`);
  }

  getLoginHistory(userId: number): Observable<any> {
    return this.http.get<any>(`${this.myAppUrl}api/login-history/user/${userId}`);
  }

  getLoginHistoryAll(): Observable<any> {
    return this.http.get<any>(`${this.myAppUrl}api/login-history/all`);
  }

  createLoginHistory(userId: number): Observable<any> {
    return this.http.post<any>(`${this.myAppUrl}api/login-history/create`, { Uid: userId });
  }

  recordLogout(loginHistoryId: number): Observable<any> {
    return this.http.patch<any>(`${this.myAppUrl}api/login-history/logout/${loginHistoryId}`, {});
  }

  updateUserStatus(userId: number, status: number): Observable<any> {
    return this.http.put<any>(`${this.myAppUrl}${this.myAPIUrl}/status/${userId}`, { Ustatus: status });
  }
  
}
