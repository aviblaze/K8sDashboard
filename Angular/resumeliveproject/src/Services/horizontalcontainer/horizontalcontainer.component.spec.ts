import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HorizontalcontainerComponent } from './horizontalcontainer.component';

describe('HorizontalcontainerComponent', () => {
  let component: HorizontalcontainerComponent;
  let fixture: ComponentFixture<HorizontalcontainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HorizontalcontainerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HorizontalcontainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
