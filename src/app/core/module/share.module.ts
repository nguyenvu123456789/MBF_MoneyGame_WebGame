import { NgModule } from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';

import { RouterModule } from '@angular/router';
import { MaterialModule } from './material.module';
import { NgbootstrapModule } from './ngbootstrap.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MaterialModule,
    NgbootstrapModule,
    ReactiveFormsModule,
  ],
  exports: [
    CommonModule,
    MaterialModule,
    NgbootstrapModule,
    ReactiveFormsModule,
  ],
})
export class ShareModule {}
