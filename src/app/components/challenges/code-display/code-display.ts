import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-code-display',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './code-display.html',
  styleUrls: ['./code-display.scss']
})
export class CodeDisplay {
  @Input() code: string = '';
  @Input() language: string = 'JAVA'; // Puedes detectar el lenguaje o permitir seleccionarlo
}