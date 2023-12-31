import { Injectable } from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse
} from '@angular/common/http';
import { BehaviorSubject, catchError, Observable, switchMap, throwError } from 'rxjs';
import { Key } from "../enums/key.enum";
import { error } from "@angular/compiler-cli/src/transformers/util";
import { UserService } from "../services/user.service";
import { CustomHttpResponse, Profile } from "../interfaces/appStates";
import { environment } from "../../environments/environment";

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  private isTokenRefreshing: boolean = false;
  private refreshTokenSubject: BehaviorSubject<CustomHttpResponse<Profile>> = new BehaviorSubject( null );

  constructor( private userService: UserService ) {
  }

  intercept( request: HttpRequest<unknown>, next: HttpHandler ): Observable<HttpEvent<unknown>> | Observable<HttpResponse<unknown>>|any {

    for (let i = 0; i < environment.PUBLIC_URLS.length; i++) {
      if (request.url.includes( environment.PUBLIC_URLS[i] )) {
        return next.handle( request );
      }
    }


    return next.handle( this.addAuthorizationTokenHeader( request, localStorage.getItem( Key.AccessToken ) ) )
    .pipe(
      catchError( ( response: HttpErrorResponse ) => {
        if (response instanceof HttpErrorResponse && response.status == 401 && response.error.reason.includes( 'expired' )) {
          return this.handleRefreshToken( request, next );
        } else {
          return throwError( () => response )
        }
      } )
    );

  }

  private handleRefreshToken( request: HttpRequest<unknown>, next: HttpHandler ): any {
    if (!this.isTokenRefreshing) {
      console.log( 'Refreshing Token...' );
      this.isTokenRefreshing = true;
      this.refreshTokenSubject.next( null );
      return this.userService.refreshToken$()
      .pipe(
        switchMap( ( response ) => {
          console.log( 'Token refresh response ', response );
          this.isTokenRefreshing = false;
          this.refreshTokenSubject.next( response );
          console.log( 'Sending original request ', request );
          console.log( 'New token: ', response.data.access_token );
          return next.handle( this.addAuthorizationTokenHeader( request, response.data.access_token ) );
        } )
      );
    } else {
      this.refreshTokenSubject.pipe(
        switchMap( ( response ) => {
          return next.handle( this.addAuthorizationTokenHeader( request, response.data.access_token ) );
        } )
      );
    }
  }

  private addAuthorizationTokenHeader( request: HttpRequest<unknown>, token: string ): HttpRequest<any> {
    return request.clone( {
      setHeaders :
        {
          Authorization : `Bearer ${ token }`
        }
    } );
  }
}
