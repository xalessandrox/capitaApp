import { Injectable } from '@angular/core';
import { HttpResponse } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable( {
	providedIn : 'root'
} )
export class HttpCacheService {

	private httpResponseCache: { [key: string]: HttpResponse<any> };

	constructor() {
		this.httpResponseCache = {};
	}

	put = ( key: string, httpResponse: HttpResponse<any> ): void => {
		if (this.httpResponseCache)
			this.httpResponseCache[key] = httpResponse;
	};

	get = ( key: string ): HttpResponse<any> | null | undefined => {
		if (this.httpResponseCache)
			return this.httpResponseCache[key];
		else
			return null;
	};

	evict = ( key: string ): boolean => {
		return this.httpResponseCache[key] = null;
	}

	evictAll = (): void => this.httpResponseCache = null;

	logCache = () => console.log( this.httpResponseCache );

}
