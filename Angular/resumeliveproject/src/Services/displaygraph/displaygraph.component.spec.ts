import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplaygraphComponent } from './displaygraph.component';

describe('DisplaygraphComponent', () => {
  let component: DisplaygraphComponent;
  let fixture: ComponentFixture<DisplaygraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DisplaygraphComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DisplaygraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
