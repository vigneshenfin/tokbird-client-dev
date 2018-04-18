import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SetPasswordFacilitatorComponent } from './set-password-facilitator.component';

describe('SetPasswordFacilitatorComponent', () => {
  let component: SetPasswordFacilitatorComponent;
  let fixture: ComponentFixture<SetPasswordFacilitatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SetPasswordFacilitatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetPasswordFacilitatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
