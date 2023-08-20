import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, of, startWith } from "rxjs";
import { AppState } from "../../interfaces/appState";
import { CustomHttpResponse, Page } from "../../interfaces/appStates";
import { User } from "../../interfaces/user";
import { CustomerService } from "../../services/customer.service";
import { DataState } from "../../enums/dataState.enum";
import { Customer } from "../../interfaces/customer";
import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";


@Component( {
  selector : 'app-customers',
  templateUrl : './customers.component.html',
  styleUrls : [ './customers.component.css' ]
} )
export class CustomersComponent implements OnInit {

  customersState$: Observable<AppState<CustomHttpResponse<Page<Customer> & User>>>;
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
    this.customersState$ = this.customerService.searchCustomers$()
    .pipe(
      map( response => {
        console.log( response );
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

  searchCustomers( customerSearchForm: NgForm ): void {
    this.currentPageSubject.next( 0 );
    this.customersState$ = this.customerService.searchCustomers$( customerSearchForm.value.lastName )
    .pipe(
      map( response => {
        this.dataSubject.next( response );
        console.log( response );
        return {
          dataState : DataState.Loaded,
          appData : response
        };
      } ),
      startWith( { dataState : DataState.Loaded, appData : this.dataSubject.value } ),
      catchError( ( error: string ) => {
        return of( {
          dataState : DataState.Error,
          error
        } )
      } )
    )
  }

  goToPage( pageNumber?: number, lastName?: string ): void {
    this.customersState$ = this.customerService.searchCustomers$( lastName, pageNumber )
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

  goToNextOrPreviousPage( direction?: string, lastName?: string ): void {
    this.goToPage( direction === 'forward' ? this.currentPageSubject.value + 1 : this.currentPageSubject.value - 1, lastName );
  }

  selectCustomer( customer: Customer ): void {
    this.router.navigate( [ `/customers/${ customer.id }` ] );
  }

}
