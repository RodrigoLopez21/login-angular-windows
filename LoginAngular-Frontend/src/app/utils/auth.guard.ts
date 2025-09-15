import { CanDeactivateFn, Router } from '@angular/router';
import { DashboardComponent } from '../components/dashboard/dashboard.component';
import { Injectable } from '@angular/core';

import {GuardService} from '../services/guard.service'

export const AuthGuard: CanDeactivateFn<DashboardComponent> = (component, currentRoute, currentState, nextState) => {
  const authGuardService = new GuardService(new Router()); 
  return authGuardService.canDeactivate();
};
