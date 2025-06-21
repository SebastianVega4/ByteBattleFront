import { Component, OnInit, ViewChild } from '@angular/core';
import { AdminService } from '../../../services/admin';
import { User } from '../../../models';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatPaginatorModule
  ],
  templateUrl: './user-management.html',
  styleUrls: ['./user-management.scss']
})
export class UserManagement implements OnInit {
  users: User[] = [];
  displayedColumns: string[] = ['username', 'email', 'role', 'status', 'actions'];
  isLoading = true;
  totalUsers = 0;
  pageSize = 10;
  pageSizeOptions = [5, 10, 25, 100];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private adminService: AdminService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.loadUsers();
  }

  // user-management.ts
  loadUsers(pageIndex: number = 0, pageSize: number = this.pageSize) {
    this.isLoading = true;
    this.adminService.getUsers(pageIndex, pageSize).subscribe({
      next: (response) => {
        this.users = response.users;
        this.totalUsers = response.total;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading users:', err);
        this.isLoading = false;
        this.snackBar.open(
          `Error al cargar usuarios: ${err.error?.message || err.message || 'Error desconocido'}`,
          'Cerrar',
          { duration: 5000 }
        );
      }
    });
  }

  onPageChange(event: any) {
    this.loadUsers(event.pageIndex, event.pageSize);
  }

  toggleBan(user: User) {
    const action = user.isBanned ? 'desbanear' : 'banear';
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirmar acción',
        message: `¿Estás seguro que deseas ${action} al usuario ${user.username}?`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.adminService.banUser(user.uid, !user.isBanned).subscribe({
          next: () => {
            user.isBanned = !user.isBanned;
            this.snackBar.open(`Usuario ${action} correctamente`, 'Cerrar', { duration: 3000 });
          },
          error: (err) => {
            console.error(`Error al ${action} usuario`, err);
            this.snackBar.open(`Error al ${action} usuario: ${err.error?.message || err.message}`, 'Cerrar', { duration: 5000 });
          }
        });
      }
    });
  }

  setAdminRole(user: User) {
    const action = user.role === 'admin' ? 'quitar' : 'asignar';
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirmar acción',
        message: `¿Estás seguro que deseas ${action} el rol de administrador a ${user.username}?`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const newRole = user.role === 'admin' ? 'user' : 'admin';
        this.adminService.setAdminRole(user.uid, newRole).subscribe({
          next: () => {
            user.role = newRole;
            this.snackBar.open(`Rol actualizado correctamente`, 'Cerrar', { duration: 3000 });
          },
          error: (err) => {
            console.error('Error al cambiar rol', err);
            this.snackBar.open(`Error al cambiar rol: ${err.error?.message || err.message}`, 'Cerrar', { duration: 5000 });
          }
        });
      }
    });
  }
}