import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { PreRegistrationTemplatesService } from 'app/settings/pre-registration-templates/pre-registration-templates.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Config } from 'app/config/config';
import { User } from 'app/shared/user';
import { NgForm } from '@angular/forms';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { ViewContainerRef } from '@angular/core';
import { ToastrService } from 'toastr-ng2';
import { MESSAGE } from "app/shared/message";
declare var $:any;

@Component({
  selector: 'app-pre-registration-templates',
  templateUrl: './pre-registration-templates.component.html',
  styleUrls: ['./pre-registration-templates.component.css'],
  providers: [PreRegistrationTemplatesService]
})

export class PreRegistrationTemplatesComponent implements OnInit {
  
  @Input() routeMeetingId;
  @ViewChild('f') public fieldForm: NgForm;
  public userDetails;
  public templates:any = [];
  // Changed - added textarea
  public fieldTypes:any = ["", "Text", "Radio", "Checkbox", "Textarea", "Country", "State", "Terms and conditions", "Dropdown"];
  public fieldsArray:any = [];
  public isRequired = false;
  public fieldType;
  public fieldValues = '';
  public fieldName;
  public isEditable = "1";
  public rowToEdit;
  public editType;
  public editName;
  public editValues;
  public editNameError = 0;
  public editTypeError = 0;
  public editValuesError = 0;
  public templateTitleError = 0;
  public templateTitle = '';
  public templateId = '';
  public newFieldTypeError = 0;
  public newFieldNameError = 0;
  public newFieldValuesError = 0;
  public newTermsFileError = 0;
  public newTermsFileTypeError = 0;
  public newTermsFileName = '';
  files : FileList;
  public templateToDelete = '';
  public title: string = 'Are you sure?';
  public rowToDelete = '';
  public defaultTemplateDetails:any = [];
  public roleId;
  public urlPrefix = '';
  public termsPath = '';
  public fileName = '';
  public allDataFetched:boolean = false;
  public accessDenied:boolean = false;
  public accessMessage = '';
  public disableSaveReg:boolean = false;
  public disableDeleteReg:boolean = false;
  // Added - 23/04/2018
  public fieldDescription;
  public editDescription;

  constructor(private user:User, private preRegistrationTemplatesService: PreRegistrationTemplatesService, public toastr: ToastsManager, vcr: ViewContainerRef, private toastrService: ToastrService, private router:Router) {
    this.userDetails = user.getUser();
    this.toastr.setRootViewContainerRef(vcr);
    this.roleId = this.userDetails.us_role_id;
    if(this.roleId == '1'){
      // Admin
      this.urlPrefix = '/admin';
    }else if(this.roleId == '2'){
      // Facilitator
      this.urlPrefix = '/facilitator';
    }
    this.termsPath = Config.UPLOADS_PATH + 'terms_and_conditions/';
  }

  ngOnInit() {
    // Added - 16/11/2017
    if(this.roleId != '3'){
      if(this.routeMeetingId != '' && (!isNaN(this.routeMeetingId))){
      }else{
        this.router.navigateByUrl(this.urlPrefix + '/events-calendar');
      }
    }
    this.getTemplates();
    this.defaultTemplateDetails = [];
    this.getDefaultTemplates();
  }

  ngAfterViewInit() {
    let __this = this;
    $('#pre_reg_temp').on('hidden.bs.modal', function (e) {
      __this.initializeParams();
      __this.fieldForm.resetForm();
    });
  }

  /**
   * Show toastr error message
   * @param msg 
   */
  showError(msg) {
    this.toastrService.error(msg, 'Failure!');
  }

  /**
   * Show toastr success message
   * @param msg 
   */
  showSuccess(msg) {
    this.toastrService.success(msg, 'Success!');
  }

  /**
   * Show toastr warning message
   * @param msg 
   */
  showWarning(msg) {
    this.toastrService.warning(msg, 'Warning!');
  }

  /**
   * Field type change
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
    params.route_meeting_id = this.routeMeetingId;
    this.preRegistrationTemplatesService.getRegistrationTemplatesSettings(params).subscribe(
      (response:any) => {
        this.allDataFetched = true;
        response = JSON.parse(response['_body']);
        if(response.success == 1){
          this.templates = response.body.templates;
          if(response.body.access_denied == 1){
            this.accessDenied = true;
            this.accessMessage = MESSAGE.EDIT_PERMISSION_DENIED;
          }
        }
      },
      (error) => {
        error = JSON.parse(error['_body']);
        if(error.message == 'Login failed'){
          this.user.logOut();
          this.redirectLogin();
        }else{
          this.redirectHome();
        }
      }
    )
  }

  /**
   * Get default template details - fields
   */
  getDefaultTemplates() {
    let params:any = {};
    params.token = this.userDetails.token;
    params.route_meeting_id = this.routeMeetingId;
    this.preRegistrationTemplatesService.getDefaultTemplates(params).subscribe(
      (response:any) => {
        response = JSON.parse(response['_body']);
        if(response.success == 1){
          this.defaultTemplateDetails = response.body.template_details;
        }
      },
      (error) => {
        error = JSON.parse(error['_body']);
        if(error.message == 'Login failed'){
          this.user.logOut();
          this.redirectLogin();
        }else{
          this.redirectHome();
        }
      }
    )
  }

  /**
   * Show new template modal with default fields
   */
  addTemplate() {
    this.fieldsArray = [];
    this.rowToEdit = -1;
    let templateDetails = this.defaultTemplateDetails;
    for(var i=0; i<templateDetails.length; i++){
      let obj:any = {};
      obj.fieldType = templateDetails[i].field_type,
      obj.fieldName = templateDetails[i].field_name,
      // Added - 23/04/2018
      obj.fieldDescription = templateDetails[i].field_description,
      obj.fieldValues = templateDetails[i].field_values,
      obj.isRequired = templateDetails[i].is_required,
      obj.isEditable = templateDetails[i].is_editable
      this.fieldsArray.push(obj);
    }
    $("#pre_reg_temp").modal({'show':true});
  }

  /**
   * Add new field to the registration form
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
              // Check country exists
              let params:any = {};
              params.isReq = fieldDetails.value.isRequired;
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
          // Added - 23/04/2018
          obj.fieldDescription = (fieldDetails.value.fieldDescription) ? fieldDetails.value.fieldDescription : '';
          obj.fieldValues = (fieldDetails.value.fieldValues) ? fieldDetails.value.fieldValues : '';
          obj.fieldValuesHtml = (fieldDetails.value.fieldValues) ? fieldDetails.value.fieldValues : '';
          if(fieldDetails.value.isRequired == true){
            obj.isRequired = 1;
          }else{
            obj.isRequired = 0;
          }
          obj.isEditable = this.isEditable;
          this.fieldsArray.push(obj);
          fieldDetails.resetForm();
          this.fileName = '';
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
   * Terms and conditions file input change - Check file type, get file name
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
   * Check country dropdown exists
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
   * Add country dropdown field
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

  /**
   * Check country or states dropdown fields exists
   * @param params 
   */
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

  /**
   * Edit template field
   * @param rowId 
   */
  editRow(rowId) {
    this.rowToEdit = rowId;
    this.editType = this.fieldsArray[rowId].fieldType;
    this.editName = this.fieldsArray[rowId].fieldName;
    // Added - 23/04/2018
    this.editDescription = this.fieldsArray[rowId].fieldDescription;
    this.editValues = this.fieldsArray[rowId].fieldValues;
  }

  /**
   * Cancel template field edit
   * @param rowId 
   */
  cancelEdit(rowId) {
    this.rowToEdit = -1;
    this.editType = '';
    this.editName = '';
    // Added - 23/04/2018
    this.editDescription = '';
    this.editValues = '';
    this.editNameError = 0;
    this.editTypeError = 0;
    this.editValuesError = 0;
  }

  /**
   * Save template field changes after edit
   * @param rowId 
   */
  saveChanges(rowId) {
    if(this.rowToEdit != ''){
      this.validateFieldName(this.editName);
      this.validateFieldType(this.editType);
      this.validateFieldValues(this.editValues);
      if(this.editNameError == 0 && this.editTypeError == 0 && this.editValuesError == 0){
        this.fieldsArray[rowId].fieldType = this.editType;
        this.fieldsArray[rowId].fieldName = this.editName;
        // Added - 23/04/2018
        this.fieldsArray[rowId].fieldDescription = this.editDescription;
        this.fieldsArray[rowId].fieldValues = this.editValues;
        // Added - 01/03/2018
        this.fieldsArray[rowId].fieldValuesHtml = this.editValues;
        this.rowToEdit = -1;
        this.editType = '';
        this.editName = '';
        // Added - 23/04/2018
        this.editDescription = '';
        this.editValues = '';
      }
    }
  }

  /**
   * Delete template field
   */
  deleteRow(rowId) {
    if(rowId != ''){
      let type = this.fieldsArray[rowId].fieldType;
      this.fieldsArray.splice(rowId, 1);
      if(type == '5'){ // Country dropdown
        // Check for state dropdown, if state exists then delete state dropdown
        for(let i=0; i<this.fieldsArray.length; i++){
          if(this.fieldsArray[i].fieldType == '6'){ // State dropdown
            this.fieldsArray.splice(i, 1);
          }
        }
      }
      $("#delete-confirmation").modal('hide');
    }

  }

  /**
   * Change template field required while check or uncheck
   * @param rowId 
   */
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
  }

  /**
   * Make country required if state is required
   */
  countryRequired(){
    for(let i=0; i<this.fieldsArray.length; i++){
      if(this.fieldsArray[i].fieldType == 5){ // Country dropdown
        this.fieldsArray[i].isRequired = 1;
      }
    }
  }

  /**
   * Make state not required if country not required
   */
  stateNotRequired(){
    for(let i=0; i<this.fieldsArray.length; i++){
      if(this.fieldsArray[i].fieldType == 6){ // State dropdown
        this.fieldsArray[i].isRequired = 0;
      }
    }
  }

  /**
   * Check field name already exists while add a te mplate field - EDIT FIELD
   * @param name 
   */
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
            if(newName.toUpperCase() == fname.toUpperCase()){
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

  /**
   * Check field name already exists while add a te mplate field - ADD FIELD
   * @param name 
   */
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
          let newName = name.replace(/\s/g, '');
          for(var i=0; i<this.fieldsArray.length; i++){
            let fname = (this.fieldsArray[i].fieldName).replace(/\s/g, '');
            let newName = name.replace(/\s/g, '');
            if(newName.toUpperCase() == fname.toUpperCase()){
              newFieldNameErrorCount++;
              // Added - 23/04/2018
              nameExists++;
            }else{
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

  validateFieldType(type) {
    if(type != ''){
    }else{
      this.editTypeError = 1;
    }
  }

  /**
   * Check field values - minimum and maximum numbers, special characters - EDIT FIELD
   */
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
    if(this.editType == '2' || this.editType == '3' || this.editType == '8'){
      let str = values;
      let str_array = str.split(',');
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

  /**
   * Check field values - minimum and maximum numbers, special characters - ADD FIELD
   * @param values 
   */
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
    if(this.fieldType == '2' || this.fieldType == '3' || this.fieldType == '8'){
      let str = values;
      let str_array = str.split(',');
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

  /**
   * Save pre registration template
   */
  saveTemplate() {
    if(this.templateTitle != ''){
      let regTemplates = this.templates;
      let titleError = 0;
      for(let i=0; i<regTemplates.length; i++) {
        if(this.templateId != ''){
          if(regTemplates[i].id != this.templateId){
            if(regTemplates[i].title == this.templateTitle.replace(/\s+$/, '')){
              titleError ++;
            }
          }
        }else{
          if(regTemplates[i].title == this.templateTitle.replace(/\s+$/, '')){
            titleError ++;
          }
        }
      }
      if((this.templateTitle).length > 30) {
        titleError ++;
      }
      if(titleError > 0){
        this.templateTitleError = 1;
      }else{
        this.disableSaveReg = true;
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
          // Added - 23/04/2018
          obj.field_description = field.fieldDescription;
          obj.field_values = field.fieldValues;
          obj.is_required = field.isRequired;
          obj.is_editable = field.isEditable;
          fields.push(obj);
        }
        params.fields = fields;
        params.route_meeting_id = this.routeMeetingId;
        let formData:FormData = new FormData();
        formData.append('details', JSON.stringify(params));
        if(this.files){
          formData.append('file', this.files[0]); 
        }
        this.preRegistrationTemplatesService.saveRegistrationTemplate(formData).subscribe(
          (response:any) => {
            this.disableSaveReg = false;
            response = JSON.parse(response['_body']);
            if(response.success == 1){
              // Show toastr
              $("#pre_reg_temp").modal('hide');
              let uploadSuccess = response.upload_success;
              let uploadMessage = response.upload_message;
              if(uploadSuccess == 0){
                this.showWarning(response.message + '\n' + uploadMessage);
              }else{
                this.showSuccess(response.message);
              }
              if(this.templateId != ''){
                for(let i=0; i<this.templates.length; i++){
                  if(this.templates[i].id == this.templateId){
                    this.templates[i].title = response.body.template_title;
                  }
                }
              }else{
                let template:any = {};
                template.id = response.body.template_id;
                template.title = this.templateTitle;
                this.templates.push(template);
              }
              this.initializeParams();
            }
          },
          (error) => {
            error = JSON.parse(error['_body']);
            if(error.message == 'Login failed'){
              this.user.logOut();
              this.redirectLogin();
            }
          }
        )
      }
    }else{
      this.templateTitleError = 1;
    }
  }

  /**
   * Initialize params after save pre registration template
   */
  initializeParams() {
    this.fieldsArray = [];
    this.templateTitle = '';
    this.templateId = '';
    this.editNameError = 0;
    this.editTypeError = 0;
    this.editValuesError = 0;
    this.templateTitleError = 0;
    this.fieldType = '';
    this.fieldValues = '';
    this.fieldName = '';
    // Added - 23/04/2018
    this.fieldDescription = '';
    this.newFieldNameError = 0;
    this.newFieldTypeError = 0;
    this.newFieldValuesError = 0;
    this.templateToDelete = '';
  }

  /**
   * Check template title empty
   */
  checkName() {
    if(this.templateTitle != ''){
      this.templateTitleError = 0;
    }else{
      this.templateTitleError = 1;
    }
  }

  /**
   * Edit pre registration template
   * @param tempId 
   */
  editTemplate(tempId) {
    let params:any = {};
    params.token = this.userDetails.token;
    params.template_id = tempId;
    params.route_meeting_id = this.routeMeetingId;
    this.preRegistrationTemplatesService.getRegistrationTemplate(params).subscribe(
      (response:any) => {
        response = JSON.parse(response['_body']);
        if(response.success == 1){
          let templateDetails = response.body.template_details;
          for(let i=0; i<templateDetails.length; i++){
            let obj:any = {};
            obj.fieldName = templateDetails[i].field_name;
            obj.fieldType = templateDetails[i].field_type;
            // Added - 23/04/2018
            obj.fieldDescription = templateDetails[i].field_description;
            if(templateDetails[i].field_type == '7'){ // Terms and conditions
              obj.fieldValues = templateDetails[i].field_values;
              obj.fieldValuesHtml = '<a href="'+this.termsPath + templateDetails[i].field_values +'" download>' + templateDetails[i].field_values + '</a>';
            }else{
              obj.fieldValues = templateDetails[i].field_values;
              // Added - 01/03/2018
              obj.fieldValuesHtml = templateDetails[i].field_values;
            }
            obj.isRequired = templateDetails[i].is_required;
            obj.isEditable = templateDetails[i].is_editable;
            this.fieldsArray.push(obj);
          }
          this.templateId = response.body.template_id;
          this.templateTitle = response.body.template_title;
          $("#pre_reg_temp").modal({'show':true});
        }else{
          this.showError('something went wrong');
        }
      },
      (error) => console.log(error)
    )
  }

  /**
   * Show delete template confirmation modal
   * @param tempId 
   */
  deleteTemplate(tempId) {
    if(tempId != ''){
      this.templateToDelete = tempId;
      $("#delete-pop").modal({'show': true});
    }
  }
  
  /**
   * Delete pre registration template
   * @param tempId 
   */
  deleteRegTemplate(tempId) {
    if(tempId != ''){
      // Delete template
      this.disableDeleteReg = true;
      let params:any = {};
      params.token = this.userDetails.token;
      params.template_id = tempId;
      params.route_meeting_id = this.routeMeetingId;
      this.preRegistrationTemplatesService.deleteRegistrationTemplate(params).subscribe(
        (response:any) => {
          this.disableDeleteReg = false;
          response = JSON.parse(response['_body']);
          if(response.success == 1){
            // Delete from templates array
            for(let i=0; i<this.templates.length; i++){
              if(this.templates[i].id == tempId){
                this.templates.splice(i, 1);
              }
            }
            this.showSuccess(response.message);
          }else{
            this.showError(response.message);
          }
          $("#delete-pop").modal('hide');
        },
        (error) => {
          let errorResponse = JSON.parse(error['_body']);
          this.showError(errorResponse.message);
          $("#delete-pop").modal('hide');
          error = JSON.parse(error['_body']);
          if(error.message == 'Login failed'){
            this.user.logOut();
            this.redirectLogin();
          }
        }
      )
    }
  }

  /**
   * Show field delete confirmation modal
   * @param rowId 
   */
  confirmDeleteRow(rowId) {
    if(rowId != ''){
      this.rowToDelete = rowId;
      $("#delete-confirmation").modal({'show':true});
    }
  }

  /**
   * Redirect to login page based on role(Admin/Facilitator/Registered user)
   */
  redirectLogin()
  {
    if(this.roleId == '1') {
      // Admin
      this.router.navigateByUrl('/admin/login');
    }else{
      // Facilitator/Registered user
      this.router.navigateByUrl('/');
    }
  }

  /**
   * Redirect to home page based on role(Admin/Facilitator/Registered user)
   */
  redirectHome()
  {
    if(this.roleId == '3'){
      // Registered user
      this.router.navigateByUrl('/meetings-list');
    }else{
      // Admin/Facilitator
      this.router.navigateByUrl(this.urlPrefix + '/events-calendar');
    }
  }

}
