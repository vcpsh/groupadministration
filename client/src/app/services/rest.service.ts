import { BehaviorSubject ,  Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpParams as HP} from '@angular/common/http';
import { map } from 'rxjs/operators';

/**
 * Extends the angular http params to allow booleans and numbers in the key value pairs.
 *
 * @interface HPO
 */
interface HPO {
  [key: string]: string | boolean | number;
}
type HttpParams = HP | HPO;

/**
 * Interface for errors by the rest client.
 */
export interface RestError {
  Code: 400;
  Message: string;
}

/**
 * Basic rest service to access the server with some rest functions.
 * All calls are made on the /api subpath.
 *
 * @export
 * @class RestService
 */
@Injectable()
export class RestService {
  private _parent: RestService | null = null;
  private _baseurl = new BehaviorSubject('');
  private _http: HttpClient | null = null;

  public get BaseUrl(): string {
    if (this._parent) {
      return this._baseurl.value === ''
        ? this._parent.BaseUrl
        : `${this._parent.BaseUrl}/${this._baseurl.value}`;
    } else {
      return '/api';
    }
  }
  /**
   * Creates an instance of RestService.
   * @param {HttpClient} [http] HttpClient to use
   * @memberof RestService
   */
  constructor(http: HttpClient) {
    if (http) {
      this._http = http;
    }
  }

  /**
   * Returns a new instance of the RestService on the specified subpath relative to the path of this instance.
   *
   * @param {string} url subpath
   * @returns {RestService} new Instance
   * @memberof RestService
   */
  public all(url: string): RestService {
    const s = new RestService(null as any);
    s._parent = this;
    s._baseurl.next(url);
    return s;
  }

  public list<TResponse>(params: {
    url?: string | string[];
    queryParams?: HttpParams;
  }): Promise<TResponse[]> {
    return this.get<TResponse[]>(params).then(v => (v == null ? [] : v));
  }

  public get<TResponse>(params: {
    url?: string | string[];
    queryParams?: HttpParams;
  }): Promise<TResponse | null> {
    params.url = this.flattenUrl(params.url);
    if (this._parent) {
      params.url = params.url ? `${this.BaseUrl}/${params.url}` : this.BaseUrl;
      return this._parent.get<TResponse>(params);
    }
    return this.internalGet(params.url ? params.url : this.BaseUrl, {
      queryParams: params.queryParams
    });
  }

  public post<TResponse>(params: {
    url?: string | string[];
    content: any;
  }): Promise<TResponse> {
    params.url = this.flattenUrl(params.url);
    if (this._parent) {
      params.url = params.url ? `${this.BaseUrl}/${params.url}` : this.BaseUrl;
      return this._parent.post<TResponse>(params);
    }
    return this.internalPost(
      params.url ? params.url : this.BaseUrl,
      params.content,
      params
    );
  }

  private internalGet<TResponse>(
    url: string,
    params?: { queryParams?: HttpParams }
  ): Promise<TResponse | null> {
    // TODO: Handle errors
    if (!this._http) {
      throw new Error('RestService \'_http\' not set.');
    }

    if (Array.isArray(url)) {
      url = url.reduce((a, b) => `${a}/${b}`, '');
    }

    if (params) {
      const newParas: { [key: string]: string } = {};
      if (params.queryParams && !(params.queryParams instanceof HP)) {
        Object.keys(params.queryParams).forEach(
          val => (newParas[val] = (params.queryParams as HPO)[val].toString())
        );
      }
      // TODO: ErrorHandling
      return this._http.get<TResponse>(url, {
        params: params.queryParams instanceof HP ? params.queryParams : newParas
      }).toPromise();
    } else {
      return this._http.get<TResponse>(url).toPromise();
    }
  }

  private internalPost<TResponse>(
    url: string,
    content: any,
    params?: {}
  ): Promise<TResponse> {
    if (params) {
      // TODO: implement
    } else {
    }
    Object.keys(content).forEach(key => {
      if (content[key] instanceof Date) {
        content[key] = content[key].toISOString();
      }
    });

    return new Promise((resolve, reject) => {
      if (!this._http) {
        throw new Error('RestService \'_http\' not set.');
      }
      if (Array.isArray(url)) {
        url = url.reduce((a, b) => `${a}/${b}`, '');
      }
      this._http.post(url, content)
        .subscribe(
          (data: any) => resolve(data as TResponse),
          (error: HttpErrorResponse) => reject(this.handleError(error)));
    });
  }

  private handleError(error: HttpErrorResponse): RestError | void {
    switch (error.status) {
      case 400:
        return {
          Code: 400,
          Message: error.error
        };
      default:
        console.error('Rest error', error);
    }
  }

  private flattenUrl(url?: string | string[]): string | undefined {
    if (Array.isArray(url)) {
      return url.reduce((a, b) => a === '' ? b : `${a}/${b}`, '');
    }
    return url;
  }
}
