import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NumericalmetricComponent } from './numericalmetric.component';

describe('NumericalmetricComponent', () => {
  let component: NumericalmetricComponent;
  let fixture: ComponentFixture<NumericalmetricComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NumericalmetricComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NumericalmetricComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
