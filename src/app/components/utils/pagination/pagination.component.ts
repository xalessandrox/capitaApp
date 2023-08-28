import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DataState } from "../../../enums/dataState.enum";
import { CustomerService } from "../../../services/customer.service";
import { environment } from "../../../../environments/environment";
import { last } from "rxjs";

@Component( {
	selector : 'app-pagination',
	templateUrl : './pagination.component.html',
	styleUrls : [ './pagination.component.css' ]
} )
export class PaginationComponent implements OnInit {

	@Input() dataSubject: any;
	@Input() currentPage$: any;
	@Input() currentPageSubject: any;
	@Input() lastName: any;
	@Input() totalPages: number;
	@Output() pageRequest = new EventEmitter();

	readonly DataState = DataState;
	startIndex: number = 0;
	endIndex: number;
	range: number [] = [];
	totalElements: number;
	protected readonly environment = environment;

	constructor( private customerService: CustomerService ) {

	}

	ngOnInit() {
		this.endIndex = this.totalPages < environment.navPaginationRange ? this.totalPages : this.startIndex + environment.navPaginationRange;
		this.range = this.arrayRange( this.startIndex, this.endIndex );
	}

	goToPage( lastName?: string, pageNumber?: number ) {
		if (pageNumber > this.totalPages) pageNumber = this.totalPages - 1;
		else if (pageNumber < 1) pageNumber = 0;
		this.pageRequest.emit( { lastName, pageNumber } );
		this.setPagination( pageNumber, this.totalPages );
	}

	arrayRange = ( start: number, stop: number ): number[] => {
		return Array.from(
			{ length : stop - start },
			( value, index ) => start + index
		);
	}

	setPagination( pageNumber: number, totalPages: number ) {
		if (pageNumber < environment.navPaginationRange) {
			this.startIndex = 0;
		} else {
			this.startIndex = pageNumber - ( pageNumber % environment.navPaginationRange );
		}

		this.endIndex = this.startIndex + environment.navPaginationRange;
		if (this.endIndex > totalPages) {
			this.endIndex = totalPages;
		}
		this.range = this.arrayRange( this.startIndex, this.endIndex );
		console.log( "PAGE NUMBER *** ", pageNumber, " ...and... TOTAL PAGES", totalPages );
	}

	goToNextOrPreviousPage( direction?: string, lastName?: string ): void {
		this.goToPage( lastName, direction === 'forward' ? this.currentPageSubject + 1 : this.currentPageSubject - 1 );
	}

}
