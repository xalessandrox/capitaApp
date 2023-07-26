import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { catchError, Observable, tap, throwError } from "rxjs";
import { CustomHttpResponse, Profile } from "../interfaces/appStates";

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
    ( `${ this.server }/user/profile` ,
      {
        headers: new HttpHeaders().set('Authorization', 'Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJhdXRob3JpdGllcyI6WyJSRUFEOlVTRVIiLCJSRUFEOkNVU1RPTUVSIl0sImlzcyI6IlNBTkRST19ERVYiLCJhdWQiOiJDVVNUT01FUl9NQU5BR0VNRU5UX1NFUlZJQ0UiLCJpYXQiOjE2OTAzOTUwNjMsInN1YiI6ImZvcm1pY2FsZUBob3RtYWlsLmNvbSIsImV4cCI6MTY5MDM5Njg2M30.1DRwbFeOm-okhvppIWcd4m7OeFnUFS6KRLrXGvt6flzNctgndyukOOJwmzBc6_3WV4sCSk_nqqoXY862soqLSg')
      })
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
