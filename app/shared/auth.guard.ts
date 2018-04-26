import { Injectable, Inject } from '@angular/core';
import { Router, CanActivate,RouterStateSnapshot,ActivatedRouteSnapshot } from '@angular/router';
import { User } from "app/shared/user";
import { DOCUMENT } from '@angular/platform-browser';
@Injectable()
export class AuthGuard implements CanActivate {
    public userDetails:any;
    constructor(private router: Router,private user:User,@Inject(DOCUMENT) private document: any) { }
    canActivate(route: ActivatedRouteSnapshot,state: RouterStateSnapshot) {
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
        //console.log(this.userDetails) 
        if (this.user.getUser() && (browserSessionEnabled || rememberMe)) {
            if(this.userDetails.us_role_id == "3"){
                return true;
            }
        }
        this.router.navigate(['/'], { queryParams: { returnUrl: state.url }});
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