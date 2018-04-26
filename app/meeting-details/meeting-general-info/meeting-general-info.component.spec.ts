import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetingGeneralInfoComponent } from './meeting-general-info.component';

describe('MeetingGeneralInfoComponent', () => {
  let component: MeetingGeneralInfoComponent;
  let fixture: ComponentFixture<MeetingGeneralInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MeetingGeneralInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeetingGeneralInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
