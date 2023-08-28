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
import { jsPDF, Context2d, AcroFormTextField } from 'jspdf';
import html2canvas from 'html2canvas';

@Component( {
	selector : 'app-invoice',
	templateUrl : './invoice.component.html',
	styleUrls : [ './invoice.component.css' ]
} )
export class InvoiceComponent implements OnInit {

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

	exportAsPdf(): void {

		// html2canvas( invoiceEl ).then( canvas => {
		// 	let imageWidth = 550;
		// 	let pageHeight = 300;
		// 	let imageHeight = canvas.height * imageWidth / canvas.width;
		// 	let heightLeft = imageHeight;
		//
		// 	const contentDataURL = canvas.toDataURL( 'image/png' );
		// 	let pdfFile = new jsPDF( 'p', 'pt', 'a4' );
		// 	let xPosition = 25;
		// 	let yPosition = 30;
		//
		// 	pdfFile.addImage( contentDataURL, 'TIFF', xPosition, yPosition, imageWidth, imageHeight, "", "NONE" )
		//
		// } )
		//

		const pdfFileName = `invoice-${ this.dataSubject.value.data['invoice'].invoiceNumber }.pdf`;
		let invoiceEl = document.getElementById( 'invoice' );
		let pdf = new jsPDF( 'p', 'mm', 'a4' );
		pdf.html( invoiceEl, {
			windowWidth : 1000,
			width : 200,
			margin : 5,
			html2canvas : {
				ignoreElements : ( element ) => {
					return element.localName === 'i';
				},
				letterRendering: true,
				windowWidth: 20
			},

		} ).then(() => {
			pdf.internal.pages = [];
		pdf.save( pdfFileName )
		});



	}

	sendAsEmail() {
		const pdfFileName = `invoice-${ this.dataSubject.value.data['invoice'].invoiceNumber }.pdf`;
	}


}

