import { Directive, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroupDirective } from '@angular/forms';
import { NavigationStart, Router } from '@angular/router';
import { asyncScheduler, Observable, Subject } from 'rxjs';
import { filter, observeOn, takeUntil } from 'rxjs/operators';
import { AutosaveGuard } from './autosave.guard';

@Directive({
  selector: '[appAutosave]'
})
export class AutosaveDirective implements OnInit, OnDestroy {

  @Input('appAutosave')
  saveCallback!: () => Observable<unknown>;

  destroy$ = new Subject<void>();

  constructor(private router: Router,
    private formGroupDirective: FormGroupDirective,
    private guard: AutosaveGuard) { }


  ngOnInit(): void {
    const navigationEvents$ = this.router.events.pipe(
      takeUntil(this.destroy$),
      filter(event => event instanceof NavigationStart),
      observeOn(asyncScheduler)
    );

    navigationEvents$.subscribe(() => {
      const form = this.formGroupDirective.form;

      if (form.dirty) {
        if (form.valid) {
          // form is valid and dirty call the callback, enable or disable the navigation based on
          // the completion of the observable
          this.saveCallback().subscribe(this.onNext, this.onError, this.onComplete);
        } else {
          // form is dirty but not valid - prevent user from navigating away
          this.guard.disableNavigation();
        }
      } else {
        // form is not dirty - allow the user to navigate away
        // this only works if the navigationEvents$ stream definition includes observeOn(asyncScheduler)
        this.guard.enableNavigation();
      }
    })
  }

  ngOnDestroy(): void {
    // hello there
    this.destroy$.next();
  }

  private onNext = () => {
    this.guard.enableNavigation();
  };

  private onError = () => {
    this.guard.disableNavigation();
  };

  private onComplete = () => {
    this.formGroupDirective.form.reset();
  };
}
