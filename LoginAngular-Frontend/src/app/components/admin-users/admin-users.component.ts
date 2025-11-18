import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorService } from 'src/app/services/error.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';

interface User {
  Uid: number;
  Uname: string;
  Ulastname: string;
  Uemail: string;
  Upassword: string;
  Ucredential: string;
  Ustatus: number;
  Rid?: number;
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
  updatingRole: { [key: number]: boolean } = {};
  isAdmin: boolean = false;
  currentRid: number | null = null;
  showInviteModal: boolean = false;
  inviteForm = {
    Uname: '',
    Ulastname: '',
    Uemail: '',
    Rid: 2
  };
  invitingUser: boolean = false;

  constructor(
    private userService: UserService,
    private errorService: ErrorService,
    private router: Router,
    private toastr: ToastrService
    , private authService: AuthService
  ) {}

  ngOnInit(): void {
    // determine if current user is admin to show role controls
    const rid = this.authService.getRoleFromToken();
    this.currentRid = rid;
    this.isAdmin = rid === 1;
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
        const raw = response.data || response;
        // ensure each user object has a Rid (default to 2 = user)
        this.users = (raw || []).map((u: any) => ({ ...u, Rid: u.Rid !== undefined ? u.Rid : 2 }));
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

  changeUserRole(user: User, valueOrEvent: any): void {
    // support being called with either the raw value or the DOM event
    let newRid = valueOrEvent;
    if (valueOrEvent && typeof valueOrEvent === 'number') {
      newRid = valueOrEvent;
    } else if (valueOrEvent && valueOrEvent.target) {
      newRid = Number(valueOrEvent.target.value);
    } else {
      newRid = Number(valueOrEvent);
    }
    
    console.log('changeUserRole called with newRid=', newRid, 'user.Rid=', user.Rid, 'user=', user);
    
    if (![1,2].includes(newRid)) {
      console.warn('Invalid Rid:', newRid);
      return;
    }
    if (user.Rid === newRid) {
      console.log('No change in role');
      return; // no change
    }

    if (!confirm(`¿Deseas asignar rol ${newRid === 1 ? 'Admin' : 'User'} a ${user.Uname}?`)) {
      console.log('User cancelled role change');
      return;
    }

    this.updatingRole[user.Uid] = true;
    console.log('Calling updateUserRole with userId=', user.Uid, 'newRid=', newRid);
    this.userService.updateUserRole(user.Uid, newRid).subscribe({
      next: (res: any) => {
        console.log('Role updated successfully:', res);
        this.updatingRole[user.Uid] = false;
        user.Rid = newRid;
        this.toastr.success('Rol actualizado correctamente');
        // Optionally refresh list to reflect any permission-dependent changes
        this.loadUsers();
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error updating role:', err);
        this.updatingRole[user.Uid] = false;
        this.errorService.msgError(err);
      }
    });
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

  openInviteModal(): void {
    this.showInviteModal = true;
    this.inviteForm = {
      Uname: '',
      Ulastname: '',
      Uemail: '',
      Rid: 2
    };
  }

  closeInviteModal(): void {
    this.showInviteModal = false;
  }

  inviteUser(): void {
    if (!this.inviteForm.Uname || !this.inviteForm.Ulastname || !this.inviteForm.Uemail) {
      this.toastr.error('Todos los campos son requeridos');
      return;
    }

    this.invitingUser = true;
    this.userService.inviteUser(
      this.inviteForm.Uname,
      this.inviteForm.Ulastname,
      this.inviteForm.Uemail,
      this.inviteForm.Rid
    ).subscribe({
      next: (response: any) => {
        this.invitingUser = false;
        this.toastr.success('Usuario invitado. Se envió un correo con instrucciones.');
        this.closeInviteModal();
        this.loadUsers();
      },
      error: (err: HttpErrorResponse) => {
        this.invitingUser = false;
        this.errorService.msgError(err);
      }
    });
  }
}
