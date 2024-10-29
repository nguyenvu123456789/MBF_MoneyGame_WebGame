import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  NgbDatepickerModule,
  NgbDropdownModule,
  NgbModalModule,
  NgbModule,
  NgbToastModule,
  NgbTooltipModule,
} from '@ng-bootstrap/ng-bootstrap';

const Ngbootstrap = [
  CommonModule,
  NgbModalModule,
  NgbModule,
  NgbTooltipModule,
  NgbToastModule,
  NgbDropdownModule,
  NgbDatepickerModule,
];

@NgModule({
  declarations: [],
  imports: [Ngbootstrap],
  exports: [Ngbootstrap],
})
export class NgbootstrapModule {}
