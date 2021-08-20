import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-routing.module';
import { LayoutComponent } from './layout.component';


@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        UsersRoutingModule,
      //  MDBBootstrapModule.forRoot()

    ],
    declarations: [
        LayoutComponent,
        // ListComponent,
        // AddEditComponent
    ]
})
export class UsersModule { }