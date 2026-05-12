import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatenVerwaltungComponent } from './daten-verwaltung.component';

describe('DatenVerwaltungComponent', () => {
  let component: DatenVerwaltungComponent;
  let fixture: ComponentFixture<DatenVerwaltungComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DatenVerwaltungComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DatenVerwaltungComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
