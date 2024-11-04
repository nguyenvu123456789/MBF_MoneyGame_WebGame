import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WheelOfFortuneComponent } from './wheel-of-fortune/wheel-of-fortune.component';

@NgModule({
  imports: [CommonModule],
  declarations: [
    WheelOfFortuneComponent
  ],
  exports: [
    WheelOfFortuneComponent
  ]
})
export class WheelOfFortuneModule { }
