import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FluxComponent } from './flux.component';

describe('FluxComponent', () => {
  let component: FluxComponent;
  let fixture: ComponentFixture<FluxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FluxComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FluxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
