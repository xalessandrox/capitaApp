import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';
import { HttpCacheService } from "../services/http.cache.service";
import { environment } from "../../environments/environment";

@Injectable()
export class CacheInterceptor implements HttpInterceptor {

	constructor( private httpCacheService: HttpCacheService ) {
	}

	intercept( request: HttpRequest<unknown>, next: HttpHandler ): Observable<HttpEvent<any>> | Observable<HttpResponse<unknown>> | any {

		for (let i = 0; i < environment.PUBLIC_URLS.length; i++) {
			if (request.url.includes( environment.PUBLIC_URLS[i] )) {
				return next.handle( request );
			}
		}

		if (request.url.includes( 'downloads' ) || request.method !== 'GET') {
			this.httpCacheService.evictAll();
			return next.handle( request );
		}

		const cachedResponse: HttpResponse<any> = this.httpCacheService.get( request.url );
		if (cachedResponse) {
			this.httpCacheService.logCache();
			return of( cachedResponse );
		}

		return this.handleRequestCache( request, next );
	}


	private handleRequestCache( request: HttpRequest<any>, next: HttpHandler ): Observable<HttpEvent<any>> {
		return next.handle( request ).pipe(
			tap( response => {
				if (response instanceof HttpResponse && request.method !== 'DELETE') {
					this.httpCacheService.put( request.url, response );
				}
			} )
		);
	}
}
