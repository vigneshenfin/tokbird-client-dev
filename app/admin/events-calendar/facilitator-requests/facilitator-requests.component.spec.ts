import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FacilitatorRequestsComponent } from './facilitator-requests.component';

describe('FacilitatorRequestsComponent', () => {
  let component: FacilitatorRequestsComponent;
  let fixture: ComponentFixture<FacilitatorRequestsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FacilitatorRequestsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FacilitatorRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
