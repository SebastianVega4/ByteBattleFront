import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './about.html',
  styleUrls: ['./about.scss']
})
export class AboutComponent {
  whatsappGroupLink = 'https://chat.whatsapp.com/[TU_ENLACE_DE_GRUPO]';
  adminEmail = 'Sebastian.vegar2015@gmail.com';
}