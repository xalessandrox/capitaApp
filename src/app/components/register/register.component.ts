import { Component } from '@angular/core';
import { catchError, map, Observable, of, startWith } from "rxjs";
import { RegisterState } from "../../interfaces/appStates";
import { DataState } from "../../enums/dataState.enum";
import { UserService } from "../../services/user.service";
import { NgForm } from "@angular/forms";

@Component( {
	selector : 'app-register',
	templateUrl : './register.component.html',
	styleUrls : [ './register.component.css' ]
} )
export class RegisterComponent {
	registerState$: Observable<RegisterState> = of( { dataState : DataState.Loaded } );
	readonly dataState: DataState;
	protected readonly DataState = DataState;

	constructor( private userService: UserService ) {
	}

	register( registerForm: NgForm ): void {
		this.registerState$ = this.userService.save$( registerForm.value )
		.pipe(
			map( response => {
				console.log( "REGISTER RESPONSE: ", response );
				registerForm.reset();
				return {
					dataState : DataState.Loaded,
					registerSuccess : true,
					message : response.message
				}
			} ),
			startWith( {
				dataState : DataState.Loading,
				registerSuccess : false
			} ),
			catchError( ( error: string ) => {
				return of( {
					dataState : DataState.Error,
					registerSuccess : false,
					error
				} )
			} )
		);
	}

	createAnotherAccount() {
		this.registerState$ = of( { dataState : DataState.Loaded, registerSuccess : false } )
	}
}
