import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetingContentComponent } from './meeting-content.component';

describe('MeetingContentComponent', () => {
  let component: MeetingContentComponent;
  let fixture: ComponentFixture<MeetingContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MeetingContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeetingContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
