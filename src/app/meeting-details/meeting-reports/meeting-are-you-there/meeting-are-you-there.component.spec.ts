import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetingAreYouThereComponent } from './meeting-are-you-there.component';

describe('MeetingAreYouThereComponent', () => {
  let component: MeetingAreYouThereComponent;
  let fixture: ComponentFixture<MeetingAreYouThereComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MeetingAreYouThereComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeetingAreYouThereComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
