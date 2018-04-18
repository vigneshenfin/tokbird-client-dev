import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { User } from "app/shared/user";

@Injectable()
export class SessionCheck implements CanActivate {
    public userDetails:any;
    constructor(private router: Router,private user:User) { }
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
        //console.log('res'+this.userDetails)
        if (this.userDetails && this.user.isLoggenIn() && (browserSessionEnabled || rememberMe)) {

            if(this.userDetails.us_role_id == "1"){

                this.router.navigate(['/admin/events-calendar']); 

            }else if(this.userDetails.us_role_id == "2"){
                
                this.router.navigate(['facilitator/events-calendar']);

            }else if(this.userDetails.us_role_id == "3"){

                this.router.navigate(['/meetings-list']);
                
            }
            return false;
        }else{
          
           return true;

        }
        // not logged in so redirect to login page     
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
                if (end == -1) end  = document.cookie.length;
                returnvalue         =document.cookie.substring(offset, end)
            }
        }
        return returnvalue;
    }
}