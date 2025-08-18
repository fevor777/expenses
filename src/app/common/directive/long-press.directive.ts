import { Directive, EventEmitter, HostListener, Input, Output, NgZone } from '@angular/core';

@Directive({
    selector: '[appLongPress]',
    standalone: true
})
export class LongPressDirective {
    @Input() duration = 500;
    @Input() disabled = false;
    @Output() longPress = new EventEmitter<void>();

    private timer: any;

    constructor(private ngZone: NgZone) { }

    @HostListener('mousedown', ['$event'])
    @HostListener('touchstart', ['$event'])
    onPressStart(event: Event): void {
        if (this.disabled) return;

        this.ngZone.runOutsideAngular(() => {
            clearTimeout(this.timer);
            this.timer = setTimeout(() => {
                this.ngZone.run(() => {
                    this.longPress.emit();
                    event.preventDefault();
                });
            }, this.duration);
        });
    }

    @HostListener('mouseup')
    @HostListener('mouseleave')
    @HostListener('touchend')
    @HostListener('touchcancel')
    onPressEnd(): void {
        clearTimeout(this.timer);
    }
}