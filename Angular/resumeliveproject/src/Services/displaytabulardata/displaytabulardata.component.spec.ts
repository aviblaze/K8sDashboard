import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplaytabulardataComponent } from './displaytabulardata.component';

describe('DisplaytabulardataComponent', () => {
  let component: DisplaytabulardataComponent;
  let fixture: ComponentFixture<DisplaytabulardataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DisplaytabulardataComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DisplaytabulardataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
