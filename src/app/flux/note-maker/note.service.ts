import { inject, Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment.development";
import { Note } from "./note.model";

@Injectable({
    providedIn: "root" 
})
export class NoteService{
    apiUrl = environment.apiUrl;
    private httpClient = inject(HttpClient);

    notes: Note[] = [];
    selectedNote!: Note;
}