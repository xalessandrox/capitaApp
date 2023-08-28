import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { catchError, Observable, tap, throwError } from "rxjs";
import { CustomHttpResponse, Page } from "../interfaces/appStates";
import { User } from "../interfaces/user";
import { Customer } from "../interfaces/customer";
import { Invoice } from "../interfaces/invoice";
import { environment } from "../../environments/environment";
@Injectable( {
  providedIn : 'root'
} )

export class InvoiceService {

  constructor( private httpClient: HttpClient ) {
  }

  newInvoice$ = () => <Observable<CustomHttpResponse<Customer[] & User>>>
    this.httpClient.get<CustomHttpResponse<Customer[] & User>>
    ( `${ environment.server }/invoices/new` )
    .pipe(
      tap( console.log ),
      catchError( this.handleError )
    );

  createInvoice$ = ( customerId: number, invoice: Invoice ) => <Observable<CustomHttpResponse<Customer[] & User>>>
    this.httpClient.post<CustomHttpResponse<Customer[] & User>>
    ( `${ environment.server }/invoices/addCustomer/${ customerId }`, invoice )
    .pipe(
      tap( console.log ),
      catchError( this.handleError )
    );

  invoices$ = ( page: number = 0 ) => <Observable<CustomHttpResponse<Page<Invoice> & User>>>
    this.httpClient.get<CustomHttpResponse<Page<Invoice> & User>>
    ( `${ environment.server }/invoices/list/paged?page=${ page }` )
    .pipe(
      tap( console.log ),
      catchError( this.handleError )
    );

  invoice$ = ( id: number ) => <Observable<CustomHttpResponse<Customer & Invoice & User>>>
    this.httpClient.get<CustomHttpResponse<Customer & Invoice & User>>
    ( `${ environment.server }/invoices/${id}` )
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
