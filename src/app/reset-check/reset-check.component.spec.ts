import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetCheckComponent } from './reset-check.component';

describe('ResetCheckComponent', () => {
  let component: ResetCheckComponent;
  let fixture: ComponentFixture<ResetCheckComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResetCheckComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResetCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
