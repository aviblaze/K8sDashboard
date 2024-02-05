import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StageConnectorComponent } from './stage-connector.component';

describe('StageConnectorComponent', () => {
  let component: StageConnectorComponent;
  let fixture: ComponentFixture<StageConnectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StageConnectorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StageConnectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
