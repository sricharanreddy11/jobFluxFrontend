import { inject, Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { environment } from "../../../environments/environment.development";
import { Company } from "./organisations.models";

@Injectable({
    providedIn: "root" 
})
export class OrganisationsService{
    apiUrl = environment.apiUrl;
    private httpClient = inject(HttpClient);

    organisations: Company[] = [];
    selectedOrganisation: any;
    search = '';
}