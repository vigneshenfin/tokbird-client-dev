import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from 'app/shared/user';
import { PollsService } from 'app/polls/polls.service';

@Component({
  selector: 'app-view-poll',
  templateUrl: './view-poll.component.html',
  styleUrls: ['./view-poll.component.css'],
  providers: [PollsService]
})
export class ViewPollComponent implements OnInit {
  public userDetails;
  public pollQuestions:any = [];
  public pollId = '';
  public title = '';
  allDataFetched: boolean = false;
  public roleId;
  public urlPrefix = '';
  // public meetingId;
  public routeMeetingId;
  
  constructor(private router:Router, private activatedRoute:ActivatedRoute, private pollsService:PollsService, private user:User) {
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
    this.activatedRoute.params.subscribe((params: Params) => {
      this.pollId   = params['pollId'];
      if(params['meetingId']){
        // this.meetingId   = params['meetingId'];
        this.routeMeetingId = params['meetingId'];
      }
    });
    // this.getPoll();
    // this.getPollDetails();

    // Added - 14/11/2017
    if(this.roleId != '3'){
      // Admin/Facilitator
        // if(this.meetingId != ''){
        if(this.routeMeetingId != ''){
          this.getPollDetails();
        }else{
          this.router.navigateByUrl(this.urlPrefix + '/events-calendar');
        }
    }else{
      this.getPollDetails();
    }
    
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
            questionObj.options = JSON.parse(questions[k].options);
            this.pollQuestions.push(questionObj);
          }
          this.allDataFetched = true;
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
      // Added - 14/11/2017
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
            if(this.roleId != '3'){
              this.router.navigateByUrl(this.urlPrefix + '/polls/' + this.routeMeetingId);
            }else{
              this.router.navigateByUrl('/polls');
            }
          }
          for(let k=0; k<pollDetails.length; k++){

            // New feature
            let answer   = pollDetails[k].answer;
            let answerArray = [];
            if(answer){
              answerArray = answer.split(',').map(function(item) {
                  return parseInt(item, 10);
              });
            }

            let questionObj:any = {};
            questionObj.question = pollDetails[k].question;
            questionObj.type = pollDetails[k].question_type;
            questionObj.options = JSON.parse(pollDetails[k].options);

            // New feature
            for(let i=0; i<questionObj.options.length; i++){
              questionObj.options[i].checked = false;
              if(answerArray.indexOf((questionObj.options[i].value)) >= 0){
                questionObj.options[i].checked = true;
              }
            }

            this.pollQuestions.push(questionObj);
          }
          this.allDataFetched = true;
        },
        (error) => {
        }
      )
    }
  }

}
