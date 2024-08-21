import { Directive, ElementRef, EventEmitter, OnInit, Output } from '@angular/core';
import * as Hammer from 'hammerjs';

@Directive({
  selector: '[appSwipe]'
})
export class SwipeDirective implements OnInit {
  @Output() swipeLeft = new EventEmitter<void>();
  @Output() swipeRight = new EventEmitter<void>();
  @Output() swipeDown = new EventEmitter<void>();
  @Output() swipeUp = new EventEmitter<void>();

  private hammer!: HammerManager;

  constructor(private el: ElementRef) {}

  ngOnInit() {
    this.hammer = new Hammer.Manager(this.el.nativeElement);
    this.hammer.add(new Hammer.Swipe({ direction: Hammer.DIRECTION_ALL }));

    this.hammer.on('swipeleft', () => this.onSwipeLeft());
    this.hammer.on('swiperight', () => this.onSwipeRight());
    this.hammer.on('swipeup', () => this.onSwipeUp());
    this.hammer.on('swipedown', () => this.onSwipeDown());
  }

  onSwipeLeft() {
    this.swipeLeft.emit();
  }

  onSwipeRight() {
    this.swipeRight.emit();
  }

  onSwipeDown() {
    this.swipeDown.emit();
  }

  onSwipeUp() {
    this.swipeUp.emit();
  }

  ngOnDestroy() {
    if (this.hammer) {
      this.hammer.destroy();
    }
  }
}