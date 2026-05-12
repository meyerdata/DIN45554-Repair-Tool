import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KlasseDerKriterienComponent } from './klasse-der-kriterien.component';

describe('KlasseDerKriterienComponent', () => {
  let component: KlasseDerKriterienComponent;
  let fixture: ComponentFixture<KlasseDerKriterienComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KlasseDerKriterienComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KlasseDerKriterienComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
