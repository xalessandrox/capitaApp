import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, of, startWith, switchMap } from "rxjs";
import { AppState } from "../../interfaces/appState";
import { CustomHttpResponse } from "../../interfaces/appStates";
import { Customer } from "../../interfaces/customer";
import { User } from "../../interfaces/user";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { DataState } from "../../enums/dataState.enum";
import { Invoice } from "../../interfaces/invoice";
import { InvoiceService } from "../../services/invoice.service";
import { formatDate } from "@angular/common";

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.css']
})
export class InvoiceComponent  implements OnInit {

  invoiceState$: Observable<AppState<CustomHttpResponse<Customer & Invoice & User>>>;
  readonly DataState = DataState;
  private dataSubject = new BehaviorSubject<CustomHttpResponse<Customer & Invoice & User>>( null );
  private isLoadingSubject = new BehaviorSubject<boolean>( false );
  isLoading$ = this.isLoadingSubject.asObservable();

  constructor( private activatedRoute: ActivatedRoute, private invoiceService: InvoiceService ) {
  }

  ngOnInit(): void {
    this.invoiceState$ = this.activatedRoute.paramMap.pipe(
      switchMap( ( params: ParamMap ) => {
          return this.invoiceService.invoice$( +params.get( 'invoiceId' ) )
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

  protected readonly formatDate = formatDate;
}
