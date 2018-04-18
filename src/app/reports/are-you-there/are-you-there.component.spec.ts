import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AreYouThereComponent } from './are-you-there.component';

describe('AreYouThereComponent', () => {
  let component: AreYouThereComponent;
  let fixture: ComponentFixture<AreYouThereComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AreYouThereComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AreYouThereComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
