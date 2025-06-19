import { NgModule } from '@angular/core';
import { CommonModule, DatePipe, TitleCasePipe } from '@angular/common';
import { TruncatePipe } from './pipes/truncate.pipe';

@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule
  ],
  exports: [
    CommonModule,
    DatePipe,
    TitleCasePipe
  ],
  providers: [
    DatePipe,
    TitleCasePipe
  ]
})
export class SharedModule {}