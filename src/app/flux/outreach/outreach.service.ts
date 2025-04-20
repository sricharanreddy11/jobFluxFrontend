// mailbox.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class OutreachService {
  private apiUrl = environment.apiUrl;
  public mailBoxData = {};
  
  constructor(private http: HttpClient) {}
  
  getMailToken(paramsObj?: { [key: string]: any }): Observable<any> {
    let params = new HttpParams();

    if (paramsObj) {
        Object.keys(paramsObj).forEach(key => {
            params = params.set(key, paramsObj[key]);
        });
    }
    return this.http.get<any>(`${this.apiUrl}notification/token/`, { params });
  }

  disconnectMailToken(data: any, paramsObj?: { [key: string]: any }): Observable<any> {
    let params = new HttpParams();

    if (paramsObj) {
        Object.keys(paramsObj).forEach(key => {
            params = params.set(key, paramsObj[key]);
        });
    }
    return this.http.patch<any>(`${this.apiUrl}notification/token/disconnect/`,data, { params });
  }
  
  getAuthorizeUrl(paramsObj?: { [key: string]: any }): Observable<any> {
    let params = new HttpParams();

    if (paramsObj) {
        Object.keys(paramsObj).forEach(key => {
            params = params.set(key, paramsObj[key]);
        });
    }
    console.log("params", params);
    return this.http.get<any>(`${this.apiUrl}notification/mail/authorize/`, {params});
  }
  
postAuthorizeMail(mailData: any, paramsObj?: { [key: string]: any }): Observable<any> {
    let params = new HttpParams();

    if (paramsObj) {
            Object.keys(paramsObj).forEach(key => {
                    params = params.set(key, paramsObj[key]);
            });
    }
    return this.http.post(`${this.apiUrl}notification/mail/authorize/`, mailData, { params });
}

    getMailThreads(paramsObj?: { [key: string]: any }): Observable<any[]> {
        let params = new HttpParams();
        if (paramsObj) {
            Object.keys(paramsObj).forEach(key => {
                params = params.set(key, paramsObj[key]);
            });
        }
        return this.http.get<any[]>(`${this.apiUrl}notification/mail-thread/`, { params });
    }
  
    getMails(paramsObj?: { [key: string]: any }): Observable<any[]> {
        let params = new HttpParams();
        if (paramsObj) {
            Object.keys(paramsObj).forEach(key => {
                params = params.set(key, paramsObj[key]);
            });
        }
        return this.http.get<any[]>(`${this.apiUrl}notification/mail-thread/detail/`, {params});
    }

}