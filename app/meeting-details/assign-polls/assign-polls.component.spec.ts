import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignPollsComponent } from './assign-polls.component';

describe('AssignPollsComponent', () => {
  let component: AssignPollsComponent;
  let fixture: ComponentFixture<AssignPollsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignPollsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignPollsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
