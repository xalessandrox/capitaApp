import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, of, startWith } from 'rxjs';
import { CustomHttpResponse, Page } from "../../interfaces/appStates";
import { User } from "../../interfaces/user";
import { CustomerService } from "../../services/customer.service";
import { DataState } from "../../enums/dataState.enum";
import { AppState } from "../../interfaces/appState";
import { Customer } from "../../interfaces/customer";
import { Router } from "@angular/router";


@Component( {
  selector : 'app-home',
  templateUrl : './home.component.html',
  styleUrls : [ './home.component.css' ]
} )
export class HomeComponent implements OnInit {

  homeState$: Observable<AppState<CustomHttpResponse<Page<Customer> & User>>>;
  readonly DataState = DataState;
  private dataSubject = new BehaviorSubject<CustomHttpResponse<Page<Customer> & User>>( null );
  private isLoadingSubject = new BehaviorSubject<boolean>( false );
  isLoading$ = this.isLoadingSubject.asObservable();
  private currentPageSubject = new BehaviorSubject<number>( 0 );
  currentPage$ = this.currentPageSubject.asObservable();
  private showLogsSubject = new BehaviorSubject<boolean>( false );
  showLogs$ = this.showLogsSubject.asObservable();

  constructor( private router: Router, private customerService: CustomerService ) {
  }

  ngOnInit(): void {
    this.homeState$ = this.customerService.customers$()
    .pipe(
      map( response => {
        this.dataSubject.next( response );
        return {
          dataState : DataState.Loaded,
          appData : response
        };
      } ),
      startWith( { dataState : DataState.Loading } ),
      catchError( ( error: string ) => {
        return of( {
          dataState : DataState.Error,
          error
        } )
      } )
    )
  }

  goToPage( pageNumber?: number ): void {
    this.homeState$ = this.customerService.customers$( pageNumber )
    .pipe(
      map( response => {
        console.log( response );
        this.dataSubject.next( response );
        this.currentPageSubject.next( pageNumber );
        return { dataState : DataState.Loaded, appData : response };
      } ),
      startWith( { dataState : DataState.Loaded, appData : this.dataSubject.value } ),
      catchError( ( error: string ) => {
        return of( { dataState : DataState.Loaded, error, appData : this.dataSubject.value } )
      } )
    )
  }

  goToNextOrPreviousPage( direction?: string ): void {
    this.goToPage( direction === 'forward' ? this.currentPageSubject.value + 1 : this.currentPageSubject.value - 1 );
  }

  selectCustomer( customer: Customer ): void {
    this.router.navigate( [`/customers/${customer.id}`] );
  }

}
