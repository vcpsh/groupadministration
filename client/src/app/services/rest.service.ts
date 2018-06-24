import { BehaviorSubject ,  Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams as HP } from '@angular/common/http';
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
    url?: string;
    queryParams?: HttpParams;
  }): Promise<TResponse[]> {
    return this.get<TResponse[]>(params).then(v => (v == null ? [] : v));
  }

  public get<TResponse>(params: {
    url?: string;
    queryParams?: HttpParams;
  }): Promise<TResponse | null> {
    if (this._parent) {
      params.url = params.url ? `${this.BaseUrl}/${params.url}` : this.BaseUrl;
      return this._parent.get<TResponse>(params);
    }
    return this.internalGet(params.url ? params.url : this.BaseUrl, {
      queryParams: params.queryParams
    });
  }

  public post<TResponse>(params: {
    url?: string;
    content: any;
  }): Promise<TResponse> {
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
    if (!this._http) {
      throw new Error('RestService \'_http\' not set.');
    }
    if (params) {
      // TODO: implement
    } else {
    }
    Object.keys(content).forEach(key => {
      if (content[key] instanceof Date) {
        content[key] = content[key].toISOString();
        console.log('date', content[key]);
      }
    });
    return this._http.post(url, content).pipe(map(res => res as TResponse)).toPromise();
  }
}
