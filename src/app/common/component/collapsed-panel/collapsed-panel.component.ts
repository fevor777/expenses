import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-collapsed-panel',
  templateUrl: './collapsed-panel.component.html',
  styleUrls: ['./collapsed-panel.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class CollapsedPanelComponent {
  @Input() title: string = '';
  @Input() collapsed: boolean = false;
  @Input() showCollapseButton: boolean = true;
  // When true, turns off panel open animation & interactive transitions
  @Input() disableAnimation: boolean = false;
  @Output() toggle = new EventEmitter<void>();

  onToggle(): void {
    this.toggle.emit();
  }
}