import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { catchError, Observable, of, tap, throwError } from "rxjs";
import { CustomHttpResponse, Profile } from "../interfaces/appStates";
import { User } from "../interfaces/user";

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
        headers: new HttpHeaders().set('Authorization', 'Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJTQU5EUk9fREVWIiwiaWF0IjoxNjkwNDUzMTMyLCJzdWIiOiI1IiwiYXVkIjoiQ1VTVE9NRVJfTUFOQUdFTUVOVF9TRVJWSUNFIiwiZXhwIjoxNjkwNTM5NTMyLCJhdXRob3JpdGllcyI6WyJSRUFEOlVTRVIiLCJSRUFEOkNVU1RPTUVSIl19.g4uj3CtnsBwil50d1e4Co9LIzGiUoqILH5QJo0A8ogdsUsTIC0ZvigMXAjTgNqQ8yuNIt5F8Ct7_0cMV7JSLkw')
      })
    .pipe(
      tap( console.log ),
      catchError( this.handleError )
    );

  update$ = (user: User) => <Observable<CustomHttpResponse<Profile>>>
    this.httpClient.patch<CustomHttpResponse<Profile>>
    ( `${ this.server }/user/update` ,
      user,
      {
        headers: new HttpHeaders().set('Authorization', 'Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJTQU5EUk9fREVWIiwiaWF0IjoxNjkwNDUzMTMyLCJzdWIiOiI1IiwiYXVkIjoiQ1VTVE9NRVJfTUFOQUdFTUVOVF9TRVJWSUNFIiwiZXhwIjoxNjkwNTM5NTMyLCJhdXRob3JpdGllcyI6WyJSRUFEOlVTRVIiLCJSRUFEOkNVU1RPTUVSIl19.g4uj3CtnsBwil50d1e4Co9LIzGiUoqILH5QJo0A8ogdsUsTIC0ZvigMXAjTgNqQ8yuNIt5F8Ct7_0cMV7JSLkw')
      })
    .pipe(
      tap( console.log ),
      catchError( this.handleError)
    );

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.log(error);
    let errorMessage: string;
    if (error.error instanceof ErrorEvent) {
      errorMessage = `A client error occurred - ${error.error.message}`;
    } else {
      if (error.error.reason) {
        errorMessage = error.error.reason;
        console.log(errorMessage);
      } else {
        errorMessage = `An error occurred - Error status ${error.status}`;
      }
    }
    return throwError(() => errorMessage);
  }
}
