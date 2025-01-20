import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';
import { StudentsService } from './students/students.service';



@NgModule({
  declarations: [

  
  
  ],
  imports: [CommonModule, AdminRoutingModule],
  providers: [StudentsService],
})
export class AdminModule {}
