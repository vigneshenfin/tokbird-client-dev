import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Config } from "app/config/config";
@Injectable()
export class CategoryService {
    constructor( private http: Http ) { }

    getCategories(categoryInfo:any)
    {
        // console.log(categoryInfo);
        let headers     = new Headers({ 'Content-Type': 'application/json' });
        let options     = new RequestOptions({ headers: headers, method: "post" });
        return this.http.post(Config.BASE_API_URL+'categories/get_categories', JSON.stringify(categoryInfo), options);
    }
}