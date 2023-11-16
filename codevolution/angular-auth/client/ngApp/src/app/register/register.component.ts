import { Component } from '@angular/core';
import {AuthService} from 'src/app/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  constructor(private _AuthService:AuthService){}
  registerUserData={
    email:"",
    password:""
  }

  registerUser(){
    console.log("registerUserData",this.registerUserData);
    this._AuthService.registerUser(this.registerUserData).subscribe({
      next:(res)=>{console.log("res",res)},
      error:(error)=>{console.log("error",error)}
    })
  }
}
