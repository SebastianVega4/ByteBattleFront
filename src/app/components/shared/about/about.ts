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
  whatsappGroupLink = 'https://chat.whatsapp.com/GQ3ELtwm47I4R6E65xaMmq?mode=r_c';
  adminEmail = 'Sebastian.vegar2015@gmail.com';
}