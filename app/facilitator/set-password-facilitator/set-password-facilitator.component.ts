import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { NgForm } from '@angular/forms';
import { SetPasswordFacilitatorService } from 'app/facilitator/set-password-facilitator/set-password-facilitator.service';
@Component({
  selector: 'app-set-password-facilitator',
  templateUrl: './set-password-facilitator.component.html',
  styleUrls: ['./set-password-facilitator.component.css'],
  providers: [ SetPasswordFacilitatorService]
})
export class SetPasswordFacilitatorComponent implements OnInit {
  errorClass    = 'error-hide';
  successClass  = 'success-hide';
  errorMsg      = '';
  successMsg    = "";
  successShow   = false;
  token_value   = '';
  email         = '';
  constructor(private router:Router,private setPasswordFacilitatorService : SetPasswordFacilitatorService,private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params: Params) => {
         this.token_value = params['id'];
         this.email       = params['email'];
        console.log(this.token_value+this.email);
      });
  }
  onSubmit(event,resetInfo:NgForm){ console.log(this.token_value)
    event.preventDefault();
    this.errorClass = 'error-hide';
    if(resetInfo.valid){
      var resetData = resetInfo.value;
      if(resetData.npassword == resetData.cpassword){
          this.setPasswordFacilitatorService.resetPassword(resetInfo,this.token_value)
          .subscribe(
            (response) => this.processSuccess(response),
            (error) => this.processErrorData(error)
          );
      }else{
        this.errorClass = 'error-show';
        this.errorMsg   = 'New Password field and Confirm Password field must be same';
      }
      
    }
      
  }

  processSuccess(response){
    response = JSON.parse(response['_body']);
    if(response.success == '1'){ 
        this.successClass = 'success-show';
        this.successMsg   = "Password set succesfully";
        this.successShow = true;
        setTimeout((router: Router) => {
            this.router.navigateByUrl('/');
        }, 2000);  //2s
        
    }else{
      
    }
  }

  processErrorData(response){
    response = JSON.parse(response['_body']); 
    this.errorClass = 'error-show';
    this.errorMsg   = response.message;
  }
}

