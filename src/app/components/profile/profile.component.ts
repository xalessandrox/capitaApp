import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, of, startWith } from "rxjs";
import { CustomHttpResponse, Profile } from "../../interfaces/appStates";
import { UserService } from "../../services/user.service";
import { DataState } from "../../enums/dataState.enum";
import { AppState } from "../../interfaces/appState";
import { NgForm } from "@angular/forms";

@Component( {
  selector : 'app-profile',
  templateUrl : './profile.component.html',
  styleUrls : [ './profile.component.css' ]
} )
export class ProfileComponent implements OnInit {

  profileState$: Observable<AppState<CustomHttpResponse<Profile>>> = of( { dataState : DataState.Loaded } );
  readonly DataState = DataState;
  private dataSubject = new BehaviorSubject<CustomHttpResponse<Profile>>( null );
  private isLoadingSubject = new BehaviorSubject<boolean>( false );
  isLoading$ = this.isLoadingSubject.asObservable();

  constructor( private userService: UserService ) {
  }

  ngOnInit(): void {

    this.profileState$ = this.userService.profile$()
    .pipe(
      map( response => {
        this.dataSubject.next( response );
        return {
          dataState : DataState.Loaded,
          appData : response
        };
      } ),
      startWith( {
        dataState : DataState.Loading
      } ),
      catchError( ( error: string ) => {
        return of( {
          dataState : DataState.Error,
          appData : this.dataSubject.value,
          error
        } )
      } )
    )

  }

  updateProfile( profileForm: NgForm ) {
    this.isLoadingSubject.next( true );
    this.profileState$ = this.userService.update$( profileForm.value )
    .pipe(
      map( response => {
        this.dataSubject.next( { ...response, data : response.data } );
        this.isLoadingSubject.next( false );
        return {
          dataState : DataState.Loaded,
          appData : this.dataSubject.value
        };
      } ),
      startWith( {
        dataState : DataState.Loaded,
        appData : this.dataSubject.value
      } ),
      catchError( ( error: string ) => {
        this.isLoadingSubject.next( false );
        return of( {
          dataState : DataState.Loaded,
          appData : this.dataSubject.value,
          error
        } )
      } )
    )
  }

}
