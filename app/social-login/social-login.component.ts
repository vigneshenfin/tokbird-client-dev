import { Component,OnInit,Injectable,Output } from '@angular/core';
import { AuthService } from "angular2-social-login";
import { Routes,Router,ActivatedRoute} from '@angular/router';
import { SocialLoginService } from 'app/social-login/social-login.service';
import { User } from "app/shared/user";
import { Config } from "app/config/config";
@Component({
  selector: 'app-social-login',
  templateUrl: './social-login.component.html',
  styleUrls: ['./social-login.component.css'],
  providers: [ SocialLoginService]
})
@Injectable()
export class SocialLoginComponent implements OnInit {
  errorClass = 'error-hide';
  errorMsg   = 'Something went wrong';
  ngOnInit() {
    
    this.userObj.onLogoutEvent.subscribe(
      (flag) => this.logout()
    );
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || 'meetings-list';
  }

  public user;
  sub: any;
  returnUrl: string;
  constructor(private route: ActivatedRoute,public _auth: AuthService,private router:Router,private socialLoginService : SocialLoginService,private userObj:User){ }
  
  signIn(provider){ console.log(provider)
    this.sub = this._auth.login(provider).subscribe(
      (data) => {
        //console.log(data);
        this.user = data;
        this.socialLoginService.socialUserLogin(this.user).subscribe(
          (response) => this.processRegisteredData(response),
          (error) => this.procesErrorData(error)
        )
      }
    )
  }

  processRegisteredData(response){
    response = JSON.parse(response['_body']); 
    if(response.success == '1'){ 
        response.body.token = response.token;
        this.userObj.putUser(response.body);
        //this.router.navigateByUrl('home');
        if(response.body.is_first_login == 1){
             window.location.href = Config.APP_URL+'user-profile#subscription';
             //this.router.navigateByUrl('user-profile#subscription')
        }else{
          // console.log('url'+this.returnUrl)
           //this.router.navigateByUrl(this.returnUrl);
           window.location.href = Config.APP_URL+this.returnUrl;
            //this.router.navigateByUrl('meetings-list');
        }
        
    }
  }

  procesErrorData(response){
    response = JSON.parse(response['_body']); 
    this.errorClass = 'error-show';
    this.errorMsg   = response.message.replace(/<\/?[^>]+(>|$)/g, "");
    this.userObj.socialLoginError(this.errorMsg);
  }

  logout(){

    this._auth.logout().subscribe(
      (data)=>{
        //console.log(data);
        this.user=null;
      }
    )
  }

  // ngOnDestroy(){
  //   this.sub.unsubscribe();
  // }
}
