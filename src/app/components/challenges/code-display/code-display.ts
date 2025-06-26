import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-code-display',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  templateUrl: './code-display.html',
  styleUrls: ['./code-display.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CodeDisplayComponent {
  code: string = '';
  language: string = 'java';
  username: string = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<CodeDisplayComponent>
  ) {
    this.code = data.code || '';
    this.language = data.language || 'java';
    this.username = data.username || '';
  }

  close(): void {
    this.dialogRef.close();
  }
}