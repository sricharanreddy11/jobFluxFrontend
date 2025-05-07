import { inject, Injectable } from "@angular/core";
import { environment } from "../../environments/environment.development";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { Note } from "./note-maker/note.model";

@Injectable({
    providedIn: "root" 
})
export class FLuxAPIService{
    apiUrl = environment.apiUrl;
    private httpClient = inject(HttpClient);

    getCurrentUser(): Observable<any>{
        return this.httpClient.get(this.apiUrl + 'auth/users/current-user/');
    }

    executeCommand(paramsObj?: { [key: string]: any }): Observable<any>{
        let params = new HttpParams();

        if (paramsObj) {
            Object.keys(paramsObj).forEach(key => {
                params = params.set(key, paramsObj[key]);
            });
        }
        return this.httpClient.get(this.apiUrl + 'analytics/command-search', { params });
    }

    getChatbotResponse(paramsObj?: { [key: string]: any }): Observable<any>{
        let params = new HttpParams();

        if (paramsObj) {
            Object.keys(paramsObj).forEach(key => {
                params = params.set(key, paramsObj[key]);
            });
        }
        return this.httpClient.get(this.apiUrl + 'analytics/chatbot', { params });
    }

    getTaskAlerts(): Observable<any>{
        return this.httpClient.get(this.apiUrl + 'track/tasks/alerts/');
    }

    getOrganisations(paramsObj?: { [key: string]: any }): Observable<any> {
        let params = new HttpParams();

        if (paramsObj) {
            Object.keys(paramsObj).forEach(key => {
                params = params.set(key, paramsObj[key]);
            });
        }
        return this.httpClient.get(this.apiUrl + 'flux/companies/', { params });
    }
    
    getOrganisationDetail(id: string): Observable<any>{
        return this.httpClient.get(this.apiUrl + 'flux/companies/' + id + '/');
    }

    createOrganisation(formData: any): Observable<any> {
        return this.httpClient.post(this.apiUrl + 'flux/companies/', formData);
    }

    updateOrganisation(formData: any, organisation_id: string) {
        return this.httpClient.put(this.apiUrl + 'flux/companies/' + organisation_id + '/',formData);
    }

    deleteOrganisation(organisation_id: string) {
        return this.httpClient.delete(this.apiUrl + 'flux/companies/' + organisation_id + '/');
    }

    getAllNotes(paramsObj?: { [key: string]: any }): Observable<Note[]> {
        let params = new HttpParams();

        if (paramsObj) {
            Object.keys(paramsObj).forEach(key => {
                params = params.set(key, paramsObj[key]);
            });
        }
        return this.httpClient.get<Note[]>(this.apiUrl + 'flux/notes/', { params });
    }

    createNote(postData: any): Observable<Note>{
        return this.httpClient.post<Note>(this.apiUrl + 'flux/notes/', postData);
    }

    updateNote(resData: any, note_id : string): Observable<any>{
        return this.httpClient.put(this.apiUrl + 'flux/notes/' + note_id + '/', resData);
    }

    deleteNote(note_id : string): Observable<any>{
        return this.httpClient.delete(this.apiUrl + 'flux/notes/' + note_id + '/');
    }
}