import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProduktgruppeTeileComponent } from './produktgruppe-teile.component';

describe('ProduktgruppeTeileComponent', () => {
  let component: ProduktgruppeTeileComponent;
  let fixture: ComponentFixture<ProduktgruppeTeileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProduktgruppeTeileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProduktgruppeTeileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
