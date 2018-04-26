import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DomainSettingsComponent } from './domain-settings.component';

describe('DomainSettingsComponent', () => {
  let component: DomainSettingsComponent;
  let fixture: ComponentFixture<DomainSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DomainSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DomainSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
