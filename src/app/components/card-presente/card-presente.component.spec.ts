import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardPresenteComponent } from './card-presente.component';

describe('CardPresenteComponent', () => {
  let component: CardPresenteComponent;
  let fixture: ComponentFixture<CardPresenteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CardPresenteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardPresenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
