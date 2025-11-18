import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {

  constructor(private router: Router, private userService: UserService){}

  logOut(){
    const lh = localStorage.getItem('loginHistoryId');
    const cleanup = () => {
      localStorage.removeItem('myToken');
      localStorage.removeItem('loginHistoryId');
      this.router.navigate(['login']);
    };

    if (lh) {
      const id = Number(lh);
      if (!isNaN(id)) {
        this.userService.recordLogout(id).subscribe({ next: () => cleanup(), error: () => cleanup() });
        return;
      }
    }
    cleanup();
  }

  goToProduct() {
    this.router.navigate(['product']);
  }
  
}
