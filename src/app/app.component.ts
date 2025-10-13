import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { animate, group, query, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  animations: [
    trigger('routeFadeSlide', [
      // Disable animations when either side is home
      transition('home <=> *', []),
      transition('* <=> home', []),
      transition('* <=> *', [
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
  private reducedMotion = typeof window !== 'undefined' &&
    window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  prepareRoute(outlet: RouterOutlet) {
    if (this.reducedMotion) return 'home'; // map reduced motion to home token to hit empty transitions
    return outlet?.activatedRouteData?.['animation'] || 'home';
  }
}
