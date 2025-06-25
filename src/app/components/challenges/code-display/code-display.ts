import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-code-display',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  templateUrl: './code-display.html',
  styleUrls: ['./code-display.scss']
})
export class CodeDisplayComponent {
  code: string = '';
  language: string = 'JAVA';
  username: string = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<CodeDisplayComponent>
  ) {
    this.code = data.code || '';
    this.language = data.language || 'JAVA';
    this.username = data.username || '';
  }

  close(): void {
    this.dialogRef.close();
  }
}