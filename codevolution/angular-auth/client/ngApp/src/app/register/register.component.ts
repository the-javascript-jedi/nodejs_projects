import { Component } from '@angular/core';
import {AuthService} from 'src/app/services/auth.service';
import { Router } from '@angular/router'

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  constructor(private _AuthService:AuthService,private _router: Router){}
  registerUserData={
    email:"",
    password:""
  }

  registerUser(){
    console.log("registerUserData",this.registerUserData);
    this._AuthService.registerUser(this.registerUserData).subscribe({
      next:(res)=>{
        localStorage.setItem('token',res.token);
        this._router.navigate(['/special']);
      },
      error:(error)=>{console.log("error",error)}
    })
  }
}
