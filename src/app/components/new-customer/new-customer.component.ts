import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, of, startWith } from "rxjs";
import { AppState } from "../../interfaces/appState";
import { CustomHttpResponse, Page } from "../../interfaces/appStates";
import { User } from "../../interfaces/user";
import { CustomerService } from "../../services/customer.service";
import { Customer } from "../../interfaces/customer";
import { DataState } from "../../enums/dataState.enum";
import { NgForm } from "@angular/forms";


@Component( {
  selector : 'app-new-customer',
  templateUrl : './new-customer.component.html',
  styleUrls : [ './new-customer.component.css' ]
} )
export class NewCustomerComponent implements OnInit {

  newCustomerState$: Observable<AppState<CustomHttpResponse<Page<Customer> & User>>>;
  readonly DataState = DataState;
  private dataSubject = new BehaviorSubject<CustomHttpResponse<Page<Customer> & User>>( null );
  private isLoadingSubject = new BehaviorSubject<boolean>( false );
  isLoading$ = this.isLoadingSubject.asObservable();

  constructor( private customerService: CustomerService ) {
  }

  ngOnInit(): void {
    this.newCustomerState$ = this.customerService.customers$()
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

  createCustomer( newCustomerForm: NgForm ): void {
    console.log( "request for new customer forwarded" );
    this.isLoadingSubject.next( true );
    this.newCustomerState$ = this.customerService.newCustomer$( newCustomerForm.value )
    .pipe(
      map( response => {
        newCustomerForm.reset( { type : 'INDIVIDUAL', status : 'ACTIVE' } );
        this.isLoadingSubject.next( false );
        return { dataState : DataState.Loaded, appData : this.dataSubject.value };
      } ),
      startWith( { dataState : DataState.Loaded, appData: this.dataSubject.value } ),
      catchError( ( error: string ) => {
        this.isLoadingSubject.next( false );
        return of( {
          dataState : DataState.Loaded,
          error
        } )
      } )
    )
  }

}
