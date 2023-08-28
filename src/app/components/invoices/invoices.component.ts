import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, of, startWith } from "rxjs";
import { AppState } from "../../interfaces/appState";
import { CustomHttpResponse, Page } from "../../interfaces/appStates";
import { User } from "../../interfaces/user";
import { Router } from "@angular/router";
import { DataState } from "../../enums/dataState.enum";
import { InvoiceService } from "../../services/invoice.service";
import { Invoice } from "../../interfaces/invoice";
import { environment } from "../../../environments/environment";


@Component( {
	selector : 'app-invoices',
	templateUrl : './invoices.component.html',
	styleUrls : [ './invoices.component.css' ]
} )
export class InvoicesComponent implements OnInit {

	invoicesState$: Observable<AppState<CustomHttpResponse<Page<Invoice> & User>>>;
	readonly DataState = DataState;
	dataSubject = new BehaviorSubject<CustomHttpResponse<Page<Invoice> & User>>( null );
	currentPageSubject = new BehaviorSubject<number>( 0 );
	currentPage$ = this.currentPageSubject.asObservable();
	private isLoadingSubject = new BehaviorSubject<boolean>( false );
	isLoading$ = this.isLoadingSubject.asObservable();
	private showLogsSubject = new BehaviorSubject<boolean>( false );
	showLogs$ = this.showLogsSubject.asObservable();

	constructor( private router: Router, private invoiceService: InvoiceService ) {
	}

	ngOnInit(): void {
		this.invoicesState$ = this.invoiceService.invoices$()
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

	// searchCustomers( customerSearchForm: NgForm ): void {
	//   this.currentPageSubject.next( 0 );
	//   this.invoicesState$ = this.customerService.searchCustomers$( customerSearchForm.value.lastName )
	//   .pipe(
	//     map( response => {
	//       this.dataSubject.next( response );
	//       console.log( response );
	//       return {
	//         dataState : DataState.Loaded,
	//         appData : response
	//       };
	//     } ),
	//     startWith( { dataState : DataState.Loaded, appData : this.dataSubject.value } ),
	//     catchError( ( error: string ) => {
	//       return of( {
	//         dataState : DataState.Error,
	//         error
	//       } )
	//     } )
	//   )
	// }

	goToPage( pageNumber?: number ): void {
		this.invoicesState$ = this.invoiceService.invoices$( pageNumber )
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

	// selectCustomer( customer: Customer ): void {
	//   this.router.navigate( [ `/customers/${ customer.id }` ] );
	// }


	protected readonly environment = environment;
}
