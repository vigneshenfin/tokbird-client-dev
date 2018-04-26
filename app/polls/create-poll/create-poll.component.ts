import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { PollsService } from 'app/polls/polls.service';
import { User } from 'app/shared/user';
import { ToastrService } from 'toastr-ng2';
declare var $:any;

@Component({
  selector: 'app-create-poll',
  templateUrl: './create-poll.component.html',
  styleUrls: ['./create-poll.component.css'],
  providers: [PollsService]
})
export class CreatePollComponent implements OnInit {
  public userDetails;
  public pollQuestions:any = [];
  // {"id":3, "value":"Descriptive"}
  public questionTypes:any = [{"id":1, "value": "Multiple choice"}, {"id":2, "value":"Single choice"}, {"id":3, "value":"Text"}, {"id":4, "value":"Textarea"}, {"id":5, "value":"Dropdown"}];
  public questionToDelete = '';
  public optionToDelete = '';
  public optionQuestion = '';
  public title = '';
  public pollId = '';
  public loading = 1;
  disableButton:boolean = false;
  allDataFetched: boolean = false;
  public roleId;
  public urlPrefix = '';
  // public meetingId = '';
  // public meetingId;
  // Added - 18/11/2017
  public routeMeetingId;
  public isChecked:boolean = true;
  public meetingId = '';
  public assignPoll:boolean = false;

  constructor(private router:Router, private activatedRoute:ActivatedRoute, private pollsService:PollsService, private user:User, private toastrService: ToastrService) {
    this.userDetails   = user.getUser();
    this.roleId = this.userDetails.us_role_id;
    if(this.roleId == '1'){
      // Admin
      this.urlPrefix = '/admin';
    }else if(this.roleId == '2'){
      // Facilitator
      this.urlPrefix = '/facilitator';
    }
  }

  ngOnInit() {
    // $(document).ready(function(){
    //   $(document).on("click", ".delete-forever", function() {
    //       $(this).parent().fadeOut();
    //   });
    // });


    this.activatedRoute.params.subscribe((params: Params) => {
      if(params['pollId']){
        this.pollId   = params['pollId'];
      }
      if(params['meetingId']){
        // this.meetingId   = params['meetingId'];
        // Added - 18/11/2017
        this.routeMeetingId = params['meetingId'];
        this.meetingId = params['meetingId'];
      }
      // Added - 28/02/2018 - For assigning polls while creating
      if(params['assignPoll']){
        this.assignPoll = true;
      }
    });

    if(this.pollId != ''){
      // this.getPoll();
      // Added - 14/11/2017
      if(this.roleId != '3'){
        // Admin/Facilitator
        // if(this.meetingId != ''){
        if(this.routeMeetingId != ''){
          this.getPollDetails();
        }else{
        }
      }else{
        this.getPollDetails();
      }
      // this.allDataFetched = true;
    }else{
      // this.defaultQuestions();
      if(this.roleId != '3'){
        // Admin/Facilitator
        // if(this.meetingId != '' && (!isNaN(this.meetingId))){
        if(this.routeMeetingId != '' && (!isNaN(this.routeMeetingId))){
          this.defaultQuestions();
        }else{
          this.router.navigateByUrl(this.urlPrefix + '/events-calendar');
        }
      }else{
        this.defaultQuestions();
      }
      // this.allDataFetched = true;
    }
  }

  /**
   * Default questions
   * 
   * @author Paul P Elias
   * @date 2017-10-17
   */
  defaultQuestions() {
    // let n = 2;
    let n = 1;
    for(let i=0; i<n; i++){
      let poll:any = {};
      poll.id = "";
      poll.type = 1;
      poll.question = "";
      // poll.options = [null, null];
      // poll.option = [];

      // poll.testOptions = [{"option":0, "value": null}, {"option":1, "value":null}];
      // poll.options = [{"value": 0, "label": null}, {"value": 1, "label": null}];
      // poll.options = [{"value": 0, "label": null, "checked": false, "answer": ''}, {"value": 1, "label": null, "checked": false, "answer": ''}];
      poll.options = [{"value": 0, "label": null}, {"value": 1, "label": null}];
      
      // New features
      poll.rightAnswers = [{"value":0, "checked": false, "answer": ''}, {"value": 1, "checked": false, "answer": ''}];

      // poll.answer   = ''; // For single choice questions
      poll.answers = [];

      this.pollQuestions.push(poll);
      this.loading = 0;
    }
    this.allDataFetched = true;
  }

  /**
   * Add option to a question
   * 
   * @author Paul P Elias
   * @date 2017-10-17
   * @param rowId 
   */
  addOption(rowId){
    // if(rowId >= 0){
    //   let pollDetails = this.pollQuestions;
    //   let length = pollDetails[rowId].options.length;
    //   // 10
    //   if(length < 5){
    //     pollDetails[rowId].options.push({"value":(length), "label": null});
    //     // New feature
    //     pollDetails[rowId].rightAnswers.push({"value":(length), "checked": false, "answer": ''});
    //     // Added - 29/01/2018
    //     this.pollQuestions = pollDetails;
    //   }
    // }

    

    if(rowId >= 0){
      let length = this.pollQuestions[rowId].options.length;
      if(length < 5){
        this.pollQuestions[rowId].options.push({"value":(length), "label": null});
        // New feature
        this.pollQuestions[rowId].rightAnswers.push({"value":(length), "checked": false, "answer": ''});
      }
      // console.log(this.pollQuestions[rowId].options);
    }
  }

  deleteOptionConfirm(question, option){
    // if((question >= 0) && (option >= 0) && (option > 1)){
    if(this.pollQuestions[question].options.length > 2){
      this.optionToDelete = option;
      this.optionQuestion = question;
      $("#delete-option-confirmation").modal({'show':true});
    }
  }

  /**
   * Delete option from a question
   * 
   * @author Paul P Elias
   * @date 2017-10-17
   * @param question 
   * @param option 
   */
  deleteOption(question, option){
    // if((question >= 0) && (option >= 0) && (option > 1) && (this.optionToDelete == option) && (this.optionQuestion == question)){
    if((this.pollQuestions[question].options.length > 2) && (this.optionToDelete == option)){
      for(let i=0; i<this.pollQuestions[question].options.length; i++){
        if(i == option){
          this.pollQuestions[question].options.splice(i, 1);
          // New feature
          this.pollQuestions[question].rightAnswers.splice(i, 1);
        }
      }
      this.optionToDelete = '';
      this.optionQuestion = '';
      $("#delete-option-confirmation").modal('hide');
    }

    // Added - 30/01/2018
    this.reArrangeIndexes(question);
  }

  /**
   * Rearrange options and right answers indexes
   * @date 2018-01-30
   * @param rowId 
   */
  reArrangeIndexes(rowId) {
    this.pollQuestions[rowId].answers = [];
    for(let i=0; i<this.pollQuestions[rowId].options.length; i++) {
      this.pollQuestions[rowId].options[i]['value'] = i;
    }
    for(let i=0; i<this.pollQuestions[rowId].rightAnswers.length; i++) {
      this.pollQuestions[rowId].rightAnswers[i]['value'] = i;
      if(this.pollQuestions[rowId].rightAnswers[i].checked == true){
        this.pollQuestions[rowId].answers.push(i);
      }
    }
    // console.log(this.pollQuestions[rowId]);
  }

  /**
   * Add question to the poll
   * 
   * @author Paul P Elias
   * @date 2017-10-17
   */
  addQuestion() {
    let poll:any = {};
    poll.id = "";
    poll.type = 1;
    poll.question = "";
    // poll.options = [null, null];
    // poll.option = [];
    // poll.options = [{"value":1, "label": null}, {"value": 2, "label": null}];
    // poll.options = [{"value":0, "label": null}, {"value": 1, "label": null}];
    // poll.options = [{"value":0, "label": null, "checked": false, "answer": ''}, {"value": 1, "label": null, "checked": false, "answer": ''}];
    poll.options = [{"value":0, "label": null}, {"value": 1, "label": null}];

    // New features
    poll.rightAnswers = [{"value":0, "checked": false, "answer": ''}, {"value": 1, "checked": false, "answer": ''}];

    // poll.answer   = ''; // For single choice questions
    poll.answers = [];
    this.pollQuestions.push(poll);

    // console.log(this.pollQuestions);
  }

  /**
   * Change question type
   * @param value 
   * @date 2018-01-17
   */
  changeType(value, question) {
    if(value >= 0 && question >= 0){
      if(value == '3' || value == '4'){
        this.pollQuestions[question].options = []; // Empty options
        this.pollQuestions[question].answers = []; // Empty answers
        this.pollQuestions[question].rightAnswers = [];
      }else{
        // this.pollQuestions[question].options = [{"value":0, "label": null, "checked": false, "answer": ''}, {"value": 1, "label": null, "checked": false, "answer": ''}];
        this.pollQuestions[question].options = [{"value":0, "label": null}, {"value": 1, "label": null}];
        // New feature
        this.pollQuestions[question].rightAnswers = [{"value":0, "checked": false, "answer": ''}, {"value": 1, "checked": false, "answer": ''}];
        this.pollQuestions[question].answers = []; // Empty answers
      }
    }
  }

  onChange(index, value, isChecked:boolean){
    if(isChecked) {
      // Check radio or checkbox
      if(this.pollQuestions[index].type == '1'){
        // Checkbox
        this.pollQuestions[index].answers.push(value);

        this.pollQuestions[index].rightAnswers[value].checked = true; // Change checked
        this.pollQuestions[index].rightAnswers[value].answer = ''; // Change answer

      }else{
        // Radio
        this.pollQuestions[index].answers = [];
        this.pollQuestions[index].answers.push(value);

        // Change all right answers checked to false and answer to null
        for(let i=0; i<this.pollQuestions[index].rightAnswers.length; i++){
          this.pollQuestions[index].rightAnswers[i].checked = false;
          this.pollQuestions[index].rightAnswers[i].answer = '';
        }
        // Change selected option as checked and answer
        this.pollQuestions[index].rightAnswers[value].checked = true; // Change checked
        this.pollQuestions[index].rightAnswers[value].answer = value.toString(); // Change answer
      }
    } else {
      if(this.pollQuestions[index].type == '1'){
        // Checkbox
        // Remove checkbox value from answers array
        // Changed - 30/01/2018
        // let arrayIndex = this.pollQuestions[index].answers.findIndex(x => x.value == value);
        // this.pollQuestions[index].answers.splice(index, 1);
        let arrayIndex = this.pollQuestions[index].answers.indexOf(value);
        if(arrayIndex != -1){
          this.pollQuestions[index].answers.splice(arrayIndex, 1);
        }

        // Change right answers(options) to checked false and answer to null
        this.pollQuestions[index].rightAnswers[value].checked = false; // Change checked
        this.pollQuestions[index].rightAnswers[value].answer = ''; // Change answer

      }else{
        // Radio
        this.pollQuestions[index].answers = [];

        // Change all right answers(options) to checked false and answer to null
        for(let i=0; i<this.pollQuestions[index].rightAnswers.length; i++){
          this.pollQuestions[index].rightAnswers[i].checked = false;
          this.pollQuestions[index].rightAnswers[i].answer = '';
        }
      }
    }

    // console.log(this.pollQuestions[index]);
  }

  /**
   * Change right answers (checked, answer)
   */
  changeRightAnswers() {
  }

  deleteQuestionConfirm(question) {
    // if(question > 0){
    if(this.pollQuestions.length > 1){
      this.questionToDelete = question;
      $("#delete-question-confirmation").modal({'show':true});
    }
    // }
  }

  /**
   * Delete question from poll
   * 
   * @author Paul P Elias
   * @date 2017-10-17
   * @param question 
   */
  deleteQuestion(question) {
    // if((question > 0) && (this.questionToDelete == question)){
    if((this.pollQuestions.length > 1) && (this.questionToDelete == question)){
      $("#delete-question-confirmation").modal('hide');
      this.questionToDelete = '';
      this.pollQuestions.splice(question, 1);
    }
  }

  savePoll(event, formInfo:NgForm) {
    if(formInfo.valid){
      this.disableButton = true;
      let params:any = {};
      params.poll_id = this.pollId;
      params.token = this.userDetails.token;
      params.title = this.title;
      // Added - 18/01/2018
      // Changed - 28/02/2018
      if(this.assignPoll){
        params.meeting_id = this.meetingId;
      }
      // Remove checked and answer
      // this.removeOptionDetails();
      params.poll_questions = this.pollQuestions;
      // params.meeting_id = this.meetingId;
      // Added - 18/11/2017
      params.route_meeting_id = this.routeMeetingId;
      this.pollsService.savePoll(params).subscribe(
        (response:any) => {
          response = JSON.parse(response['_body']);
          if(response.success == 1){
            this.showSuccess(response.message);
            this.disableButton = false;
            // this.router.navigateByUrl('polls/view/'+response.body.poll_id);
            // Added - 18/01/2018 - If meet id presents redirects to assigned polls page
            if(this.meetingId != ''){
              if(this.roleId == '3'){
                this.router.navigateByUrl('meetings/assign-polls/'+this.meetingId);
              }else{
                // Changed - 28/02/2018
                // this.router.navigateByUrl(this.urlPrefix + '/meetings/assign-polls/' + this.meetingId);
                if(this.assignPoll){
                  this.router.navigateByUrl(this.urlPrefix + '/meetings/assign-polls/' + this.meetingId);
                }else{
                  this.router.navigateByUrl(this.urlPrefix + '/meetings/polls/view/' + this.routeMeetingId + '/' + response.body.poll_id);
                }
              }
            }else if(this.roleId == '3'){
              this.router.navigateByUrl('polls/view/'+response.body.poll_id);
            }else{
              this.router.navigateByUrl(this.urlPrefix + '/meetings/polls/view/' + this.routeMeetingId + '/' + response.body.poll_id);
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
    }else{
    }
  }

  removeOptionDetails() {
    for(let i=0; i<this.pollQuestions.length; i++){
      for(let j=0; j<this.pollQuestions[i].options.length; j++){
        // delete this.pollQuestions[i].options[j].checked;
        // delete this.pollQuestions[i].options[j].answer;
      }
    }
  }

  setPlaceholder(question, option) {
    let inputName = 'options_'+question+'_'+option;
    $("input#"+inputName).attr('placeholder', "Option "+(option + 1));
  }

  getPoll() {
    if(this.pollId != ''){
      let params:any = {};
      params.token   = this.userDetails.token;
      params.id   = this.pollId;
      this.pollsService.getPoll(params).subscribe(
        (response:any) => {
          response   = JSON.parse(response['_body']);
          if(response.success == 1){
            this.title = response.body.poll.title;
            this.getQuestions();
          }
        },
        (error) => {
        }
      )
    }
  }

  getQuestions() {
    if(this.pollId != ''){
      let params:any = {};
      params.poll_id = this.pollId;
      params.token   = this.userDetails.token;
      this.pollsService.getQuestions(params).subscribe(
        (response:any) => {
          response   = JSON.parse(response['_body']);
          let questions = response.body.questions;
          for(let k=0; k<questions.length; k++){
            let questionObj:any = {};
            questionObj.question = questions[k].question;
            questionObj.type = questions[k].question_type;
            let optionsArray:any = [];
            let qOptions = JSON.parse(questions[k].options);
            
            for(let p=0; p<qOptions.length; p++){
              let questionOption:any = {};
              questionOption.value = qOptions[p];
              optionsArray.push(questionOption);
            }

            questionObj.options = optionsArray;
            this.pollQuestions.push(questionObj);
          }
          this.loading = 0;
        },
        (error) => {
        }
      )
    }
  }

  getPollDetails() {
    if(this.pollId != ''){
      let params:any = {};
      params.poll_id = this.pollId;
      params.token   = this.userDetails.token;
      // params.meeting_id = this.meetingId;
      params.route_meeting_id = this.routeMeetingId;
      this.pollsService.getPollDetails(params).subscribe(
        (response:any) => {
          response   = JSON.parse(response['_body']);
          let pollDetails:any = [];
          pollDetails = response.body.poll_details;
          if(pollDetails.length > 0){
            this.title = pollDetails[0].title;
          }else{
            // this.router.navigateByUrl('/polls');
            if(this.roleId == '3'){
              this.router.navigateByUrl('/polls');  
            }else{
              this.router.navigateByUrl(this.urlPrefix + '/meetings/polls/' + this.routeMeetingId);  
            }
          }
          for(let k=0; k<pollDetails.length; k++){
            let questionObj:any = {};
            questionObj.question = pollDetails[k].question;
            questionObj.type = pollDetails[k].question_type;
            questionObj.id = pollDetails[k].id;
            // Changed - 23/10/2017
            // let optionsArray:any = [];
            // let qOptions = JSON.parse(pollDetails[k].options);
            // for(let p=0; p<qOptions.length; p++){
            //   let questionOption:any = {};
            //   questionOption.value = qOptions[p]; 
            //   optionsArray.push(questionOption);
            // }
            // Added - 23/10/2017
            let optionsArray = JSON.parse(pollDetails[k].options);
            questionObj.options = optionsArray;

            // Added - 18/01/2018
            let answer   = pollDetails[k].answer;
            let answerArray = [];
            if(answer){
              // answerArray   = answer.split(',');
              answerArray = answer.split(',').map(function(item) {
                  return parseInt(item, 10);
              });
            }
            // console.log(answerArray);
            let rightAnswersArray:any = [];
            for(let i=0; i<questionObj.options.length; i++){
              
              // New feature
              let rightAns:any = {};
              rightAns.value = questionObj.options[i].value;

              rightAns.checked = false;
              rightAns.answer = '';

              // rightAns.checked = false;
              // rightAns.answer = '';

              // if(answerArray.indexOf((questionObj.options[i].value).toString()) >= 0){
              if(answerArray.indexOf((questionObj.options[i].value)) >= 0){
                // questionObj.options[i].checked = true;
                // New feature
                rightAns.checked = true;
              }else{
                // questionObj.options[i].checked = false;
              }
              // questionObj.options[i].answers = answerArray;
              questionObj.answers = answerArray;
              
              // questionObj.options[i].answer = '';
              if(questionObj.type == '2' || questionObj.type == '5'){
                // console.log('Type ok' + questionObj.type);
                // console.log(answerArray);
                // console.log(questionObj.options[i].value);
                // if(answerArray.indexOf((questionObj.options[i].value).toString()) >= 0){
                if(answerArray.indexOf((questionObj.options[i].value)) >= 0){
                  // New feature
                  rightAns.answer = questionObj.options[i].value.toString();
                  // console.log('enter');
                  // questionObj.options[i].answer = questionObj.options[i].value.toString();
                  // questionObj.options[i].answer = questionObj.options[i].value;
                }
              }
              // New feature
              rightAnswersArray.push(rightAns);
              questionObj.rightAnswers = rightAnswersArray;
            }


            this.pollQuestions.push(questionObj);
            // console.log(this.pollQuestions);
          }
          this.loading = 0;
          this.allDataFetched = true;
        },
        (error) => {
        }
      )
    }
  }

  /**
   * Cancel poll
   */
  cancelPoll() {
    $("#cancel-save").modal({'show': true});
  }

  customTrackBy(index: number, obj: any): any {
    return index;
  }

  showError(msg) {
    this.toastrService.error(msg, 'Failure!');
  }

  showSuccess(msg) {
    this.toastrService.success(msg, 'Success!');
  }

}
