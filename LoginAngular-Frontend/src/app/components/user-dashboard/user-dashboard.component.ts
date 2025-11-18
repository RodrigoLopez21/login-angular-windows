import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']
})
export class UserDashboardComponent implements OnInit {
  productCount: number = 0;
  activeOrders: number = 0;
  messageCount: number = 0;
  currentTime: Date = new Date();

  constructor(private router: Router, private userService: UserService) {}

  goToProfile(): void {
    this.router.navigate(['/user/profile']);
  }

  ngOnInit(): void {
    // Aquí puedes cargar datos del usuario desde tu API
    this.loadUserData();
  }

  loadUserData(): void {
    // Simular carga de datos
    this.productCount = 5;
    this.activeOrders = 2;
    this.messageCount = 3;
  }

  logout(): void {
    const lh = localStorage.getItem('loginHistoryId');
    const cleanup = () => {
      localStorage.removeItem('myToken');
      localStorage.removeItem('loginHistoryId');
      this.router.navigate(['/login']);
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
}