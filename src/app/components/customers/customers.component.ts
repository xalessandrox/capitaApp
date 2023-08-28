import { Component, OnInit, ViewChild } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, of, startWith } from "rxjs";
import { AppState } from "../../interfaces/appState";
import { CustomHttpResponse, Page } from "../../interfaces/appStates";
import { User } from "../../interfaces/user";
import { CustomerService } from "../../services/customer.service";
import { DataState } from "../../enums/dataState.enum";
import { Customer } from "../../interfaces/customer";
import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";
import { environment } from "../../../environments/environment";
import { PaginationComponent } from "../utils/pagination/pagination.component";


@Component( {
  selector : 'app-customers',
  templateUrl : './customers.component.html',
  styleUrls : [ './customers.component.css' ]
} )
export class CustomersComponent implements OnInit {

  @ViewChild(PaginationComponent) pagComp: PaginationComponent;

  customersState$: Observable<AppState<CustomHttpResponse<Page<Customer> & User>>>;
  readonly DataState = DataState;
  dataSubject = new BehaviorSubject<CustomHttpResponse<Page<Customer> & User>>( null );
  private isLoadingSubject = new BehaviorSubject<boolean>( false );
  isLoading$ = this.isLoadingSubject.asObservable();
  currentPageSubject = new BehaviorSubject<number>( 0 );
  currentPage$ = this.currentPageSubject.asObservable();
  private showLogsSubject = new BehaviorSubject<boolean>( false );
  showLogs$ = this.showLogsSubject.asObservable();
  protected readonly environment = environment;
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
        this.pagComp.setPagination(this.currentPageSubject.value, response.data.totalPages);
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

  goToPage( args: {lastName?: string, pageNumber?: number}): void {

    this.customersState$ = this.customerService.searchCustomers$( args.lastName, args.pageNumber )
    .pipe(
      map( response => {
        console.log( response );
        this.dataSubject.next( response );
        this.currentPageSubject.next( args.pageNumber );
        return { dataState : DataState.Loaded, appData : response };
      } ),
      startWith( { dataState : DataState.Loaded, appData : this.dataSubject.value } ),
      catchError( ( error: string ) => {
        return of( { dataState : DataState.Loaded, error, appData : this.dataSubject.value } )
      } )
    )
  }


  selectCustomer( customer: Customer ): void {
    this.router.navigate( [ `/customers/${ customer.id }` ] );
  }


}
