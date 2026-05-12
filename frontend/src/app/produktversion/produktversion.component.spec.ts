import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProduktversionComponent } from './produktversion.component';

describe('ProduktversionComponent', () => {
  let component: ProduktversionComponent;
  let fixture: ComponentFixture<ProduktversionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProduktversionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProduktversionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
