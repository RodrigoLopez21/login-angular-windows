import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorService } from 'src/app/services/error.service';
import { ToastrService } from 'ngx-toastr';

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

interface LoginRecord {
  Lhid: number;
  Uid: number;
  Lhlogin_time: string;
  Lhlogout_time: string | null;
}

@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.css']
})
export class AdminUsersComponent implements OnInit {
  users: User[] = [];
  loading: boolean = false;
  displayedColumns: string[] = ['Uid', 'Uname', 'Ulastname', 'Uemail', 'Ucredential', 'Ustatus', 'actions'];
  selectedUser: User | null = null;
  loginHistory: LoginRecord[] = [];
  showHistoryModal: boolean = false;
  updatingStatus: { [key: number]: boolean } = {};

  constructor(
    private userService: UserService,
    private errorService: ErrorService,
    private router: Router,
    private toastr: ToastrService
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

  toggleUserStatus(user: User): void {
    const newStatus = user.Ustatus === 1 ? 0 : 1;
    // use action for confirmation (infinitive) and resultText for feedback (past participle)
    const action = newStatus === 1 ? 'activar' : 'desactivar';
    const resultText = newStatus === 1 ? 'activado' : 'desactivado';

    if (confirm(`¿Deseas ${action} a ${user.Uname}?`)) {
      this.updatingStatus[user.Uid] = true;
      this.userService.updateUserStatus(user.Uid, newStatus).subscribe({
        next: (response: any) => {
          this.updatingStatus[user.Uid] = false;
          user.Ustatus = newStatus;
          this.toastr.success(`Usuario ${resultText} correctamente`);
        },
        error: (err: HttpErrorResponse) => {
          this.updatingStatus[user.Uid] = false;
          this.errorService.msgError(err);
        }
      });
    }
  }

  viewLoginHistory(user: User): void {
    this.selectedUser = user;
    this.showHistoryModal = true;
    this.loadLoginHistory(user.Uid);
  }

  loadLoginHistory(userId: number): void {
    this.userService.getLoginHistory(userId).subscribe({
      next: (response: any) => {
        this.loginHistory = response.data || response;
      },
      error: (err: HttpErrorResponse) => {
        this.errorService.msgError(err);
      }
    });
  }

  closeHistoryModal(): void {
    this.showHistoryModal = false;
    this.selectedUser = null;
    this.loginHistory = [];
  }

  getSessionDuration(record: LoginRecord): string {
    if (!record.Lhlogout_time) {
      return 'En sesión';
    }
    const login = new Date(record.Lhlogin_time);
    const logout = new Date(record.Lhlogout_time);
    const diffMs = logout.getTime() - login.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 60) {
      return `${diffMins} min`;
    }
    const hours = Math.floor(diffMins / 60);
    const mins = diffMins % 60;
    return `${hours}h ${mins}m`;
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleString('es-ES');
  }
}
