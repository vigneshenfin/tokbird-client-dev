import { Injectable, Inject } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { User } from "app/shared/user";
import { DOCUMENT } from '@angular/platform-browser';
@Injectable()
export class FacilitatorAuthGuard implements CanActivate {
    public userDetails:any;
    constructor(private router: Router,private user:User,@Inject(DOCUMENT) private document: any) { }
    canActivate() {
        let rememberMe = false;
        let browserSessionEnabled = false;
        if (localStorage.getItem('remember')) {
            if (localStorage.getItem('remember') == 'true'){
                 rememberMe = true;
            }
        }
        if (this.get_cookie('enabled')) {
            browserSessionEnabled = true;
        }
        this.userDetails = this.user.getUserWithoutSessionCheck(); 
        if (this.user.getUser() && (browserSessionEnabled || rememberMe)) {
            if(this.userDetails.us_role_id == "2"){
                return true;
            }
        }
        this.router.navigate(['/']);
        return false;
    }
   get_cookie(Name) {
        var search = Name + "="
        var returnvalue = "";
        if (document.cookie.length > 0) {
            let offset = document.cookie.indexOf(search)
            // if cookie exists
            if (offset != -1) { 
                offset += search.length
                // set index of beginning of value
                let end = document.cookie.indexOf(";", offset);
                // set index of end of cookie value
                if (end == -1) end = document.cookie.length;
                returnvalue=document.cookie.substring(offset, end)
            }
        }
        return returnvalue;
    }
    
}