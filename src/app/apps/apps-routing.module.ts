import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChatComponent } from './chat/chat.component';
import { SupportComponent } from './support/support.component';
import { ListofticketComponent } from './chatbot/listofticket/listofticket.component';
const routes: Routes = [
  {
    path: 'inbox',
    component: ChatComponent,
  },
  {
    path: 'support',
    component: SupportComponent,
  },
  {
    path: 'list-of-tickets',
    component: ListofticketComponent,
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AppsRoutingModule {}
