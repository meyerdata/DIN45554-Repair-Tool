import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BewertungsprozessComponent } from './bewertungsprozess.component';

describe('BewertungsprozessComponent', () => {
  let component: BewertungsprozessComponent;
  let fixture: ComponentFixture<BewertungsprozessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BewertungsprozessComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BewertungsprozessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
