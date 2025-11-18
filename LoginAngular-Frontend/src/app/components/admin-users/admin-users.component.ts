import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorService } from 'src/app/services/error.service';

interface User {
  Uid: number;
  Uname: string;
  Ulastname: string;
  Uemail: string;
  Upassword: string;
  Ucredential: string;
  Ustatus: number;
  createdAt?: string;
  updatedAt?: string;
}

@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.css']
})
export class AdminUsersComponent implements OnInit {
  users: User[] = [];
  loading: boolean = false;
  displayedColumns: string[] = ['Uid', 'Uname', 'Ulastname', 'Uemail', 'Ucredential', 'Ustatus'];

  constructor(
    private userService: UserService,
    private errorService: ErrorService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  goBack(): void {
    this.router.navigate(['/admin/dashboard']);
  }

  loadUsers(): void {
    this.loading = true;
    this.userService.getAllUsers().subscribe({
      next: (response: any) => {
        this.loading = false;
        this.users = response.data || response;
      },
      error: (err: HttpErrorResponse) => {
        this.loading = false;
        this.errorService.msgError(err);
      }
    });
  }

  getStatusLabel(status: number): string {
    return status === 1 ? 'Activo' : 'Inactivo';
  }

  getStatusClass(status: number): string {
    return status === 1 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  }
}
