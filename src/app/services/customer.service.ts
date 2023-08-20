import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { catchError, Observable, tap, throwError } from "rxjs";
import { CustomerState, CustomHttpResponse, Page } from "../interfaces/appStates";
import { User } from "../interfaces/user";
import { Statistics } from "../interfaces/statistics";
import { Customer } from "../interfaces/customer";

@Injectable( {
  providedIn : 'root'
} )
export class CustomerService {

  private readonly server: string = 'http://localhost:8080';

  constructor( private httpClient: HttpClient ) {
  }

  customers$ = ( page: number = 0 ) => <Observable<CustomHttpResponse<Page<Customer> & User & Statistics>>>
    this.httpClient.get<CustomHttpResponse<Page<Customer> & User & Statistics>>
    ( `${ this.server }/customers/list?page=${ page }` )
    .pipe(
      tap( console.log ),
      catchError( this.handleError )
    );

  customer$ = ( customerId: number ) => <Observable<CustomHttpResponse<CustomerState>>>
    this.httpClient.get<CustomHttpResponse<User & Customer>>
    ( `${ this.server }/customers/${ customerId }` )
    .pipe(
      tap( console.log ),
      catchError( this.handleError )
    );

  updateCustomer$ = ( customer: Customer ) => <Observable<CustomHttpResponse<CustomerState>>>
    this.httpClient.put<CustomHttpResponse<User & Customer>>
    ( `${ this.server }/customers/update`, customer )
    .pipe(
      tap( console.log ),
      catchError( this.handleError )
    );

  searchCustomers$ = ( lastName: string = '', page: number = 0 ) => <Observable<CustomHttpResponse<Page<Customer> & User>>>
    this.httpClient.get<CustomHttpResponse<Page<Customer> & User>>
    ( `${ this.server }/customers/search?lastName=${ lastName }&page=${ page }` )
    .pipe(
      tap( console.log ),
      catchError( this.handleError )
    );

  newCustomer$ = ( customer: Customer ) => <Observable<CustomHttpResponse<User & Customer>>>
    this.httpClient.post<CustomHttpResponse<User & Customer>>
    ( `${ this.server }/customers/new`, customer )
    .pipe(
      tap( console.log ),
      catchError( this.handleError )
    );

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
