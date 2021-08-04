import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AutosaveGuard implements CanDeactivate<unknown> {
  private navigationAllowed = new Subject<boolean>();

  canDeactivate(): Observable<boolean> {
    return this.navigationAllowed;
  }

  enableNavigation() {
    console.log('Enabling navigation');
    this.navigationAllowed.next(true);
  }

  disableNavigation() {
    console.log('Disabling navigation');
    this.navigationAllowed.next(false);
  }
}
