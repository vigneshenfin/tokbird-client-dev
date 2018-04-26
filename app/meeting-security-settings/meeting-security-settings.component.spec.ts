import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetingSecuritySettingsComponent } from './meeting-security-settings.component';

describe('MeetingSecuritySettingsComponent', () => {
  let component: MeetingSecuritySettingsComponent;
  let fixture: ComponentFixture<MeetingSecuritySettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MeetingSecuritySettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeetingSecuritySettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
