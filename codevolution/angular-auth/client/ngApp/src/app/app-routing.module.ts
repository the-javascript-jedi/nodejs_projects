import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EventsComponent } from './events/events.component';
import { SpecialEventsComponent } from './special-events/special-events.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

const routes: Routes = [
  {
    path:'',
    redirectTo:'/events',
    pathMatch:'full'
  },
  {
    path:'events',
    component:EventsComponent
  },{
     path:'events',
    component:SpecialEventsComponent
  },{
     path:'login',
    component:LoginComponent
  },{
     path:'register',
    component:RegisterComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
