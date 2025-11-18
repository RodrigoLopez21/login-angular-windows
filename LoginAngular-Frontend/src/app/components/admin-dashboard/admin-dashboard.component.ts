import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  productCount: number = 0;
  activeOrders: number = 0;
  messageCount: number = 0;
  currentTime: Date = new Date();

  constructor(private router: Router) {}

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
    localStorage.removeItem('myToken');
    this.router.navigate(['/login']);
  }

  goToUsers(): void {
    this.router.navigate(['/admin/users']);
  }
}