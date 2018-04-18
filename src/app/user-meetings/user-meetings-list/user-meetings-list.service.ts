import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Config } from 'app/config/config';

declare var google;
declare var geocoder;

@Injectable()
export class UserMeetingsListService {

  // public geocoder;

  constructor(private http: Http) { }

  getUserMeetings(params) {
      let headers     = new Headers({'Content-Type': 'application/json'});
      let options     = new RequestOptions({headers: headers, method: 'post'});
      return this.http.post(Config.BASE_API_URL+'meetings/get_user_meetings', JSON.stringify(params)); 
      // return this.http.post(Config.BASE_API_URL+'meetings/get_events', JSON.stringify(params)); 
  }

  getUserMeetingsCalendar(params) {
    let headers     = new Headers({'Content-Type': 'application/json'});
    let options     = new RequestOptions({headers: headers, method: 'post'});
    return this.http.post(Config.BASE_API_URL+'meetings/get_user_meetings_calendar', JSON.stringify(params));
  }

  getUserMeeting(params) {
      let headers     = new Headers({'Content-Type': 'application/json'});
      let options     = new RequestOptions({headers: headers, method: 'post'});
      return this.http.post(Config.BASE_API_URL+'meetings/get_user_meeting', JSON.stringify(params)); 
  }

  getMeetingAccount(params) {
    let headers     = new Headers({'Content-Type': 'application/json'});
    let options     = new RequestOptions({headers: headers, method: 'post'});
    return this.http.post(Config.BASE_API_URL+'meetings/get_meeting_account', JSON.stringify(params)); 
  }

  getLocation(params): Observable<any> {
    return Observable.create(observer => {
      var latlng = new google.maps.LatLng(params.lat, params.lng);
      geocoder.geocode({
        'latLng': latlng
      }, function (results, status) {
        if (status === google.maps.GeocoderStatus.OK) {
          if (results[0]) {
            let fullPlace =  results[0].formatted_address;
            //find country name
            let city;
            for (var i=0; i<results[0].address_components.length; i++) {
              for (var b=0;b<results[0].address_components[i].types.length;b++) {
                if (results[0].address_components[i].types[b] == "administrative_area_level_1") {
                  //this is the object you are looking for
                  city = results[0].address_components[i];
                  break;
                }
              }
            }
            //city data
            observer.next(city.long_name);
            observer.complete();
          } else {
            // alert('No results found');
            observer.error('No results found');
          }
        } else {
          // alert('Geocoder failed due to: ' + status);
          observer.error('Geocoder failed due to: ' + status);
        }
      });
        // if(window.navigator && window.navigator.geolocation) {
        //     window.navigator.geolocation.getCurrentPosition(
        //         (position) => {
        //             observer.next(position);
        //             observer.complete();
        //         },
        //         (error) => observer.error(error)
        //     );
        // } else {
        //     observer.error('Unsupported Browser');
        // }
    });
}

meetingRejoin(params){
      let headers     = new Headers({'Content-Type': 'application/json'});
      let options     = new RequestOptions({headers: headers, method: 'post'});
      return this.http.post(Config.BASE_API_URL+'invitations/rejoin_users', JSON.stringify(params));
}
    
  /**
   * Get user meetings
   * @param params 
   */
  getUserEvents(params) {
      let headers     = new Headers({'Content-Type': 'application/json'});
      let options     = new RequestOptions({headers: headers, method: 'post'});
      return this.http.post(Config.BASE_API_URL+'meetings/get_user_events', JSON.stringify(params)); 
  }

  /**
   * Re Invite meeting (Reschedule)
   * @param params 
   */
  reInvite(params) {
    let headers     = new Headers({'Content-Type': 'application/json'});
    let options     = new RequestOptions({headers: headers, method: 'post'});
    return this.http.post(Config.BASE_API_URL+'schedules/reschedule', JSON.stringify(params)); 
  }

}
