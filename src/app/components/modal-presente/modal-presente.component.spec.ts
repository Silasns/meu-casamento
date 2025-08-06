import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalPresenteComponent } from './modal-presente.component';

describe('ModalPresenteComponent', () => {
  let component: ModalPresenteComponent;
  let fixture: ComponentFixture<ModalPresenteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModalPresenteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalPresenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
