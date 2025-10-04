import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { animate, group, query, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  animations: [
    trigger('routeFadeSlide', [
      transition('* <=> *', [
        query(':enter, :leave', [
          style({ position: 'absolute', top: 0, left: 0, width: '100%' }),
        ], { optional: true }),
        group([
          query(':leave', [
            style({ opacity: 1, transform: 'translateX(0)' }),
            animate('200ms ease', style({ opacity: 0, transform: 'translateX(-12px)' })),
          ], { optional: true }),
          query(':enter', [
            style({ opacity: 0 }),
            animate('400ms 140ms ease', style({ opacity: 1 })),
          ], { optional: true }),
        ])
      ])
    ])
  ]
})
export class AppComponent {
  title = 'expenses';

  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }
}
