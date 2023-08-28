import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, of, startWith } from 'rxjs';
import { CustomHttpResponse, Page } from "../../interfaces/appStates";
import { User } from "../../interfaces/user";
import { CustomerService } from "../../services/customer.service";
import { DataState } from "../../enums/dataState.enum";
import { AppState } from "../../interfaces/appState";
import { Customer } from "../../interfaces/customer";
import { Router } from "@angular/router";
import { HttpEvent, HttpEventType } from "@angular/common/http";
import { saveAs } from "file-saver";
import { environment } from "../../../environments/environment";

@Component( {
	selector : 'app-home',
	templateUrl : './home.component.html',
	styleUrls : [ './home.component.css' ]
} )
export class HomeComponent implements OnInit {

	homeState$: Observable<AppState<CustomHttpResponse<Page<Customer> & User>>>;
	readonly DataState = DataState;

	dataSubject = new BehaviorSubject<CustomHttpResponse<Page<Customer> & User>>( null );
	currentPageSubject = new BehaviorSubject<number>( 0 );
	currentPage$ = this.currentPageSubject.asObservable();
	private isLoadingSubject = new BehaviorSubject<boolean>( false );
	isLoading$ = this.isLoadingSubject.asObservable();
	private showLogsSubject = new BehaviorSubject<boolean>( false );
	showLogs$ = this.showLogsSubject.asObservable();
	private fileStatusSubject = new BehaviorSubject<{ status: string, type: string, percent: number }>( undefined );
	fileStatus$ = this.fileStatusSubject.asObservable();


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
			startWith( { dataState : DataState.Loaded } ),
			catchError( ( error: string ) => {
				return of( {
					dataState : DataState.Error,
					error
				} )
			} )
		)
	}

	selectCustomer( customer: Customer ): void {
		this.router.navigate( [ `/customers/${ customer.id }` ] );
	}

	report(): void {
		this.homeState$ = this.customerService.downloadReport$()
		.pipe(
			map( response => {
				this.reportProgress( response );
				return { dataState : DataState.Loaded, appData : this.dataSubject.value };
			} ),
			startWith( { dataState : DataState.Loaded, appData : this.dataSubject.value } ),
			catchError( ( error: string ) => {
				return of( { dataState : DataState.Loaded, error, appData : this.dataSubject.value } )
			} )
		)
	}

	goToPage( args: {lastName?: string, pageNumber?: number} ): void {
		this.homeState$ = this.customerService.customers$( args.pageNumber )
		.pipe(
			map( response => {
				this.dataSubject.next( response );
				this.currentPageSubject.next(  args.pageNumber );

				return { dataState : DataState.Loaded, appData : response };
			} ),
			startWith( { dataState : DataState.Loading, appData : this.dataSubject.value } ),
			catchError( ( error: string ) => {
				return of( { dataState : DataState.Loaded, error, appData : this.dataSubject.value } )
			} )
		)
	}

	reportProgress( httpEvent: HttpEvent<string[] | Blob> ): void {

		switch (httpEvent.type) {
			case HttpEventType.DownloadProgress || HttpEventType.UploadProgress:
				this.fileStatusSubject.next( {
					status : 'progress',
					type : 'Downloading...',
					percent : Math.round( 100 * ( httpEvent.loaded / httpEvent.total ) )
				} );
				console.log( "File Status ::: ", this.fileStatusSubject.value );
				break;
			case HttpEventType.ResponseHeader:
				console.log( 'Got response headers' );
				break;
			case HttpEventType.Response:
				this.fileStatusSubject.next( undefined );
				saveAs( new File( [ <Blob>httpEvent.body ], httpEvent.headers.get( "File-Name" ), {
					type : `${ httpEvent.headers.get( 'Content-Type' ) };charset=utf-8`
				} ) );
				break;
			default:
				console.log( "Request sent ", httpEvent );
				break;
		}

	}

	protected readonly environment = environment;
}
