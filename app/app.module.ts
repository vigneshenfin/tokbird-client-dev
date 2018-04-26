import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { Angular2SocialLoginModule } from "angular2-social-login";
import { AppComponent } from './app.component';
import { HomeComponent } from './theme/home/home.component';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { HeaderComponent } from './theme/header/header.component';
import { FooterComponent } from './theme/footer/footer.component';
import { RegisterComponent } from './register/register.component';
// import { DatePickerModule } from 'angular-io-datepicker';
import { TagInputModule } from 'ngx-chips';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // this is needed! 
// import { BootstrapModalModule } from 'ng2-bootstrap-modal';
import { DataTableModule } from "angular2-datatable";
import { DataFilterPipe } from "./data-filter.pipe";
import { MeetinginfoComponent } from './meetinginfo/meetinginfo.component';
import { ForgotComponent } from './forgot/forgot.component';
import { ContactComponent } from './theme/home/contact/contact.component';
import { ResetCheckComponent } from './reset-check/reset-check.component';
import { SocialLoginComponent } from './social-login/social-login.component';
import { User } from "app/shared/user";
import { AuthGuard } from "app/shared/auth.guard";
import { AdminAuthGuard } from "app/shared/admin.auth.guard";
import { FacilitatorAuthGuard } from "app/shared/facilitator.auth.guard";
import { SessionCheck } from "app/shared/session.check";
import { DateTimePickerModule } from 'ng-pick-datetime';
import { MeetingInfoComponent } from './meeting-info/meeting-info.component';
import { StorageService } from "app/shared/storage.service";
import { InviteUserComponent } from './invite-user/invite-user.component';
import { TinymceModule } from 'angular2-tinymce';
import { SendNotificationComponent } from './send-notification/send-notification.component';
import { MeetingSidebarComponent } from './meeting-sidebar/meeting-sidebar.component';
import { MeetingContentComponent } from './meeting-content/meeting-content.component';
import { ToastModule } from 'ng2-toastr/ng2-toastr';
import { MeetingsListComponent } from './meeting/meetings-list/meetings-list.component';
import { CalendarViewComponent } from './meeting/meetings-list/calendar-view/calendar-view.component';
import { ListViewComponent } from './meeting/meetings-list/list-view/list-view.component';
import { MeetingComponent } from './meeting/meeting.component';
import { MeetingSecuritySettingsComponent } from './meeting-security-settings/meeting-security-settings.component';
import { GeneralInfoComponent } from './meeting/general-info/general-info.component';
import { SettingsComponent } from './settings/settings.component';
import { PreRegistrationTemplatesComponent } from './settings/pre-registration-templates/pre-registration-templates.component';
import { InMeetingTemplatesComponent } from './settings/in-meeting-templates/in-meeting-templates.component';
import { InMeetingDesignComponent } from './settings/in-meeting-design/in-meeting-design.component';
import { PreRegistrationFormComponent } from './pre-registration-form/pre-registration-form.component';
import { ToastrModule } from 'toastr-ng2';
import { ColorPickerModule } from 'ngx-color-picker';
import { ConfirmationPopoverModule } from 'angular-confirmation-popover';
import { ReportsComponent } from './reports/reports.component';
import { MeetingsComponent } from './reports/meetings/meetings.component';
import { DashboardComponent } from './reports/dashboard/dashboard.component';
import { AttendanceComponent } from './reports/attendance/attendance.component';
import { LocationComponent } from './reports/location/location.component';
import { FontPickerModule } from 'ngx-font-picker';
import { FontPickerConfigInterface } from 'ngx-font-picker';
import { NgxPaginationModule } from 'ngx-pagination'; // <-- import the module
import { BusyModule } from 'angular2-busy';
// import { AgmCoreModule } from '@agm/core';
import { AgmCoreModule } from '@agm/core';
import { ProfileComponent } from './profile/profile.component';
import { PollsComponent } from './polls/polls.component';
import { CreatePollComponent } from './polls/create-poll/create-poll.component';
import { ViewPollComponent } from './polls/view-poll/view-poll.component';
import { MeetingDetailsComponent } from './meeting-details/meeting-details.component';
import { InviteUsersComponent } from './meeting-details/invite-users/invite-users.component';
import { SendNotificationsComponent } from './meeting-details/send-notifications/send-notifications.component';
import { SecuritySettingsComponent } from './meeting-details/security-settings/security-settings.component';
import { MeetingReportsComponent } from './meeting-details/meeting-reports/meeting-reports.component';
import { RegistrationFormComponent } from './meeting-details/registration-form/registration-form.component';
import { MeetingRecordingsComponent } from './meeting-details/meeting-recordings/meeting-recordings.component';
import { QuestionsAnswersComponent } from './meeting-details/questions-answers/questions-answers.component';
import { MeetingGeneralInfoComponent } from './meeting-details/meeting-general-info/meeting-general-info.component';
import { ContentComponent } from './meeting-details/content/content.component';
import { SidebarComponent } from './meeting-details/sidebar/sidebar.component';
import { MeetingAttendanceComponent } from './meeting-details/meeting-reports/meeting-attendance/meeting-attendance.component';
import { MeetingDashboardComponent } from './meeting-details/meeting-reports/meeting-dashboard/meeting-dashboard.component';
import { MeetingPollsComponent } from './meeting-details/meeting-reports/meeting-polls/meeting-polls.component';
import { MeetingLocationComponent } from './meeting-details/meeting-reports/meeting-location/meeting-location.component';
import { AdminComponent } from './admin/admin.component';
import { AdminLoginComponent } from './admin/admin-login/admin-login.component';
import { EventsCalendarComponent } from './admin/events-calendar/events-calendar.component';
import { FacilitatorRequestsComponent } from './admin/events-calendar/facilitator-requests/facilitator-requests.component';
import { FacilitatorsComponent } from './admin/facilitators/facilitators.component';
import { UsersComponent } from './admin/users/users.component';
import { LogsComponent } from './admin/logs/logs.component';
import { AdminHeaderComponent } from './admin/admin-header/admin-header.component';
import { AdminFooterComponent } from './admin/admin-footer/admin-footer.component';
import { AdminProfileComponent } from './admin/admin-profile/admin-profile.component';
import { CalendarModule} from "ap-angular2-fullcalendar";
import { SetPasswordFacilitatorComponent } from './facilitator/set-password-facilitator/set-password-facilitator.component';
import { FacilitatorComponent } from './facilitator/facilitator.component';
import { ViewUserComponent } from './admin/users/view-user/view-user.component';
import { UserMeetingsComponent } from './user-meetings/user-meetings.component';
import { UserMeetingsListComponent } from './user-meetings/user-meetings-list/user-meetings-list.component';
import { MeetingsCalendarViewComponent } from './user-meetings/user-meetings-list/meetings-calendar-view/meetings-calendar-view.component';
import { MeetingsListViewComponent } from './user-meetings/user-meetings-list/meetings-list-view/meetings-list-view.component';
import { UserPastMeetingsComponent } from './user-meetings/user-meetings-list/meetings-list-view/user-past-meetings/user-past-meetings.component';
import { UserFutureMeetingsComponent } from './user-meetings/user-meetings-list/meetings-list-view/user-future-meetings/user-future-meetings.component';
import { LicenceAgreementComponent } from './info-pages/licence-agreement/licence-agreement.component';
import { TermsAndConditionsComponent } from './info-pages/terms-and-conditions/terms-and-conditions.component';
import { PrivacyPolicyComponent } from './info-pages/privacy-policy/privacy-policy.component';
import { InfoHeaderComponent } from './info-pages/info-header/info-header.component';
import { MeetingAreYouThereComponent } from './meeting-details/meeting-reports/meeting-are-you-there/meeting-are-you-there.component';
import { AreYouThereComponent } from './reports/are-you-there/are-you-there.component';
import { AssignPollsComponent } from './meeting-details/assign-polls/assign-polls.component';
import { TinyMceModule } from 'angular-tinymce';
import { DomainSettingsComponent } from './domain-settings/domain-settings.component';
import { StandBySettingsComponent } from './meeting-details/stand-by-settings/stand-by-settings.component';
import { AllEventsCalendarComponent } from './admin/all-events-calendar/all-events-calendar.component';
import { AllEventsListComponent } from './admin/all-events-list/all-events-list.component';
import { MeetingUsersComponent } from './meeting-details/meeting-users/meeting-users.component';

import { MainPipe } from 'app/shared/main-pipe.module';
import { LearnersComponent } from './learners/learners.component';
// import {A2Edatetimepicker} from 'ng2-eonasdan-datetimepicker';
// import { DateTimePickerDirective } from 'ng2-eonasdan-datetimepicker';
// import { DateTimePickerDirective } from 'ng2-eonasdan-datetimepicker/dist/datetimepicker.directive';
// import datetimepicker from 'eonasdan-bootstrap-datetimepicker';
// import {  TruncatePipe }   from './app.pipe';

// import { DateTimePickerDirective } from 'ng2-eonasdan-datetimepicker/dist/datetimepicker.directive';
// import 'eonasdan-bootstrap-datetimepicker';


let providers = {
    "google": {
      "clientId": "132854456518-1v5cpsrn2vh87lmthbe8mpnb51sru39b.apps.googleusercontent.com"
    },
    // "linkedin": {
    //   "clientId": "LINKEDIN_CLIENT_ID"
    // },
    "facebook": {
      "clientId": "123214654974841",
      "apiVersion": "v2.10" //like v2.4
    }
  
};

const FONT_PICKER_CONFIG: FontPickerConfigInterface = {
  // your Google web font API key
  apiKey: 'AIzaSyBpyteouQAYkBTPKBZhgRJkp3doIqilM7U'
};


const tokRoutes: Routes = [
 //Registered users Routes
 {path:'', component: HomeComponent,canActivate:[SessionCheck]},
 // Used in account activation confirmation mail inorder to display reset password option even if the user logged into their account
 {path:'reset-password', component: HomeComponent},
 {path:'home', component: HomeComponent,canActivate:[SessionCheck]},
 {path:'schedule-meeting', component: ScheduleComponent,canActivate:[AuthGuard]},
 {path:'reset-password/:id/:email', component: ResetCheckComponent},
 {path:'link-expired', component: HomeComponent},
 {path:'account-activated', component: HomeComponent},
 {path:'invite-user/:meetingId', component: InviteUserComponent,canActivate:[AuthGuard]},
 {path:'meeting/send-notification/:meetingId', component: SendNotificationComponent,canActivate:[AuthGuard]},
 {path:'meeting/meeting-content/:meetingId', component: MeetingContentComponent,canActivate:[AuthGuard]},
//  Changed - 22/11/2017
//  {path:'meetings-list', component: MeetingsListComponent,canActivate:[AuthGuard]},
 {path:'meetings-list', component: UserMeetingsListComponent,canActivate:[AuthGuard]},
 {path:'meeting/edit/:meetingId', component: ScheduleComponent,canActivate:[AuthGuard]},
 {path:'meeting/security/:meetingId', component: MeetingSecuritySettingsComponent,canActivate:[AuthGuard]},
 {path:'meeting/general-info/:meetingId', component: GeneralInfoComponent,canActivate:[AuthGuard]},
 {path:'domain-settings', component: DomainSettingsComponent,canActivate:[AuthGuard]},
 {path:'settings', component: SettingsComponent,canActivate:[AuthGuard]},
 {path:'meeting/pre-registration-form/:meetingId', component: PreRegistrationFormComponent,canActivate:[AuthGuard]},
 {path:'reports', component: ReportsComponent, canActivate:[AuthGuard]},
 {path:'user-profile', component: ProfileComponent,canActivate:[AuthGuard]},
 {path:'user-profile#subscription', component: ProfileComponent,canActivate:[AuthGuard]},
 {path:'polls', component: PollsComponent, canActivate:[AuthGuard]},
 {path:'polls/create', component: CreatePollComponent, canActivate:[AuthGuard]},
 {path:'polls/view/:pollId', component: ViewPollComponent, canActivate:[AuthGuard]},
 {path:'polls/edit/:pollId', component: CreatePollComponent, canActivate:[AuthGuard]},
 {path:'polls/create/:meetingId', component: CreatePollComponent, canActivate:[AuthGuard]},
 {path:'polls/create/:meetingId/:assignPoll', component: CreatePollComponent, canActivate:[AuthGuard]},

 {path:'meetings/general-info/:meetingId', component: MeetingGeneralInfoComponent, canActivate:[AuthGuard]},
 {path:'meetings/reports/:meetingId', component: MeetingReportsComponent, canActivate:[AuthGuard]},
 {path:'meetings/send-notifications/:meetingId', component: SendNotificationsComponent, canActivate:[AuthGuard]},
 {path:'meetings/invite-users/:meetingId', component: InviteUsersComponent, canActivate:[AuthGuard]},
 {path:'meetings/re-invite-users/:meetingId', component: InviteUsersComponent, canActivate:[AuthGuard]},
 {path:'meetings/pre-registration-form/:meetingId', component: RegistrationFormComponent, canActivate:[AuthGuard]},
 {path:'meetings/security-settings/:meetingId', component: SecuritySettingsComponent, canActivate:[AuthGuard]},
 {path:'meetings/meeting-content/:meetingId', component: ContentComponent, canActivate:[AuthGuard]},
 {path:'meetings/assign-polls/:meetingId', component: AssignPollsComponent, canActivate:[AuthGuard]},
 {path:'meetings/recordings/:meetingId', component: MeetingRecordingsComponent, canActivate:[AuthGuard]},
 {path:'meetings/question-answers/:meetingId', component: QuestionsAnswersComponent, canActivate:[AuthGuard]},
 {path:'meetings/location-settings/:meetingId', component: StandBySettingsComponent, canActivate:[AuthGuard]},
 {path:'meetings/registered/:meetingId', component: MeetingUsersComponent, canActivate:[AuthGuard]},
 {path:'meetings/attended/:meetingId', component: MeetingUsersComponent, canActivate:[AuthGuard]},
 {path:'meetings/watched/:meetingId', component: MeetingUsersComponent, canActivate:[AuthGuard]},
 {path:'learners', component: LearnersComponent, canActivate:[AuthGuard]},

 //Admin Routes HEAD
  {path:'admin/login', component: AdminLoginComponent,canActivate:[SessionCheck]},
  {path:'admin/events-calendar', component: EventsCalendarComponent,canActivate:[AdminAuthGuard]},
  {path:'admin/profile', component: AdminProfileComponent,canActivate:[AdminAuthGuard]},
  {path:'admin/facilitators', component: FacilitatorsComponent,canActivate:[AdminAuthGuard]},
  {path:'admin/meetings/general-info/:meetingId', component: MeetingGeneralInfoComponent, canActivate:[AdminAuthGuard]},
  {path:'admin/users', component: UsersComponent,canActivate:[AdminAuthGuard]},
  {path:'admin/view-user/:userId', component: ViewUserComponent,canActivate:[AdminAuthGuard]},
  {path:'admin/meeting/edit/:meetingId', component: ScheduleComponent,canActivate:[AdminAuthGuard]},
  {path:'admin/logs', component: LogsComponent,canActivate:[AdminAuthGuard]},
  {path:'admin/meetings/invite-users/:meetingId', component: InviteUsersComponent, canActivate:[AdminAuthGuard]},
  {path:'admin/meetings/pre-registration-form/:meetingId', component: RegistrationFormComponent, canActivate:[AdminAuthGuard]},
  {path:'admin/meetings/polls/:meetingId', component: PollsComponent, canActivate:[AdminAuthGuard]},
  {path:'admin/meetings/polls/create/:meetingId', component: CreatePollComponent, canActivate:[AdminAuthGuard]},
  {path:'admin/meetings/polls/create/:meetingId/:assignPoll', component: CreatePollComponent, canActivate:[AdminAuthGuard]},
  {path:'admin/meetings/polls/edit/:meetingId/:pollId', component: CreatePollComponent, canActivate:[AdminAuthGuard]},
  {path:'admin/meetings/polls/view/:meetingId/:pollId', component: ViewPollComponent, canActivate:[AdminAuthGuard]},
  {path:'admin/meetings/send-notifications/:meetingId', component: SendNotificationsComponent, canActivate:[AdminAuthGuard]},
  {path:'admin/meetings/security-settings/:meetingId', component: SecuritySettingsComponent, canActivate:[AdminAuthGuard]},
  {path:'admin/meetings/meeting-content/:meetingId', component: ContentComponent, canActivate:[AdminAuthGuard]},
  {path:'admin/settings/:meetingId', component: SettingsComponent,canActivate:[AdminAuthGuard]},
  {path:'admin/reports/:meetingId', component: ReportsComponent, canActivate:[AdminAuthGuard]},
  {path:'admin/meetings/recordings/:meetingId', component: MeetingRecordingsComponent, canActivate:[AdminAuthGuard]},
  {path:'admin/meetings/question-answers/:meetingId', component: QuestionsAnswersComponent, canActivate:[AdminAuthGuard]},
  {path:'admin/meetings/reports/:meetingId', component: MeetingReportsComponent, canActivate:[AdminAuthGuard]},
  {path:'admin/meetings/list/:meetingId', component: UserMeetingsListComponent, canActivate:[AdminAuthGuard]},
  {path:'admin/meetings/assign-polls/:meetingId', component: AssignPollsComponent, canActivate:[AdminAuthGuard]},
  {path:'admin/meetings/location-settings/:meetingId', component: StandBySettingsComponent, canActivate:[AdminAuthGuard]},
  {path:'admin/meetings/registered/:meetingId', component: MeetingUsersComponent, canActivate:[AdminAuthGuard]},
  {path:'admin/meetings/attended/:meetingId', component: MeetingUsersComponent, canActivate:[AdminAuthGuard]},
  {path:'admin/meetings/watched/:meetingId', component: MeetingUsersComponent, canActivate:[AdminAuthGuard]},

//Facilitator Routes
  //{path:'events-calendar', component: EventsCalendarComponent,canActivate:[FacilitatorAuthGuard]},

//Facilitator Routes
  // {path:'facilitator/events-calendar', component: FacilitatorComponent,canActivate:[FacilitatorAuthGuard]},
  {path:'facilitator/events-calendar', component: EventsCalendarComponent,canActivate:[FacilitatorAuthGuard]},
  {path:'set-password/:id/:email', component: SetPasswordFacilitatorComponent},
  {path:'facilitator/meetings/general-info/:meetingId', component: MeetingGeneralInfoComponent, canActivate:[FacilitatorAuthGuard]},
  {path:'facilitator/meeting/edit/:meetingId', component: ScheduleComponent,canActivate:[FacilitatorAuthGuard]},
  {path:'facilitator/meetings/invite-users/:meetingId', component: InviteUsersComponent, canActivate:[FacilitatorAuthGuard]},
  {path:'facilitator/meetings/pre-registration-form/:meetingId', component: RegistrationFormComponent, canActivate:[FacilitatorAuthGuard]},
  {path:'facilitator/meetings/polls/:meetingId', component: PollsComponent, canActivate:[FacilitatorAuthGuard]},
  {path:'facilitator/meetings/polls/create/:meetingId', component: CreatePollComponent, canActivate:[FacilitatorAuthGuard]},
  {path:'facilitator/meetings/polls/create/:meetingId/:assignPoll', component: CreatePollComponent, canActivate:[FacilitatorAuthGuard]},
  {path:'facilitator/meetings/polls/edit/:meetingId/:pollId', component: CreatePollComponent, canActivate:[FacilitatorAuthGuard]},
  {path:'facilitator/meetings/polls/view/:meetingId/:pollId', component: ViewPollComponent, canActivate:[FacilitatorAuthGuard]},
  {path:'facilitator/meetings/send-notifications/:meetingId', component: SendNotificationsComponent, canActivate:[FacilitatorAuthGuard]},
  {path:'facilitator/meetings/security-settings/:meetingId', component: SecuritySettingsComponent, canActivate:[FacilitatorAuthGuard]},
  {path:'facilitator/meetings/meeting-content/:meetingId', component: ContentComponent, canActivate:[FacilitatorAuthGuard]},
  {path:'facilitator/settings/:meetingId', component: SettingsComponent,canActivate:[FacilitatorAuthGuard]},
  {path:'facilitator/profile', component: AdminProfileComponent,canActivate:[FacilitatorAuthGuard]},
  {path:'facilitator/reports/:meetingId', component: ReportsComponent, canActivate:[FacilitatorAuthGuard]},
  {path:'facilitator/meetings/recordings/:meetingId', component: MeetingRecordingsComponent, canActivate:[FacilitatorAuthGuard]},
  {path:'facilitator/meetings/question-answers/:meetingId', component: QuestionsAnswersComponent, canActivate:[FacilitatorAuthGuard]},
  {path:'facilitator/meetings/reports/:meetingId', component: MeetingReportsComponent, canActivate:[FacilitatorAuthGuard]},
  {path:'facilitator/meetings/list/:meetingId', component: UserMeetingsListComponent, canActivate:[FacilitatorAuthGuard]},

  {path:'licence-agreement', component: LicenceAgreementComponent},
  {path:'privacy-policy', component: PrivacyPolicyComponent},
  {path:'terms-and-conditions', component: TermsAndConditionsComponent},

  {path:'all-events', component: AllEventsCalendarComponent},
  {path:'all-events-list', component: AllEventsListComponent},


];
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    ScheduleComponent,
    HeaderComponent,
    FooterComponent,
    RegisterComponent,
    MeetinginfoComponent,
    ForgotComponent,
    ContactComponent,
    ResetCheckComponent,
    SocialLoginComponent,
    MeetingInfoComponent,
    InviteUserComponent,
    SendNotificationComponent,
    MeetingSidebarComponent,
    MeetingContentComponent,
    MeetingsListComponent,
    CalendarViewComponent,
    ListViewComponent,
    MeetingComponent,
    MeetingSecuritySettingsComponent,
    GeneralInfoComponent,
    SettingsComponent,
    PreRegistrationTemplatesComponent,
    InMeetingTemplatesComponent,
    InMeetingDesignComponent,
    PreRegistrationFormComponent,
    DataFilterPipe,
    ReportsComponent,
    MeetingsComponent,
    DashboardComponent,
    AttendanceComponent,
    LocationComponent,
    ProfileComponent,
    PollsComponent,
    CreatePollComponent,
    ViewPollComponent,
    MeetingDetailsComponent,
    InviteUsersComponent,
    SendNotificationsComponent,
    SecuritySettingsComponent,
    MeetingReportsComponent,
    RegistrationFormComponent,
    MeetingRecordingsComponent,
    QuestionsAnswersComponent,
    MeetingGeneralInfoComponent,
    ContentComponent,
    SidebarComponent,
    MeetingAttendanceComponent,
    MeetingDashboardComponent,
    MeetingPollsComponent,
    MeetingLocationComponent,
    AdminComponent,
    AdminLoginComponent,
    EventsCalendarComponent,
    FacilitatorRequestsComponent,
    FacilitatorsComponent,
    UsersComponent,
    LogsComponent,
    AdminHeaderComponent,
    AdminFooterComponent,
    AdminProfileComponent,
    SetPasswordFacilitatorComponent,
    FacilitatorComponent,
    ViewUserComponent,
    UserMeetingsComponent,
    UserMeetingsListComponent,
    MeetingsCalendarViewComponent,
    MeetingsListViewComponent,
    UserPastMeetingsComponent,
    UserFutureMeetingsComponent,
    LicenceAgreementComponent,
    TermsAndConditionsComponent,
    PrivacyPolicyComponent,
    InfoHeaderComponent,
    MeetingAreYouThereComponent,
    AreYouThereComponent,
    AssignPollsComponent,
    DomainSettingsComponent,
    StandBySettingsComponent,
    AllEventsCalendarComponent,
    AllEventsListComponent,
    MeetingUsersComponent,
    LearnersComponent,
    // TruncatePipe
    // DateTimePickerDirective
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(tokRoutes),
    TagInputModule,
    BrowserAnimationsModule,
    DataTableModule,
    Angular2SocialLoginModule,
    DateTimePickerModule,
    TinymceModule.withConfig({
      skin_url: '/assets/skins/lightgray',
      // toolbar: 'fontselect',
      // font_formats: 'Arial=arial,helvetica,sans-serif;Courier New=courier new,courier,monospace;AkrutiKndPadmini=Akpdmi-n'
      // branding: false,
      // toolbar: [
      //   'bold italic underline strikethrough subscript superscript removeformat | formatselect | fontsizeselect | bullist numlist outdent indent | link table | code'
      // ],
      toolbar: [
          'undo redo | styleselect | fontselect | bold italic | alignleft aligncenter alignright justify | bullist numlist outdent indent | link'
        ]
    }),
    ReactiveFormsModule,
    ToastModule.forRoot(),
    ToastrModule.forRoot(), // ToastrModule added
    ConfirmationPopoverModule.forRoot({
      confirmButtonType: 'danger' // set defaults here
    }),
    [ColorPickerModule],
    FontPickerModule.forRoot(FONT_PICKER_CONFIG),
    NgxPaginationModule,
    BrowserAnimationsModule,
    BusyModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyC0j74FPzOPxMhkxG6OHnC3qSpd-Kd_x-E'
    }),
    CalendarModule,
    TinyMceModule.forRoot({
      skin_url: '/assets/skins/lightgray',
      branding: false,
      plugins: "table",
    }),
    MainPipe
    // A2Edatetimepicker
  ],
  entryComponents: [
    MeetinginfoComponent
  ],
  exports:[RouterModule],
  providers: [User,AuthGuard,AdminAuthGuard,FacilitatorAuthGuard,SessionCheck,StorageService],
  bootstrap: [AppComponent]
})
export class AppModule { }
Angular2SocialLoginModule.loadProvidersScripts(providers); 