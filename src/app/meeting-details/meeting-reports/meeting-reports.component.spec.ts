import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetingReportsComponent } from './meeting-reports.component';

describe('MeetingReportsComponent', () => {
  let component: MeetingReportsComponent;
  let fixture: ComponentFixture<MeetingReportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MeetingReportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeetingReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
