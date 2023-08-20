import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, of, startWith } from "rxjs";
import { AppState } from "../../interfaces/appState";
import { CustomHttpResponse } from "../../interfaces/appStates";
import { User } from "../../interfaces/user";
import { CustomerService } from "../../services/customer.service";
import { NgForm } from "@angular/forms";
import { DataState } from "../../enums/dataState.enum";
import { Customer } from "../../interfaces/customer";
import { InvoiceService } from "../../services/invoice.service";


@Component( {
  selector : 'app-new-invoice',
  templateUrl : './new-invoice.component.html',
  styleUrls : [ './new-invoice.component.css' ]
} )
export class NewInvoiceComponent implements OnInit {

  newInvoiceState$: Observable<AppState<CustomHttpResponse<Customer[] & User>>>;
  readonly DataState = DataState;
  private dataSubject = new BehaviorSubject<CustomHttpResponse<Customer[] & User>>( null );
  private isLoadingSubject = new BehaviorSubject<boolean>( false );
  isLoading$ = this.isLoadingSubject.asObservable();

  constructor( private customerService: CustomerService, private invoiceService: InvoiceService ) {
  }

  ngOnInit(): void {
    this.newInvoiceState$ = this.invoiceService.newInvoice$()
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

  createInvoice( newInvoiceForm: NgForm ): void {
    this.isLoadingSubject.next( true );
    this.newInvoiceState$ = this.invoiceService.createInvoice$(newInvoiceForm.value.customerId, newInvoiceForm.value  )
    .pipe(
      map( response => {
        newInvoiceForm.reset( { status : 'PENDING' } );
        this.isLoadingSubject.next( false );
        this.dataSubject.next( response );
        return { dataState : DataState.Loaded, appData : this.dataSubject.value };
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

