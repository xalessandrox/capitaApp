import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { catchError, Observable, tap, throwError } from "rxjs";
import { CustomHttpResponse, Profile } from "../interfaces/appStates";

@Injectable( {
  providedIn : 'root'
} )
export class UserService {

  private readonly server: string = 'http://localhost:8080';

  constructor( private httpClient: HttpClient ) {
  }

  public login$ = ( email: string, password: string ) => <Observable<CustomHttpResponse<Profile>>>
    this.httpClient.post<CustomHttpResponse<Profile>>
    ( `${ this.server }/user/login`, { email, password } )
    .pipe(
      tap( console.log ),
      catchError( this.handleError )
    );

  verifyCode$ = ( email: string, code: string ) => <Observable<CustomHttpResponse<Profile>>>
    this.httpClient.get<CustomHttpResponse<Profile>>
    ( `${ this.server }/user/verify/code/${ email }/${ code }` )
    .pipe(
      tap( console.log ),
      catchError( this.handleError )
    );

  private handleError( response: HttpErrorResponse ): Observable<never> {
    let errorMessage: string;
    if (response.error instanceof ErrorEvent) {
      errorMessage = `A client error occurred - ${ response.error.message }`;
    } else {
      if (response.error.reason) {
        errorMessage = `${ response.error.reason }`;
      } else {
        errorMessage = `Status ${ response.status } error`;
        console.log( response );
      }
    }
    return throwError( () => errorMessage );
  }
}
