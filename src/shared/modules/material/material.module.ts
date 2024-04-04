import { NgModule } from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {MatMenuModule} from "@angular/material/menu";
import {MatTabsModule} from "@angular/material/tabs";



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    NgOptimizedImage
  ],
  exports: [
    MatFormFieldModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    NgOptimizedImage,
    MatMenuModule,
    MatTabsModule
  ]
})
export class MaterialModule { }
