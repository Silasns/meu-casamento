import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PaymentFlowService {
  private started: boolean = false;

  constructor() { }

  start(): void {
    this.started = true;
  }

  clear(): void {
    this.started = false;
  }

  isStarted(): boolean {
    return this.started;
  }
}
