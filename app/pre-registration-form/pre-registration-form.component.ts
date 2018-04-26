import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { PreRegistrationTemplatesService } from 'app/settings/pre-registration-templates/pre-registration-templates.service';
import { User } from 'app/shared/user';
import { NgForm } from '@angular/forms';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { ViewContainerRef } from '@angular/core';
declare var $:any;

@Component({
  selector: 'app-pre-registration-form',
  templateUrl: './pre-registration-form.component.html',
  styleUrls: ['./pre-registration-form.component.css'],
  providers: [PreRegistrationTemplatesService]
})
export class PreRegistrationFormComponent implements OnInit {

  public userDetails;
  public templates;
  public selectedTemplate = '';
  public fieldTypes:any = ["", "Text", "Radio", "Checkbox"];
  public fieldsArray:any = [];
  public meetingId = '';
  public noTemplate = 0;
  public isEditable = 1;
  public newFieldNameError = 0;
  public newFieldTypeError = 0;
  public newFieldValuesError = 0;
  public fieldType;
  public fieldValues = '';
  public fieldName;
  public rowToEdit;
  public editType;
  public editName;
  public editValues;
  public editNameError = 0;
  public editTypeError = 0;
  public editValuesError = 0;
  public templateId;
  public templateTitle = '';
  public rowToDelete = '';
  constructor(private router:Router, private activatedRoute:ActivatedRoute, private user:User, private preRegistrationTemplatesService: PreRegistrationTemplatesService, public toastr: ToastsManager, vcr: ViewContainerRef) {
    this.userDetails = user.getUser();
    this.toastr.setRootViewContainerRef(vcr);
  }

  ngOnInit() {
    // this.getTemplate();
    this.activatedRoute.params.subscribe((params: Params) => {
      this.meetingId   = params['meetingId'];
    });
    this.getTemplates();
  }

  showSuccess(msg) {
    this.toastr.success(msg, 'Success!');
  }
  showError(msg) {
    this.toastr.error(msg, 'Failure!');
  }

  getTemplates() {
    let params:any = {};
    params.token = this.userDetails.token;
    params.meeting_id = this.meetingId;
    this.preRegistrationTemplatesService.getRegistrationTemplatesMeeting(params).subscribe(
      (response:any) => {
        response = JSON.parse(response['_body']);
        if(response.success == 1){
          this.templates = response.body.templates;
          let regTemplates = response.body.templates;
          // console.log(response.body);
          for(let i=0; i<regTemplates.length; i++){
            if(response.body.pre_reg_template_id != ''){
              if(regTemplates[i].id == response.body.pre_reg_template_id){
                this.selectedTemplate = regTemplates[i].title;
                this.getTemplate(regTemplates[i].id, regTemplates[i].title, '1');
              }
            }else{
              if(regTemplates[i].is_default == 1){
                this.selectedTemplate = regTemplates[i].title;
                this.getTemplate(regTemplates[i].id, regTemplates[i].title, '1');
              }
            }
          }
        }
      },
      (error) => {
        // console.log(error)
        error = JSON.parse(error['_body']);
        if(error.message == 'Login failed'){
          this.user.logOut();
          this.router.navigateByUrl('/');
        }
      }
    )
  }

  getTemplate(tempId = '', tempName = '', isDefaultTemplate ='') {
    this.templateId = '';
    this.fieldsArray = [];
    let isDefault = 0;
    this.selectedTemplate = tempName;
    let params:any = {};
    this.templateTitle   = tempName;
    params.token = this.userDetails.token;
    params.template_id = tempId;
    this.preRegistrationTemplatesService.getRegistrationTemplate(params).subscribe(
      (response:any) => {
        response = JSON.parse(response['_body']);
        if(response.success == 1){
          console.log(response);
          if((response.body.meeting_id == this.meetingId) && (response.body.is_default == 1)){
            this.noTemplate = 1;
          }else{
            this.noTemplate = 0;
          }
          this.templateId = tempId;
          let templateDetails = response.body.template_details;
          for(let i=0; i<templateDetails.length; i++){
            let obj:any = {};
            obj.fieldName = templateDetails[i].field_name;
            obj.fieldType = templateDetails[i].field_type;
            obj.fieldValues = templateDetails[i].field_values;
            obj.isRequired = templateDetails[i].is_required;
            obj.isEditable = templateDetails[i].is_editable;
            this.fieldsArray.push(obj);
          }
          if(isDefaultTemplate != '1'){
            // Save meeting pre registration template
            let params:any = {};
            params.token = this.userDetails.token;
            params.meeting_id = this.meetingId;
            params.template_id = tempId;
            this.saveMeetingTemplate(params);
          }
          
        }
      },
      (error) => console.log(error)
    )
  }

  addField(fieldDetails:NgForm) {
    if(fieldDetails.valid){
      this.validateNewFieldName(fieldDetails.value.fieldName);
      this.validateNewFieldValues(fieldDetails.value.fieldValues);
      if(this.newFieldNameError == 0 && this.newFieldTypeError == 0 && this.newFieldValuesError == 0){
        let obj:any = {};
        obj.fieldType = fieldDetails.value.fieldType;
        obj.fieldName = fieldDetails.value.fieldName;
        obj.fieldValues = fieldDetails.value.fieldValues;
        if(fieldDetails.value.isRequired == true){
          obj.isRequired = 1;
        }else{
          obj.isRequired = 0;
        }
        obj.isEditable = this.isEditable;
        this.fieldsArray.push(obj);
        fieldDetails.resetForm();
        this.saveTemplate();
      }
    }
  }

  validateNewFieldName(name) {
    let newFieldNameErrorCount = 0;
    if(name!=''){
      var letters = /^[0-9a-zA-Z ]+$/;
      if (letters.test(name)){
        // Check for names
        for(var i=0; i<this.fieldsArray.length; i++){
          let fname = (this.fieldsArray[i].fieldName).replace(/\s/g, '');
          let newName = name.replace(/\s/g, '');
          if(newName == fname){
            // this.newFieldNameError = 1;
            newFieldNameErrorCount++;
          }else{
            // this.newFieldNameError = 0;
          }
        }
      }else{
        // this.newFieldNameError = 1;
        newFieldNameErrorCount++;
      }
    }else{
      // this.newFieldNameError = 1;
      newFieldNameErrorCount++;
    }
    if(newFieldNameErrorCount > 0) {
      this.newFieldNameError = 1;
    }else{
      this.newFieldNameError = 0;
    }
  }

  validateNewFieldValues(values){
    // console.log(this.fieldType);
    let letters = /^[0-9a-zA-Z ]+$/;
    if(this.fieldType != '1'){
      let str = values;
      let str_array = str.split(',');
      // Changed - 04/04/2018
      // if(str_array.length < 2 || str_array.length > 5){
      if(str_array.length < 2 || str_array.length > 35){
        // console.log('in value A');
        this.newFieldValuesError = 1;
      }else{
        let newValuesError = 0;
        for(var i = 0; i < str_array.length; i++) {
           // Trim the excess whitespace.
           str_array[i] = str_array[i].replace(/^\s*/, "").replace(/\s*$/, "");
           // Add additional code here, such as:
           if(str_array[i] == '' || (!letters.test(str_array[i]))){
             newValuesError ++;
           }
        }
        if(newValuesError > 0){
          this.newFieldValuesError = 1;
        }else{
          this.newFieldValuesError = 0;
        }
      }
    }else{
      this.newFieldValuesError = 0;
    }
  }

  

  editRow(rowId) {
    this.rowToEdit = rowId;
    this.editType = this.fieldsArray[rowId].fieldType;
    this.editName = this.fieldsArray[rowId].fieldName;
    this.editValues = this.fieldsArray[rowId].fieldValues;
  }

  cancelEdit(rowId) {
    this.rowToEdit = -1;
    this.editType = '';
    this.editName = '';
    this.editValues = '';
    this.editNameError = 0;
    this.editTypeError = 0;
    this.editValuesError = 0;
  }

  saveChanges(rowId) {
    if(this.rowToEdit != ''){
      this.validateFieldName(this.editName);
      this.validateFieldType(this.editType);
      this.validateFieldValues(this.editValues);
      if(this.editNameError == 0 && this.editTypeError == 0 && this.editValuesError == 0){
        this.fieldsArray[rowId].fieldType = this.editType;
        this.fieldsArray[rowId].fieldName = this.editName;
        this.fieldsArray[rowId].fieldValues = this.editValues;
        this.rowToEdit = -1;
        this.editType = '';
        this.editName = '';
        this.editValues = '';
        this.saveTemplate();
      }
    }
  }

  deleteRow(rowId) {
    if(rowId != ''){
      this.fieldsArray.splice(rowId, 1);
      $("#delete-confirmation").modal('hide');
      this.saveTemplate();
    }
  }

  toggleRequired(rowId) {
    if(rowId != ''){
      if(this.fieldsArray[rowId].isRequired == 0){
        this.fieldsArray[rowId].isRequired = 1;
      }else{
        this.fieldsArray[rowId].isRequired = 0;
      }
    }
    this.saveTemplate();
  }

  validateFieldName(name) {
    let fieldNameErrorCount = 0;
    if(name!=''){
      var letters = /^[0-9a-zA-Z ]+$/;
      if (letters.test(name)){
        // Check for names
        for(var i=0; i<this.fieldsArray.length; i++){
          let fname = (this.fieldsArray[i].fieldName).replace(/\s/g, '');
          let newName = name.replace(/\s/g, '');
          if(i != this.rowToEdit){
            if(newName == fname){
              // console.log('in A');
              // this.editNameError = 1;
              fieldNameErrorCount++;
            }else{
              // this.editNameError = 0;
            }
          }
        }
      }else{
        // console.log('in B');
        // this.editNameError = 1;
        fieldNameErrorCount++;
      }
    }else{
      // console.log('in C');
      // this.editNameError = 1;
      fieldNameErrorCount++;
    }
    if(fieldNameErrorCount > 0){
      this.editNameError = 1;
    }else{
      this.editNameError = 0;
    }
  }

  validateFieldType(type) {
    if(type != ''){
    }else{
      this.editTypeError = 1;
    }
  }



  validateFieldValues(values) {
    // console.log(this.editType);
    let letters = /^[0-9a-zA-Z ]+$/;
    if(this.editType != '1'){
      let str = values;
      let str_array = str.split(',');
      // Changed - 04/04/2018
      // if(str_array.length < 2 || str_array.length > 5){
      if(str_array.length < 2 || str_array.length > 35){
        // console.log('in field value A');
        this.editValuesError = 1;
      }else{
        let valuesError = 0;
        for(var i = 0; i < str_array.length; i++) {
           // Trim the excess whitespace.
           str_array[i] = str_array[i].replace(/^\s*/, "").replace(/\s*$/, "");
           // Add additional code here, such as:
           if(str_array[i] == '' || (!letters.test(str_array[i]))){
             valuesError ++;
           }
        }
        if(valuesError > 0){
          this.editValuesError = 1;
        }else{
          this.editValuesError = 0;
        }
      }
    }else{
      this.editValuesError = 0;
    }
  }


  saveTemplate() {
    if(this.noTemplate == 1){
      let params:any = {};
      params.token = this.userDetails.token;
      params.template_id = this.templateId;
      params.title = this.templateTitle;
      let fields:any = [];
      for(let i=0; i<this.fieldsArray.length; i++){
        let obj:any = {};
        let field = this.fieldsArray[i];
        obj.field_type = field.fieldType;
        obj.field_name = field.fieldName;
        obj.field_values = field.fieldValues;
        obj.is_required = field.isRequired;
        obj.is_editable = field.isEditable;
        fields.push(obj);
      }
      params.fields = fields;
      this.preRegistrationTemplatesService.saveRegistrationTemplate(params).subscribe(
        (response:any) => {
          response = JSON.parse(response['_body']);
          if(response.success == 1){
          }
        },
        (error) => console.log(error)
      )
    }else{
    }
  }

  saveMeetingTemplate(params)
  {
    this.preRegistrationTemplatesService.saveMeetingTemplate(params).subscribe(
      (response:any) => {
        response = JSON.parse(response['_body']);
        if(response.success == 1){
          this.showSuccess('Meeting pre registration template saved');
          this.rowToEdit = -1;
        }
      },
      (error) => console.log(error)
    )
  }

  confirmDeleteRow(rowId) {
    if(rowId != ''){
      this.rowToDelete = rowId;
      $("#delete-confirmation").modal({'show':true});
    }
  }

}
