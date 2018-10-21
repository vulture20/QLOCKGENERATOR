import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FontsComponent } from './fonts.component';

describe('FontsComponent', () => {
  let component: FontsComponent;
  let fixture: ComponentFixture<FontsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FontsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FontsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
