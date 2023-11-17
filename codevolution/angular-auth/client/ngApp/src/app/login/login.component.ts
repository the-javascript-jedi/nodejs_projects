import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router'


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginUserData = {
    email:"",
    password:""
  }

  constructor(private _auth: AuthService,
              private _router: Router) { }

  ngOnInit() {
  }

  loginUser () {
    this._auth.loginUser(this.loginUserData)
    .subscribe(
      {
        next:(res) => 
        {
        localStorage.setItem('token', res.token);
        this._router.navigate(['/special']);
        },
        error:()=>{
          err => console.log("loginUser",err);
        }
      }
    ) 
  }

}