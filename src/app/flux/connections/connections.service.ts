// connections.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ConnectionsService {
  private apiUrl = `${environment.apiUrl}flux/contacts/`;

  constructor(private http: HttpClient) { }

getConnections(paramsObj?: { [key: string]: any }): Observable<any[]> {
        let params = new HttpParams();

        if (paramsObj) {
            Object.keys(paramsObj).forEach(key => {
                params = params.set(key, paramsObj[key]);
            });
        }
        return this.http.get<any[]>(this.apiUrl, { params });
    }
  getConnection(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}${id}/`);
  }

  createConnection(connection: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, connection);
  }

  updateConnection(id: number, connection: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}${id}/`, connection);
  }

  deleteConnection(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}${id}/`);
  }
}