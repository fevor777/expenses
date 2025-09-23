import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface SegmentedOption {
  value: string; // kept generic; parent may cast
  label: string;
}

@Component({
  selector: 'app-segmented-switch',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './segmented-switch.component.html',
  styleUrls: ['./segmented-switch.component.scss'],
})
export class SegmentedSwitchComponent {
  /** Options to render */
  @Input({ required: true }) options: SegmentedOption[] = [];
  /** Currently active value */
  @Input() active?: string;
  /** ARIA label for the button group */
  @Input() ariaLabel = 'Segmented control';
  /** Emit when user selects a new option */
  @Output() select = new EventEmitter<string>();

  onClick(value: string) {
    if (value !== this.active) {
      this.select.emit(value);
    }
  }
}
