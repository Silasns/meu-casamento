import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConclusaoComponent } from './conclusao.component';

describe('ConclusaoComponent', () => {
  let component: ConclusaoComponent;
  let fixture: ComponentFixture<ConclusaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConclusaoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConclusaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
