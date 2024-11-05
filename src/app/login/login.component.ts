import {Component, OnInit} from '@angular/core';
import {AuthService} from "../services/data/auth.service";
import {Router} from "@angular/router";
import {FormBuilder, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit{

  loginForm!: FormGroup;
  constructor(private authService: AuthService,
              private router: Router,
              private fb: FormBuilder) {
  }
  login(): void {
    
    const {msisdn, password} = this.loginForm.value;
    this.authService.apiLogin(msisdn, password).subscribe((res) => {
      console.log("navigating.....")
      this.router.navigate(['play']);
        console.log("okkkkk")
    },
      (err) => {
      console.log(err);
      })
  }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      msisdn : [''],
      password : ['']
    })
  }
}
