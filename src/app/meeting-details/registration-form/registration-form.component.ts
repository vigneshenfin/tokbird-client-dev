import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Config } from 'app/config/config';
import { PreRegistrationTemplatesService } from 'app/settings/pre-registration-templates/pre-registration-templates.service';
import { User } from 'app/shared/user';
import { NgForm } from '@angular/forms';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { ViewContainerRef } from '@angular/core';
import { MeetingDetailsService } from 'app/meeting-details/meeting-details.service';
import { MESSAGE } from "app/shared/message";

declare var $:any;

@Component({
  selector: 'app-registration-form',
  templateUrl: './registration-form.component.html',
  styleUrls: ['./registration-form.component.css'],
  providers: [PreRegistrationTemplatesService, MeetingDetailsService]
})
 
export class RegistrationFormComponent implements OnInit {

  public userDetails;
  public templates;
  public selectedTemplate = '';
  public fieldTypes:any = ["", "Text", "Radio", "Checkbox", "Textarea", "Country", "State", "Terms and conditions", "Dropdown"];
  public fieldsArray:any = [];
  public isRequired = false;
  public meetingId = '';
  public noTemplate = 0;
  public isEditable = 1;
  public newFieldNameError = 0;
  public newFieldTypeError = 0;
  public newFieldValuesError = 0;
  public newTermsFileError = 0;
  public newTermsFileTypeError = 0;
  public newTermsFileName = '';
  files : FileList;
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
  public meetingStatus;
  public userRoleId;
  public urlPrefix = '';
  public termsPath = '';
  public fileName = '';
  public accessDenied:boolean = false;
  public accessMessage = '';
  public isRescheduled:boolean = false;

  constructor(private router:Router, private activatedRoute:ActivatedRoute, private user:User, private preRegistrationTemplatesService: PreRegistrationTemplatesService, public toastr: ToastsManager, vcr: ViewContainerRef, private meetingDetailsService: MeetingDetailsService) {
    this.userDetails = user.getUser();
    this.userRoleId = this.userDetails.us_role_id;
    if(this.userRoleId == '1'){
      // Admin
      this.urlPrefix = '/admin';
    }else if(this.userRoleId == '2'){
      // Facilitator
      this.urlPrefix = '/facilitator';
    }
    this.toastr.setRootViewContainerRef(vcr);
    this.termsPath = Config.UPLOADS_PATH + 'terms_and_conditions/';
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.meetingId   = params['meetingId'];
    });
    this.getMeetingStatus();
    this.getTemplates();
  }

  /**
   * Show success toastr message
   * @param msg 
   */
  showSuccess(msg) {
    this.toastr.success(msg, 'Success!');
  }

  /**
   * Show error toastr message
   * @param msg 
   */
  showError(msg) {
    this.toastr.error(msg, 'Failure!');
  }

  /**
   * Show warning toastr message
   * @param msg 
   */
  showWarning(msg) {
    this.toastr.warning(msg, 'Warning!');
  }

  /**
   * Terms and conditions file upload
   * @param value 
   */
  onChange(value) {
    this.fileName = '';
    if(value == '7'){ // Terms and conditions
      this.isRequired = true;
    }else{
      this.isRequired = false;
    }
  }

  /**
   * Get pre registration templates
   */
  getTemplates() {
    let params:any = {};
    params.token = this.userDetails.token;
    params.meeting_id = this.meetingId;
    if(this.userRoleId != '3'){
      params.route_meeting_id = this.meetingId;
    }
    this.preRegistrationTemplatesService.getRegistrationTemplatesMeeting(params).subscribe(
      (response:any) => {
        response = JSON.parse(response['_body']);
        if(response.success == 1){
          this.templates = response.body.templates;
          let regTemplates = response.body.templates;
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
        error = JSON.parse(error['_body']);
        if(error.message == 'Login failed'){
          this.user.logOut();
          this.router.navigateByUrl('/');
        }
      }
    )
  }

  /**
   * Get details of a template
   * @param tempId 
   * @param tempName 
   * @param isDefaultTemplate 
   */
  getTemplate(tempId = '', tempName = '', isDefaultTemplate ='') {
    this.templateId = '';
    this.fieldsArray = [];
    let isDefault = 0;
    this.selectedTemplate = tempName;
    let params:any = {};
    this.templateTitle   = tempName;
    params.token = this.userDetails.token;
    params.template_id = tempId;
    // Added - 10/11/2017
    params.meeting_id = this.meetingId;
    if(this.userRoleId != '3'){
      params.route_meeting_id = this.meetingId;
    }
    this.preRegistrationTemplatesService.getRegistrationTemplate(params).subscribe(
      (response:any) => {
        response = JSON.parse(response['_body']);
        if(response.success == 1){
          if((response.body.meeting_id == this.meetingId) && (response.body.is_default == 1)){
            this.noTemplate = 1;
          }else{
            this.noTemplate = 0;
          }
          if(response.body.access_denied == 1){
            this.accessDenied = true;
            this.accessMessage = MESSAGE.EDIT_PERMISSION_DENIED;
          }
          this.templateId = tempId;
          let templateDetails = response.body.template_details;
          for(let i=0; i<templateDetails.length; i++){
            let obj:any = {};
            obj.fieldName = templateDetails[i].field_name;
            obj.fieldType = templateDetails[i].field_type;
            if(templateDetails[i].field_type == '7'){ // Terms and conditions
              obj.fieldValues = '<a href="'+this.termsPath + templateDetails[i].field_values +'" download>' + templateDetails[i].field_values + '</a>';
            }else{
              obj.fieldValues = templateDetails[i].field_values;
            }
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
            if(this.userRoleId != '3'){
              params.route_meeting_id = this.meetingId;
            }
            this.saveMeetingTemplate(params);
          }
        }
      },
      (error) => console.log(error)
    )
  }

  /**
   * Add field to a template
   * @param fieldDetails 
   */
  addField(fieldDetails:NgForm) {
    if(fieldDetails.valid){
      this.validateNewFieldName(fieldDetails.value.fieldName);
      this.validateNewFieldValues(fieldDetails.value.fieldValues);
      if(fieldDetails.value.fieldType == '7'){ // Terms and conditions file
        // Check already exists
        let isExists = false;
        let params:any = {};
        params.fieldType = fieldDetails.value.fieldType;
        isExists   = this.checkExists(params);
        if(!isExists){
          this.validateTermsFile();
        }
      }else{
        this.newTermsFileError = 0;
        this.newTermsFileTypeError = 0;
      }
      if(this.newFieldNameError == 0 && this.newFieldTypeError == 0 && this.newFieldValuesError == 0 && this.newTermsFileError == 0 && this.newTermsFileTypeError == 0){
        let isExists = false;
        if(fieldDetails.value.fieldType == '5' || fieldDetails.value.fieldType == '6' || fieldDetails.value.fieldType == '7'){ // country or state or terms
          // Check already exists
          let params:any = {};
          params.fieldType = fieldDetails.value.fieldType;
          isExists   = this.checkExists(params);
          if(!isExists){
            // Add country if not exists while adding state
            if(fieldDetails.value.fieldType == '6'){ // States dropdown
              let params:any = {};
              params.isReq = fieldDetails.value.isRequired;
              // Check country exists
              let isCountryExists = this.checkCountry(params);
              if(!isCountryExists){
                // Add country
                this.addCountry(params);
              }
            }
          }
          if(fieldDetails.value.fieldType == '7'){ // Terms and conditions
            fieldDetails.value.fieldValues = this.newTermsFileName;
            fieldDetails.value.fieldName = 'Terms and conditions';
          }
          if(fieldDetails.value.fieldType == '5'){ // Country
            fieldDetails.value.fieldName = 'Country';
          }
          if(fieldDetails.value.fieldType == '6'){ // State
            fieldDetails.value.fieldName = 'State';
          }
        }
        if(!isExists){
          let obj:any = {};
          obj.fieldType = fieldDetails.value.fieldType;
          obj.fieldName = (fieldDetails.value.fieldName) ? fieldDetails.value.fieldName : '';
          obj.fieldValues = (fieldDetails.value.fieldValues) ? fieldDetails.value.fieldValues : '';
          if(fieldDetails.value.isRequired == true){
            obj.isRequired = 1;
          }else{
            obj.isRequired = 0;
          }
          obj.isEditable = this.isEditable;
          this.fieldsArray.push(obj);
          fieldDetails.resetForm();
          this.fileName = '';
          this.saveTemplate();
        }else{
          // Show error message
          this.showError('Selected field already exists');
        }
      }else{
        if(this.newTermsFileTypeError > 0){
          this.showError('Invalid file');
        }else if(this.newTermsFileError > 0){
          this.showError('Please select file');
        }
      }
    }
  }

  /**
   * Validate terms and conditions file
   */
  validateTermsFile()
  {
    if( $("#terms_and_conditions").get(0).files.length == 0 ){
      this.newTermsFileError++;
    }else{
      this.newTermsFileError = 0;
    }
  }

  /**
   * Terms and conditions file upload
   * @param event 
   */
  getFiles(event){ 
    if(event.target.files && event.target.files[0]) {
      if((event.target.files[0].type == "application/pdf")){
        this.newTermsFileTypeError = 0;
        this.newTermsFileName = event.target.files[0].name;
        this.files = event.target.files;
        this.fileName = event.target.files[0].name;
      }else{
        this.newTermsFileTypeError ++;
      }
    }else{
      $("#terms_and_conditions").value = "";
      this.fileName = '';
    }
  }

  /**
   * Check country field exists
   * @param params 
   */
  checkCountry(params)
  {
    let countryExists = false;
    for(let i=0; i<this.fieldsArray.length; i++){
      if(this.fieldsArray[i].fieldType == '5'){ // Country dropdown
        if(params.isReq == true){
          if(this.fieldsArray[i].isRequired != 1){
            this.fieldsArray[i].isRequired = 1;
          }
        }
        countryExists = true;
      }
    }
    return countryExists;
  }

  /**
   * Add country field to a template
   * @param params 
   */
  addCountry(params)
  {
    let obj:any = {};
    obj.fieldType = '5';
    obj.fieldName = 'Country';
    obj.fieldValues = '';
    if(params.isReq == true){
      obj.isRequired = 1;
    }else{
      obj.isRequired = 0;
    }
    obj.isEditable = this.isEditable;
    this.fieldsArray.push(obj);
  }

  checkExists(params)
  {
    let countryStateExists = false;
    for(let i=0; i<this.fieldsArray.length; i++){
      if(this.fieldsArray[i].fieldType == params.fieldType){ // Country dropdown or states dropdown
        countryStateExists = true;
      }
    }
    return countryStateExists;
  }

  validateNewFieldName(name) {
    let newFieldNameErrorCount = 0;
    let newFieldNameErrors = 0;
    // Added - 23/04/2018
    let nameExists = 0;
    if(this.fieldType == '1' || this.fieldType == '2' || this.fieldType == '3' || this.fieldType == '4'){
      // No name checking for country, state, terms and conditions
      if(name!=''){
        var letters = /^[0-9a-zA-Z ]+$/;
        if (letters.test(name)){
          // Check for names
          for(var i=0; i<this.fieldsArray.length; i++){
            let fname = (this.fieldsArray[i].fieldName).replace(/\s/g, '');
            let newName = name.replace(/\s/g, '');
            if(newName == fname){
              newFieldNameErrorCount++;
              // Added - 23/04/2018
              nameExists++;
            }else{
              // this.newFieldNameError = 0;
              let newFieldName = newName.toLowerCase();
              if(newFieldName === 'country' || newFieldName === 'state'){
                newFieldNameErrorCount++;
                newFieldNameErrors++;
              }
            }
          }
        }else{
          newFieldNameErrorCount++;
        }
        if(newFieldNameErrors > 0){
          this.showError('Field with name ' + name + ' not allowed');
        }
      }else{
        newFieldNameErrorCount++;
      }
    }
    if(newFieldNameErrorCount > 0) {
      this.newFieldNameError = 1;
      // Added - 23/04/2018
      if(nameExists > 0){
        this.showError('Field name already exists');
      }
    }else{
      this.newFieldNameError = 0;
    }
  }

  validateNewFieldValues(values){
    let letters = /^[0-9a-zA-Z ]+$/;
    // Changed - 04/04/2018
    // let maxLength = 5;
    let maxLength = 35;
    if(this.fieldType == '8'){
      // Dropdown
      // Changed - 04/04/2018
      // maxLength = 20;
    }
    // if(this.fieldType != '1'){
    if(this.fieldType == '2' || this.fieldType == '3' || this.fieldType == '8'){
      let str = values;
      let str_array = str.split(',');
      // if(str_array.length < 2 || str_array.length > 5){
      if(str_array.length < 2 || str_array.length > maxLength){
        this.newFieldValuesError = 1;
      }else{
        let newValuesError = 0;
        for(var i = 0; i < str_array.length; i++) {
           // Trim the excess whitespace.
           str_array[i] = str_array[i].replace(/^\s*/, "").replace(/\s*$/, "");
           // Add additional code here, such as:
          //  Changed - 05/04/2018 - Removed special characters description
          //  if(str_array[i] == '' || (!letters.test(str_array[i]))){
           if(str_array[i] == ''){
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
      let type = this.fieldsArray[rowId].fieldType;
      this.fieldsArray.splice(rowId, 1);
      $("#delete-confirmation").modal('hide');
      if(type == '5'){ // Country dropdown
        // Check for state dropdown, if state exists then delete state dropdown
        for(let i=0; i<this.fieldsArray.length; i++){
          if(this.fieldsArray[i].fieldType == '6'){ // State dropdown
            this.fieldsArray.splice(i, 1);
          }
        }
      }
      this.saveTemplate();
    }
  }

  toggleRequired(rowId) {
    if(rowId != ''){
      let req = false;
      if(this.fieldsArray[rowId].isRequired == 0){
        req = true;
        this.fieldsArray[rowId].isRequired = 1;
      }else{
        this.fieldsArray[rowId].isRequired = 0;
      }
      if(this.fieldsArray[rowId].fieldType == 6){ // State dropdown
        if(req){
          // Check for countries and change it to required
          this.countryRequired();
        }
      }

      if(this.fieldsArray[rowId].fieldType == 5){ // Country dropdown
        if(!req){
          this.stateNotRequired();
        }
      }
    }
    this.saveTemplate();
  }

  countryRequired(){
    for(let i=0; i<this.fieldsArray.length; i++){
      if(this.fieldsArray[i].fieldType == 5){ // Country dropdown
        this.fieldsArray[i].isRequired = 1;
      }
    }
    this.saveTemplate();
  }

  stateNotRequired(){
    for(let i=0; i<this.fieldsArray.length; i++){
      if(this.fieldsArray[i].fieldType == 6){ // State dropdown
        this.fieldsArray[i].isRequired = 0;
      }
    }
    this.saveTemplate();
  }

  validateFieldName(name) {
    let fieldNameErrorCount = 0;
    // Added - 23/04/2018
    let nameExists = 0;
    if(name!=''){
      var letters = /^[0-9a-zA-Z ]+$/;
      if (letters.test(name)){
        // Check for names
        for(var i=0; i<this.fieldsArray.length; i++){
          let fname = (this.fieldsArray[i].fieldName).replace(/\s/g, '');
          let newName = name.replace(/\s/g, '');
          if(i != this.rowToEdit){
            if(newName == fname){
              fieldNameErrorCount++;
              // Added - 23/04/2018
              nameExists++;
            }else{
            }
          }
        }
      }else{
        fieldNameErrorCount++;
      }
    }else{
      fieldNameErrorCount++;
    }
    if(fieldNameErrorCount > 0){
      this.editNameError = 1;
      // Added - 23/04/2018
      if(nameExists > 0){
        this.showError('Field name already exists');
      }
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
    let letters = /^[0-9a-zA-Z ]+$/;
    // Changed - 04/04/2018
    // let maxLength = 5;
    let maxLength = 35;
    if(this.editType == '8'){
      // Dropdown
      // Changed - 04/04/2018
      // maxLength = 20;
    }
    // if(this.editType != '1'){
    if(this.editType == '2' || this.editType == '3' || this.editType == '8'){
      let str = values;
      let str_array = str.split(',');
      // if(str_array.length < 2 || str_array.length > 5){
      if(str_array.length < 2 || str_array.length > maxLength){
        this.editValuesError = 1;
      }else{
        let valuesError = 0;
        for(var i = 0; i < str_array.length; i++) {
           // Trim the excess whitespace.
           str_array[i] = str_array[i].replace(/^\s*/, "").replace(/\s*$/, "");
           // Add additional code here, such as:
          //  Changed - 05/04/2018 - Removed special characters description
          //  if(str_array[i] == '' || (!letters.test(str_array[i]))){
           if(str_array[i] == ''){
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
      params.meeting_id = this.meetingId;
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
      if(this.userRoleId != '3'){
        params.route_meeting_id = this.meetingId;
      }
      let formData:FormData = new FormData();
      formData.append('details', JSON.stringify(params));
      if(this.files){
        formData.append('file', this.files[0]); 
      }
      // this.preRegistrationTemplatesService.saveRegistrationTemplate(params).subscribe(
      this.preRegistrationTemplatesService.saveRegistrationTemplate(formData).subscribe(
        (response:any) => {
          response = JSON.parse(response['_body']);
          if(response.success == 1){
            let templateDetail = response.body;
            // this.getTemplate(templateDetail.template_id, templateDetail.template_title, '1');
            let uploadSuccess = response.upload_success;
            let uploadMessage = response.upload_message;
            let uploadFile = response.upload_file;
            if(uploadSuccess == 0){
              this.showError(uploadMessage);
              // Remove file
              for(let i=0; i<this.fieldsArray.length; i++){
                if(this.fieldsArray[i].fieldType == '7'){ // Terms and conditions
                  this.fieldsArray.splice(i, 1);
                }
              }
            }else if(uploadSuccess == 1){
              this.showSuccess(response.message);
              // Change file name
              for(let i=0; i<this.fieldsArray.length; i++){
                if(this.fieldsArray[i].fieldType == '7'){ // Terms and conditions
                  this.fieldsArray[i].fieldValues = '<a href="'+this.termsPath + uploadFile+'" download>'+uploadFile+'</a>';
                }
              }
            }
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
          this.showSuccess('Meeting pre registration template saved successfully');
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

  /**
   * Get status of a meeting - past or future
   * 
   * @author
   * @date 2017-10-26
   */
  getMeetingStatus() {
    let params:any = {};
    params.meeting_id   = this.meetingId;
    params.token   = this.userDetails.token;
    this.meetingDetailsService.getStatus(params).subscribe(
      (response:any) => {
        response   = JSON.parse(response['_body']);
        if(response.success == 1){
          let meeting   = response.body.meeting;
          if(meeting.meeting_status != 3){
            this.meetingStatus = 0;
            if(meeting.is_rescheduled){
              if(meeting.is_rescheduled == 1){
                this.isRescheduled = true;
              }
            }
          }else{
            // this.router.navigateByUrl('/meetings-list');
            if(this.userRoleId == '3'){
              // Registered user
              this.router.navigateByUrl('/meetings-list');
            }else{
              // Admin/Facilitator
              this.router.navigateByUrl(this.urlPrefix + '/events-calendar');
            }
          }
        }else{
          // this.router.navigateByUrl('/meetings-list');
          if(this.userRoleId == '3'){
            // Registered user
            this.router.navigateByUrl('/meetings-list');
          }else{
            // Admin/Facilitator
            this.router.navigateByUrl(this.urlPrefix + '/events-calendar');
          }
        }
      },
      (error) => {
        error = JSON.parse(error['_body']);
        if(error.message == 'Login failed'){
          this.user.logOut();
          // this.router.navigateByUrl('/');
          if(this.userRoleId == '1') {
            this.router.navigateByUrl('/admin/login');
          }else{
            this.router.navigateByUrl('/');
          }
        }else{
          // this.router.navigateByUrl('/meetings-list');
          if(this.userRoleId == '3'){
            // Registered user
            this.router.navigateByUrl('/meetings-list');
          }else{
            // Admin/Facilitator
            this.router.navigateByUrl(this.urlPrefix + '/events-calendar');
          }
        }
      }
    )
  }


}
