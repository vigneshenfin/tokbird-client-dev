import { Component, OnInit, Input } from '@angular/core';
import { ReportsService } from 'app/reports/reports.service';
import { MeetingReportsService } from 'app/meeting-details/meeting-reports/meeting-reports.service';
import { User } from "app/shared/user";
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs';
declare var $:any;
declare var google:any;
declare var map:any;
declare var MarkerClusterer:any;
declare var OverlappingMarkerSpiderfier:any;

@Component({
  selector: 'app-meeting-location',
  templateUrl: './meeting-location.component.html',
  styleUrls: ['./meeting-location.component.css'],
  providers: [ReportsService, MeetingReportsService]
})

export class MeetingLocationComponent implements OnInit {

  @Input() locations:any;
  @Input() locationRecords:any;
  @Input() locSearchParams:any;
  @Input() locationStatus:any;
  @Input() selectedTab:any;
  @Input() routeMeetingId;

  private _scheduleId: string;
  @Input() set scheduleId(value: string) {
    this._scheduleId = value;
    this.getLocations();
  }
  get scheduleId(): string {
      return this._scheduleId;
  }

  public locationDetails:any = [];
  public locationRecordDetails:any = [];
  public locSearchParamsDetails:any = {};
  p: number = 1;
  public locationsLimit = 10;
  public locationsOffset = 1;
  public userDetails:any = [];
  locationsBusy: Subscription;

  constructor(private user:User, private reportsService:ReportsService, private router:Router, private meetingReportsService:MeetingReportsService) { 
    this.userDetails   = user.getUser();
  }

  ngOnInit() {
  }

  ngOnChanges() {
    if(this.selectedTab == 'location'){
        this.getLocations();
    }
    // this.locationDetails = this.locations;
    // this.locationRecordDetails = this.locationRecords;
    this.locSearchParamsDetails = this.locSearchParams;
    this.p = 1;
    if(this.locationStatus == 1){
    }else{
    }
  }

  /**
   * Get attendee locations when page changes
   * @param event 
   */
  pageChanged(event) {
    this.locationsOffset = event;
    this.getLocations();
  }

  /**
   * Get attendee locations
   */
  getLocations()
  {
    let params:any = {};
    params.token = this.userDetails.token;
    params.limit = this.locationsLimit;
    params.offset = this.locationsOffset;
    params.meeting_ids = this.locSearchParamsDetails.meetingsIds;
    params.schedule_id = this.scheduleId;
    params.route_meeting_id = this.routeMeetingId;
    // this.locationsBusy = this.reportsService.locations(params).subscribe(
    this.locationsBusy = this.meetingReportsService.locations(params).subscribe(
      (response:any) => {
        response   = JSON.parse(response['_body']);
          this.locationDetails = [];
          if(response.success == 1){
            this.p = this.locationsOffset;
            let locations = response.body.locations;
            for(let i=0; i<locations.length; i++){
              let attendeeLocation:any = {};
              attendeeLocation.lat = locations[i].lattitude;
              attendeeLocation.lng = locations[i].longitude;
              attendeeLocation.label = locations[i].label; 
              attendeeLocation.firstName = '';
              attendeeLocation.lastName = '';
              let details = JSON.parse(locations[i].details);
              for(let j=0; j<details.length; j++){
                if(details[j].field == 'first_name'){
                  attendeeLocation.firstName = details[j].value;
                }
                if(details[j].field == 'last_name'){
                  attendeeLocation.lastName = details[j].value;
                }
              }
              this.locationDetails.push(attendeeLocation);
            }
            this.locationRecordDetails = response.body.records;
            this.loadGoogleMap();
            // google.maps.event.trigger(map, 'resize');
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
   * Load google map with attendee locations
   */
  loadGoogleMap(){
    let locations = this.locationDetails;
    var mapOptions = {
        // zoom: 12,
        zoom: 6,
        // center: new google.maps.LatLng(8.558113, 76.881562), // Techno park
        // zoom: 2, 
        center: ((locations[0] === undefined) ? new google.maps.LatLng(8.558113, 76.881562) : new google.maps.LatLng(locations[0].lat, locations[0].lng)),
        streetViewControl: false,
        styles: [{
            "featureType": "water",
            "elementType": "geometry",
            "stylers": [{
                "color": "#e9e9e9"
            }, {
                "lightness": 17
            }]
        }, {
            "featureType": "landscape",
            "elementType": "geometry",
            "stylers": [{
                "color": "#f5f5f5"
            }, {
                "lightness": 20
            }]
        }, {
            "featureType": "road.highway",
            "elementType": "geometry.fill",
            "stylers": [{
                "color": "#ffffff"
            }, {
                "lightness": 17
            }]
        }, {
            "featureType": "road.highway",
            "elementType": "geometry.stroke",
            "stylers": [{
                "color": "#ffffff"
            }, {
                "lightness": 29
            }, {
                "weight": 0.2
            }]
        }, {
            "featureType": "road.arterial",
            "elementType": "geometry",
            "stylers": [{
                "color": "#ffffff"
            }, {
                "lightness": 18
            }]
        }, {
            "featureType": "road.local",
            "elementType": "geometry",
            "stylers": [{
                "color": "#e5e5e5"
            }, {
                "lightness": 16
            }]
        }, {
            "featureType": "poi",
            "elementType": "geometry",
            "stylers": [{
                "color": "#f5f5f5"
            }, {
                "lightness": 21
            }]
        }, {
            "featureType": "poi.park",
            "elementType": "geometry",
            "stylers": [{
                "color": "#dedede"
            }, {
                "lightness": 21
            }]
        }, {
            "elementType": "labels.text.stroke",
            "stylers": [{
                "visibility": "on"
            }, {
                "color": "#ffffff"
            }, {
                "lightness": 16
            }]
        }, {
            "elementType": "labels.text.fill",
            "stylers": [{
                "saturation": 36
            }, {
                "color": "#333333"
            }, {
                "lightness": 40
            }]
        }, {
            "elementType": "labels.icon",
            "stylers": [{
                "visibility": "off"
            }]
        }, {
            "featureType": "transit",
            "elementType": "geometry",
            "stylers": [{
                "color": "#f2f2f2"
            }, {
                "lightness": 19
            }]
        }, {
            "featureType": "administrative",
            "elementType": "geometry.fill",
            "stylers": [{
                "color": "#fefefe"
            }, {
                "lightness": 20
            }]
        }, {
            "featureType": "administrative",
            "elementType": "geometry.stroke",
            "stylers": [{
                "color": "#fefefe"
            }, {
                "lightness": 17
            }, {
                "weight": 1.2
            }]
        }]
    };
    // Get the HTML DOM element that will contain your map           
    var mapElement = document.getElementById('map');
    // Create the Google Map using our element and options defined above
    var map = new google.maps.Map(mapElement, mapOptions);
    // Let's also add a marker while we're at it
    var marker, i;
    var spiderConfig = {
        keepSpiderfied: true,
        event: 'mouseover'
    };
    var markerSpiderfier = new OverlappingMarkerSpiderfier(map, spiderConfig);
    var markers = [];
    // var bounds = new google.maps.LatLngBounds();
    for (i = 0; i < locations.length; i++) { 
        var marker = new google.maps.Marker({
            position: new google.maps.LatLng(locations[i].lat, locations[i].lng),
            map: map,
            // title: locations[i].label,
            // title: locations[i].firstName + ' ' + locations[i].lastName,
            infoTitle: locations[i].firstName + ' ' + locations[i].lastName,
        });
        marker.setIcon('assets/images/marker.svg');
        markers.push(marker);
        markerSpiderfier.addMarker(marker);  // Adds the Marker to OverlappingMarkerSpiderfier
        //extend the bounds to include each marker's position
        // bounds.extend(marker.position);
    }
    var iw = new google.maps.InfoWindow();
    markerSpiderfier.addListener('click', function(marker, e) {
        // iw.setContent(marker.title);
        iw.setContent(marker.infoTitle);
        iw.open(map, marker);
    });
    markerSpiderfier.addListener('spiderfy', function(markers) {
        iw.close();
    });
    // var markerCluster = new MarkerClusterer(map, markers);
    var markerCluster = new MarkerClusterer(map, markers, {imagePath: 'assets/images/m'});
    markerCluster.setMaxZoom(15);
    // markerCluster.setZoom(7);
    //  Create a new viewpoint bound
    var bounds = new google.maps.LatLngBounds();
    //  Go through each...
    // let k = 0;
    $.each(markers, function (index, marker) {
        // k++;
        bounds.extend(marker.position);
    });
    //  Fit these bounds to the map
    // map.fitBounds(bounds);
    // if(k == markers.length){
    //     google.maps.event.trigger(map, 'resize');
    // }
    // setTimeout(function() {
    //     google.maps.event.trigger(map, 'resize');
    // }, 4000);
    // if(this.hasMap('map')){
        // google.maps.event.trigger(map, "resize");
    // }
    // setTimeout( () => {google.maps.event.trigger(map, 'resize');}, 1000);
  }

   hasMap( id ) {
        return !! document.getElementById(id).firstChild;
    }

}
