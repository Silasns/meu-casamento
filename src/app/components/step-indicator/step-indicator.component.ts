import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-step-indicator',
  templateUrl: './step-indicator.component.html',
  styleUrl: './step-indicator.component.scss'
})
export class StepIndicatorComponent {
  @Input() currentStep: 'checkout' | 'finalizar' | 'conclusao' = 'checkout';
  
  get steps() {
    return [
      { 
        id: 'checkout', 
        title: 'Seus dados', 
        number: 1,
        active: this.currentStep === 'checkout',
        completed: this.currentStep === 'finalizar' || this.currentStep === 'conclusao'
      },
      { 
        id: 'finalizar', 
        title: 'Finalizar', 
        number: 2,
        active: this.currentStep === 'finalizar',
        completed: this.currentStep === 'conclusao'
      },
      { 
        id: 'conclusao', 
        title: 'Conclusão', 
        number: 3,
        active: this.currentStep === 'conclusao',
        completed: false
      }
    ];
  }
}