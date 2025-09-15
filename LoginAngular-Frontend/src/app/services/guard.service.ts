import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class GuardService {

  constructor(private router: Router) {}

  canDeactivate(): boolean {
    const token = localStorage.getItem('myToken');
    if (!token) {
      this.router.navigate(['/logIn']);
      return false;
    }
    return true;
  }
}
