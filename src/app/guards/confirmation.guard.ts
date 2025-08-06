import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, GuardResult, MaybeAsync, Router, RouterStateSnapshot } from '@angular/router';
import { PaymentFlowService } from '../services/payment-flow.service';

@Injectable({ providedIn: 'root' })

export class ConfirmationGuard implements CanActivate {
  
  constructor(
    private paymentFlow: PaymentFlowService,
    private router: Router
  ){}

  canActivate(): boolean{
    if(this.paymentFlow.isStarted()){
      return true;
    }
    this.router.navigate(['/']);
    return false;
  }
}
