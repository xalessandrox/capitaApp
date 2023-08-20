import { Component, ElementRef, OnInit } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, of, startWith, switchMap } from "rxjs";
import { AppState } from "../../interfaces/appState";
import { CustomerState, CustomHttpResponse } from "../../interfaces/appStates";
import { User } from "../../interfaces/user";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { CustomerService } from "../../services/customer.service";
import { DataState } from "../../enums/dataState.enum";
import { Customer } from "../../interfaces/customer";
import { NgForm } from "@angular/forms";


@Component( {
  selector : 'app-customer',
  templateUrl : './customer.component.html',
  styleUrls : [ './customer.component.css' ]
} )
export class CustomerComponent implements OnInit {
  customerState$: Observable<AppState<CustomHttpResponse<CustomerState>>>;
  readonly DataState = DataState;
  private dataSubject = new BehaviorSubject<CustomHttpResponse<CustomerState>>( null );
  private isLoadingSubject = new BehaviorSubject<boolean>( false );
  isLoading$ = this.isLoadingSubject.asObservable();


  constructor( private activatedRoute: ActivatedRoute, private customerService: CustomerService, private elRef: ElementRef ) {
  }

  ngOnInit(): void {
    this.customerState$ = this.activatedRoute.paramMap.pipe(
      switchMap( ( params: ParamMap ) => {
          return this.customerService.customer$( +params.get( 'customerId' ) )
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
      ) );
  }

  updateCustomer( customerDetailsForm: NgForm ) {
    this.isLoadingSubject.next( true );
    this.customerState$ = this.customerService.updateCustomer$( customerDetailsForm.value )
    .pipe(
      map( response => {
        this.dataSubject.next( { ...response,
          data : { ...response.data,
            customer : { ...response.data.customer,
              invoices : this.dataSubject.value.data.customer.invoices } } } );
        this.isLoadingSubject.next( false );

        return {
          dataState : DataState.Loaded, appData : this.dataSubject.value
        };
      } ),
      startWith( { dataState : DataState.Loaded, appData : this.dataSubject.value } ),
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
