import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { ContactService } from 'app/theme/home/contact/contact.service';
@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css'],
  providers: [ ContactService]
})
export class ContactComponent implements OnInit {
  @ViewChild('f') form;
  errorClass    = 'error-hide';
  successClass  = 'success-hide';
  errorMsg      = 'Something went wrong';
  successMsg    = '';
  constructor(private router:Router,private contactService : ContactService) { }

  ngOnInit() {
  }

  onSubmit(event,mailInfo:NgForm){
    event.preventDefault();
    this.errorClass   = 'error-hide';
    this.successClass = 'error-hide';
    if(mailInfo.valid){
      this.contactService.requestCorporatePlan(mailInfo)
      .subscribe(
        (response) => this.procesSuccessData(response,mailInfo),
        (error) => this.procesErrorData(error)
      );
    }
      
  }
  resetForm(){
     this.successClass = 'success-hide';
     this.errorClass = 'error-hide';
     this.successMsg   = "";
     this.errorMsg     = "";
     this.form.resetForm();
  }
  procesSuccessData(response,mailInfo){
    response = JSON.parse(response['_body']); 
     console.log(response);
     var body = response.body;
     console.log(body);
    if(response.success == '1'){ 
       this.successClass = 'success-show';
       this.successMsg   = body.message;
       mailInfo.resetForm();
    }
  }

  procesErrorData(response){
    response = JSON.parse(response['_body']);  
    //alert(response.message);
    this.errorClass = 'error-show';
    this.errorMsg   = response.message.replace(/<\/?[^>]+(>|$)/g, "");
  }
}
