/// <reference types="jasmine" />

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CalculatorModalComponent } from './calculator-modal.component';

describe('CalculatorModalComponent', () => {
  let fixture: ComponentFixture<CalculatorModalComponent>;
  let component: CalculatorModalComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalculatorModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CalculatorModalComponent);
    component = fixture.componentInstance;
  });

  it('rounds applied results to two decimals', () => {
    component.expression = '2/3';
    const applySpy = spyOn(component.apply, 'emit');

    component.onApply();

    expect(applySpy).toHaveBeenCalledWith('0.67');
  });

  it('rounds equals results to two decimals', () => {
    component.expression = '1.2+1.3';

    component.onEquals();

    expect(component.expression).toBe('2.5');
  });
});