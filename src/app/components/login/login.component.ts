import { Component } from '@angular/core';
import { Router } from "@angular/router";
import { UserService } from "../../services/user.service";
import { NgForm } from "@angular/forms";
import { LoginState } from "../../interfaces/appStates";
import { BehaviorSubject, catchError, map, Observable, of, startWith } from "rxjs";
import { DataState } from "../../enums/dataState.enum";
import { Key } from "../../enums/key.enum";

@Component( {
  selector : 'app-login',
  templateUrl : './login.component.html',
  styleUrls : [ './login.component.css' ]
} )
export class LoginComponent {

  loginState$: Observable<LoginState> = of( { dataState : DataState.Loaded } );

  readonly DataState = DataState;
  private emailSubject = new BehaviorSubject<string | null>( null );
  private phoneSubject = new BehaviorSubject<string | null>( null );

  constructor( private router: Router, private userService: UserService ) {
  }

  login( loginForm: NgForm ): void {
    this.loginState$ = this.userService.login$( loginForm.value.email, loginForm.value.password )
    .pipe(
      map( response => {
        if (response.data.user.usingMfa) {
          this.phoneSubject.next( response.data.user.phone );
          this.emailSubject.next( response.data.user.email );
          return {
            dataState : DataState.Loaded, isUsingMfa : true, loginSuccess : false,
            email : response.data.user.email
          };
        } else {
          localStorage.setItem( Key.Token, response.data.access_token );
          localStorage.setItem( Key.RefreshToken, response.data.refresh_token );
          this.router.navigate( [ '/' ] );
          return {
            dataState : DataState.Loaded,
            loginSuccess : true
          };
        }
      } ),
      startWith( { dataState : DataState.Loading, isUsingMfa : false } ),
      catchError( ( error: string ) => {
        return of( {
          dataState : DataState.Error,
          isUsingMfa : false,
          loginSuccess : false,
          error
        } )
      } )
    )
  }

  verifyCode( verifyCodeForm: NgForm ): void {
    this.loginState$ = this.userService.verifyCode$( this.emailSubject.value, verifyCodeForm.value.verificationCode )
    .pipe( map( response => {
        localStorage.setItem( Key.Token, response.data!.access_token );
        localStorage.setItem( Key.RefreshToken, response.data!.refresh_token );
        this.router.navigate( [ '/' ] );
        return {
          dataState : DataState.Loaded,
          loginSuccess : true
        };
      } ),
      startWith( {
        dataState : DataState.Loading,
        isUsingMfa : true,
        loginSuccess : false,
        email : this.emailSubject.value
      } ),
      catchError( ( error: string ) => {
        return of( {
          dataState : DataState.Error,
          isUsingMfa : true,
          loginSuccess : false,
          error,
          email : this.emailSubject.value
        } );
      } )
    )
  }

  navigateToLoginPage() {
    this.loginState$ = of( {
      dataState : DataState.Loaded
    } );
  }


}
