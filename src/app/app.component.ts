import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { animate, group, query, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  animations: [
    trigger('routeFadeSlide', [
      // Skipped when component flag says so (see prepareRoute)
      transition('* <=> *', [
        // Only force absolute on the leaving view to prevent layout jump but let the entering lay out naturally.
        query(':leave', [
          style({ position: 'absolute', top: 0, left: 0, width: '100%' })
        ], { optional: true }),
        group([
          query(':leave', [
            style({ opacity: 1, transform: 'translateX(0)' }),
            animate('140ms ease-out', style({ opacity: 0, transform: 'translateX(-8px)' }))
          ], { optional: true }),
          query(':enter', [
            style({ opacity: 0 }),
            animate('200ms 40ms ease-out', style({ opacity: 1 }))
          ], { optional: true })
        ])
      ])
    ])
  ]
})
export class AppComponent {
  title = 'expenses';

  private firstLoad = true;
  private reducedMotion = typeof window !== 'undefined' &&
    window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  prepareRoute(outlet: RouterOutlet) {
    console.log('prepareRoute', outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation']);
    // Skip animation on first load or when user prefers reduced motion
    if (this.firstLoad) {
      this.firstLoad = false;
      return 'no-animation';
    }
    if (this.reducedMotion) {
      return 'no-animation';
    }
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }
}
