import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupdialogComponent } from './popupdialog.component';

describe('PopupdialogComponent', () => {
  let component: PopupdialogComponent;
  let fixture: ComponentFixture<PopupdialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PopupdialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PopupdialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
