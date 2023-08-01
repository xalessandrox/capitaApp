import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { catchError, Observable, tap, throwError } from "rxjs";
import { CustomHttpResponse, Profile } from "../interfaces/appStates";
import { User } from "../interfaces/user";
import { Key } from "../enums/key.enum";

@Injectable( {
  providedIn : 'root'
} )
export class UserService {

  private readonly server: string = 'http://localhost:8080';

  constructor( private httpClient: HttpClient ) {
  }

  login$ = ( email: string, password: string ) => <Observable<CustomHttpResponse<Profile>>>
    this.httpClient.post<CustomHttpResponse<Profile>>
    ( `${ this.server }/user/login`, { email, password } )
    .pipe(
      tap( console.log ),
      catchError( this.handleError )
    );

  verifyCode$ = ( email: string, verificationCode: string ) => <Observable<CustomHttpResponse<Profile>>>
    this.httpClient.get<CustomHttpResponse<Profile>>
    ( `${ this.server }/user/verify/code/${ email }/${ verificationCode }` )
    .pipe(
      tap( console.log ),
      catchError( this.handleError )
    );

  profile$ = () => <Observable<CustomHttpResponse<Profile>>>
    this.httpClient.get<CustomHttpResponse<Profile>>
    ( `${ this.server }/user/profile` )
    .pipe(
      tap( console.log ),
      catchError( this.handleError )
    );

  update$ = ( user: User ) => <Observable<CustomHttpResponse<Profile>>>
    this.httpClient.patch<CustomHttpResponse<Profile>>
    ( `${ this.server }/user/update`, user )
    .pipe(
      tap( console.log ),
      catchError( this.handleError )
    );

  refreshToken$ = () => <Observable<CustomHttpResponse<Profile>>>
    this.httpClient.get<CustomHttpResponse<Profile>>
    ( `${ this.server }/user/refresh/token`, {
      headers : { Authorization : `Bearer ${ localStorage.getItem( Key.RefreshToken ) }` }
    } )
    .pipe(
      tap( response => {
        localStorage.removeItem( Key.Token )
        localStorage.removeItem( Key.RefreshToken )
        localStorage.setItem( Key.Token, response.data.access_token )
        localStorage.setItem( Key.RefreshToken, response.data.refresh_token )
        console.log( response );
      } ),
      catchError( this.handleError )
    );

  updatePassword$ = ( form: {
    currentPassword: string,
    newPassword: string,
    confirmNewPassword: string
  } ) => <Observable<CustomHttpResponse<Profile>>>
    this.httpClient.patch<CustomHttpResponse<Profile>>
    ( `${ this.server }/user/update/password`, form )
    .pipe(
      tap( console.log ),
      catchError( this.handleError )
    );

  updateRole$ = ( roleName: string ) => <Observable<CustomHttpResponse<Profile>>>
    this.httpClient.patch<CustomHttpResponse<Profile>>
    ( `${ this.server }/user/update/role/${roleName}`, {})
    .pipe(
      tap( console.log ),
      catchError( this.handleError )
    );

  updateAccountSettings$ = ( settingsForm: {enabled:boolean, notLocked:boolean} ) => <Observable<CustomHttpResponse<Profile>>>
    this.httpClient.patch<CustomHttpResponse<Profile>>
    ( `${ this.server }/user/update/settings`, settingsForm)
    .pipe(
      tap( console.log ),
      catchError( this.handleError )
    );

  private handleError( error: HttpErrorResponse ): Observable<never> {
    console.log( error );
    let errorMessage: string;
    if (error.error instanceof ErrorEvent) {
      errorMessage = `A client error occurred - ${ error.error.message }`;
    } else {
      if (error.error.reason) {
        errorMessage = error.error.reason;
        console.log( errorMessage );
      } else {
        errorMessage = `An error occurred - Error status ${ error.status }`;
      }
    }
    return throwError( () => errorMessage );
  }
}
