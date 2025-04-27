// Applications.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ApplicationsService {
  private apiUrl = `${environment.apiUrl}flux/applications/`;

  constructor(private http: HttpClient) { }

getApplications(paramsObj?: { [key: string]: any }): Observable<any[]> {
        let params = new HttpParams();

        if (paramsObj) {
            Object.keys(paramsObj).forEach(key => {
                params = params.set(key, paramsObj[key]);
            });
        }
        return this.http.get<any[]>(this.apiUrl, { params });
    }
  getApplication(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}${id}/`);
  }

  createApplication(Application: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, Application);
  }

  updateApplication(id: number, Application: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}${id}/`, Application);
  }

  deleteApplication(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}${id}/`);
  }
}