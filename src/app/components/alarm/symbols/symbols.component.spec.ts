import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SymbolsComponent } from './symbols.component';

describe('SymbolsComponent', () => {
  let component: SymbolsComponent;
  let fixture: ComponentFixture<SymbolsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SymbolsComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SymbolsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
