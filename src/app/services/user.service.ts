import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { catchError, Observable, tap, throwError } from "rxjs";
import { JwtHelperService } from "@auth0/angular-jwt";
import { CustomHttpResponse, Profile } from "../interfaces/appStates";
import { User } from "../interfaces/user";
import { Key } from "../enums/key.enum";
import { environment } from "../../environments/environment";
import { HttpCacheService } from "./http.cache.service";

@Injectable( {
	providedIn : 'root'
} )
export class UserService {

	private jwtHelper = new JwtHelperService();

	constructor( private httpClient: HttpClient, private cacheService: HttpCacheService ) {
	}

	login$ = ( email: string, password: string ) => <Observable<CustomHttpResponse<Profile>>>
		this.httpClient.post<CustomHttpResponse<Profile>>
		( `${ environment.server }/user/login`, { email, password } )
		.pipe(
			tap( console.log ),
			catchError( this.handleError )
		);

	save$ = ( user: User ) => <Observable<CustomHttpResponse<Profile>>>
		this.httpClient.post<CustomHttpResponse<Profile>>
		( `${ environment.server }/user/register`, user )
		.pipe(
			tap( console.log ),
			catchError( this.handleError )
		);

	verifyCode$ = ( email: string, verificationCode: string ) => <Observable<CustomHttpResponse<Profile>>>
		this.httpClient.get<CustomHttpResponse<Profile>>
		( `${ environment.server }/user/verify/code/${ email }/${ verificationCode }` )
		.pipe(
			tap( console.log ),
			catchError( this.handleError )
		);

	profile$ = () => <Observable<CustomHttpResponse<Profile>>>
		this.httpClient.get<CustomHttpResponse<Profile>>
		( `${ environment.server }/user/profile` )
		.pipe(
			tap( console.log ),
			catchError( this.handleError )
		);

	update$ = ( user: User ) => <Observable<CustomHttpResponse<Profile>>>
		this.httpClient.patch<CustomHttpResponse<Profile>>
		( `${ environment.server }/user/update`, user )
		.pipe(
			tap( console.log ),
			catchError( this.handleError )
		);

	refreshToken$ = () => <Observable<CustomHttpResponse<Profile>>>
		this.httpClient.get<CustomHttpResponse<Profile>>
		( `${ environment.server }/user/refresh/token`, {
			headers : { Authorization : `Bearer ${ localStorage.getItem( Key.RefreshToken ) }` }
		} )
		.pipe(
			tap( response => {
				localStorage.removeItem( Key.AccessToken )
				localStorage.removeItem( Key.RefreshToken )
				localStorage.setItem( Key.AccessToken, response.data.access_token )
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
		( `${ environment.server }/user/update/password`, form )
		.pipe(
			tap( console.log ),
			catchError( this.handleError )
		);

	updateRole$ = ( roleName: string ) => <Observable<CustomHttpResponse<Profile>>>
		this.httpClient.patch<CustomHttpResponse<Profile>>
		( `${ environment.server }/user/update/role/${ roleName }`, {} )
		.pipe(
			tap( console.log ),
			catchError( this.handleError )
		);

	updateAccountSettings$ = ( settingsForm: {
		enabled: boolean,
		notLocked: boolean
	} ) => <Observable<CustomHttpResponse<Profile>>>
		this.httpClient.patch<CustomHttpResponse<Profile>>
		( `${ environment.server }/user/update/settings`, settingsForm )
		.pipe(
			tap( console.log ),
			catchError( this.handleError )
		);

	updateUsingMfa$ = () => <Observable<CustomHttpResponse<Profile>>>
		this.httpClient.patch<CustomHttpResponse<Profile>>
		( `${ environment.server }/user/update/usingMfa`, {} )
		.pipe(
			tap( console.log ),
			catchError( this.handleError )
		);

	updateImage$ = ( formData: FormData ) => <Observable<CustomHttpResponse<Profile>>>
		this.httpClient.patch<CustomHttpResponse<Profile>>
		( `${ environment.server }/user/update/image`, formData )
		.pipe(
			tap( console.log ),
			catchError( this.handleError )
		);

	isAuthenticated = (): boolean => !this.jwtHelper.isTokenExpired( localStorage.getItem( Key.RefreshToken ) );

	logOut() {
		localStorage.removeItem( Key.AccessToken );
		localStorage.removeItem( Key.RefreshToken );
		this.cacheService.evictAll();
	}

	private handleError( response: HttpErrorResponse ): Observable<never> {
		console.log( response );
		let errorMessage: string;
		if (response.error instanceof ErrorEvent) {
			errorMessage = `A client error occurred - ${ response.error.message }`;
		} else {
			if (response.error.reason) {
				errorMessage = response.error.reason;
				console.log( errorMessage );
			} else {
				errorMessage = `An error occurred - Error status ${ response.status }`;
			}
		}
		return throwError( () => errorMessage );
	}

}
