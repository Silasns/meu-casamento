import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConclusaoPayComponent } from './conclusao-pay.component';

describe('ConclusaoPayComponent', () => {
  let component: ConclusaoPayComponent;
  let fixture: ComponentFixture<ConclusaoPayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConclusaoPayComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConclusaoPayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
