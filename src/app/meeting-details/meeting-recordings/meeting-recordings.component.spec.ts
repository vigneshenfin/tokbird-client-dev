import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetingRecordingsComponent } from './meeting-recordings.component';

describe('MeetingRecordingsComponent', () => {
  let component: MeetingRecordingsComponent;
  let fixture: ComponentFixture<MeetingRecordingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MeetingRecordingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeetingRecordingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
