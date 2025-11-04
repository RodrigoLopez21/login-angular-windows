import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

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

  constructor(private router: Router) {}

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
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}