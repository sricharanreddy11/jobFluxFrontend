// Applications.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';

export interface ApplicationStatus {
  id: number;
  name: string;
  color: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApplicationsService {
  private apiUrl = `${environment.apiUrl}flux/applications/`;
  private statusUrl = `${environment.apiUrl}flux/application-status/`;
  private companiesUrl = `${environment.apiUrl}flux/companies/`;

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
    const data = {
      ...Application,
    };
    return this.http.post<any>(this.apiUrl, data);
  }

  updateApplication(id: number, Application: any): Observable<any> {
    const data = {
      ...Application,
    };
    return this.http.put<any>(`${this.apiUrl}${id}/`, data);
  }

  deleteApplication(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}${id}/`);
  }

  // Status Management Methods
  getStatuses(): Observable<ApplicationStatus[]> {
    return this.http.get<ApplicationStatus[]>(this.statusUrl);
  }

  createStatus(status: { name: string; color: string }): Observable<ApplicationStatus> {
    return this.http.post<ApplicationStatus>(this.statusUrl, status);
  }

  updateStatus(id: number, status: { name: string; color: string }): Observable<ApplicationStatus> {
    return this.http.put<ApplicationStatus>(`${this.statusUrl}${id}/`, status);
  }

  deleteStatus(id: number): Observable<any> {
    return this.http.delete<any>(`${this.statusUrl}${id}/`);
  }

  getCompanies(): Observable<any[]> {
    return this.http.get<any[]>(this.companiesUrl);
  }
}