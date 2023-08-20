import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, of, startWith } from "rxjs";
import { CustomHttpResponse, Profile } from "../../interfaces/appStates";
import { UserService } from "../../services/user.service";
import { DataState } from "../../enums/dataState.enum";
import { EventType } from "../../enums/event-type.enum";
import { AppState } from "../../interfaces/appState";
import { NgForm } from "@angular/forms";

@Component( {
  selector : 'app-profile',
  templateUrl : './profile.component.html',
  styleUrls : [ './profile.component.css' ]
} )
export class ProfileComponent implements OnInit {

  profileState$: Observable<AppState<CustomHttpResponse<Profile>>> = of( { dataState : DataState.Loaded } );
  roleName: { title: string, color: string };
  readonly DataState = DataState;
  readonly EventType = EventType;
  protected readonly Event = Event;
  private dataSubject = new BehaviorSubject<CustomHttpResponse<Profile>>( null );
  private isLoadingSubject = new BehaviorSubject<boolean>( false );
  isLoading$ = this.isLoadingSubject.asObservable();
  private showLogsSubject = new BehaviorSubject<boolean>( false );
  showLogs$ = this.showLogsSubject.asObservable();

  constructor( private userService: UserService ) {
  }

  ngOnInit(): void {

    this.profileState$ = this.userService.profile$()
    .pipe(
      map( response => {
        this.dataSubject.next( response );
        this.roleName = this.getRoleColorForTemplate( response.data!.user.roleName );
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
        this.roleName = this.getRoleColorForTemplate( response.data.user.roleName );
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

  updateRole( updateRoleForm: NgForm ) {
    this.isLoadingSubject.next( true );
    this.profileState$ = this.userService.updateRole$( updateRoleForm.value.roleName )
    .pipe(
      map( response => {
        this.dataSubject.next( { ...response, data : response.data } );
        this.roleName = this.getRoleColorForTemplate( response.data.user.roleName );
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

  updateAccountSettings( updateSettingsForm: NgForm ) {
    this.isLoadingSubject.next( true );
    this.profileState$ = this.userService.updateAccountSettings$( updateSettingsForm.value )
    .pipe(
      map( response => {
        this.dataSubject.next( { ...response, data : response.data } );
        this.roleName = this.getRoleColorForTemplate( response.data.user.roleName );
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

  updatePassword( passwordForm: NgForm ) {
    if (!( passwordForm.value.newPassword === passwordForm.value.confirmNewPassword )) {

    } else {
      if (confirm( "You sure want to update your password?" )) {
        this.isLoadingSubject.next( true );
        this.profileState$ = this.userService.updatePassword$( passwordForm.value )
        .pipe(
          map( ( response ) => {
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
        );
      }

    }
    passwordForm.reset();
  }

  updateUsingMfa() {
    this.isLoadingSubject.next( true );
    this.profileState$ = this.userService.updateUsingMfa$()
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

  updateImage( image: File ) {
    console.log( image );
    if (image) {
      this.isLoadingSubject.next( true );
      this.profileState$ = this.userService.updateImage$( this.getFormData( image ) )
      .pipe(
        map( response => {
          this.dataSubject.next( {
            ...response,
            data : {
              ...response.data,
              user : {
                ...response.data.user,
                imageUrl : `${ response.data.user.imageUrl }`
              }
            }
          } );
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

  toggleLogs(): void {
    this.showLogsSubject.next( !this.showLogsSubject.value );
  }

  getBgClassByEventType( eventType: string ) {
    let bgClass = '';
    switch
      (eventType) {
      case EventType.LoginAttempt:
        bgClass = 'bg-warning';
        break;
      case EventType.LoginAttemptSuccess:
        bgClass = 'bg-success';
        break;
      case EventType.LoginAttemptFailure:
        bgClass = 'bg-danger';
        break;
      case EventType.ProfileUpdate:
        bgClass = 'bg-primary';
        break;
      case EventType.ProfilePictureUpdate:
        bgClass = 'bg-primary';
        break;
      case EventType.AccountSettingsUpdate:
        bgClass = 'bg-warning';
        break;
      case EventType.RoleUpdate:
        bgClass = 'bg-info';
        break;
      case EventType.PasswordUpdate:
        bgClass = 'bg-warning';
        break;
      case EventType.MfaUpdate:
        bgClass = 'bg-info';
        break;

    }
    return bgClass;
  }

  private getFormData( image: File ): FormData {
    let formData = new FormData();
    formData.append( 'image', image );
    // formData.forEach((key, value) => {
    //   console.log( "Key: ", key, " - Value: ", value );
    // });
    // let options = {content: formData}
    return formData;

  }

  private getRoleColorForTemplate( roleName: string ) {
    let title = roleName.substring( roleName.indexOf( '_' ) + 1 );
    let color: string = '';
    switch (title) {
      case 'USER':
        color = 'green';
        break;
      case 'MANAGER':
        color = "yellow";
        break;
      case 'ADMIN':
        color = 'orange';
        break;
      case 'SYSADMIN':
        color = 'red';
        break;
    }
    return { title : title, color : color }
  }
}
