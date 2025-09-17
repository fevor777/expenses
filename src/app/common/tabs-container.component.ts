import {
  AfterContentInit,
  Component,
  ContentChildren,
  EventEmitter,
  Input,
  Output,
  QueryList,
  computed,
  effect,
  signal,
} from '@angular/core';
import { NgFor, NgClass, NgIf, NgTemplateOutlet } from '@angular/common';
import { TabComponent } from './tab.component';

@Component({
  selector: 'app-tabs-container',
  standalone: true,
  imports: [NgFor, NgClass, NgIf, NgTemplateOutlet],
  styles: [
    `
      :host {
        display: block;
        font-family: 'Montserrat', sans-serif;
      }
      .tabs-header {
        display: flex;
        gap: 6px;
        overflow-x: auto;
        padding: 10px 16px 6px;
        background: var(--color-bg-alt);
        border: 1px solid var(--color-border);
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06);
        border-radius: 10px;
        scrollbar-width: none;
        position: relative;
      }
      .tabs-header::-webkit-scrollbar {
        display: none;
      }
      .tab-btn {
        position: relative;
        padding: 6px 18px 8px;
        font-size: 14px;
        letter-spacing: 0.3px;
        cursor: pointer;
        border-radius: 6px;
        color: var(--color-text-secondary);
        user-select: none;
        font-weight: 600;
        transition:
          background var(--transition-fast),
          color var(--transition-fast),
          transform var(--transition-fast),
          box-shadow var(--transition-fast);
      }
      /* hover style removed */
      .tab-btn:active {
        transform: translateY(1px);
      }
      .tab-btn.active {
        background: var(--color-bg);
        color: var(--color-primary);
        box-shadow: 0 0 0 1px var(--color-primary-alpha);
      }
      .tab-btn.active::after {
        content: '';
        position: absolute;
        left: 12px;
        right: 12px;
        bottom: 3px;
        height: 3px;
        background: var(--color-primary);
        border-radius: 2px;
        opacity: 0.9;
      }
      .dark .tab-btn.active,
      [data-theme='dark'] .tab-btn.active {
        background: var(--color-bg);
        box-shadow: 0 0 0 1px var(--color-primary-alpha);
      }
      .tab-btn.disabled {
        opacity: 0.4;
        cursor: default;
      }
      .tab-btn .lbl {
        text-decoration: none;
      }
      .tabs-body {
        min-height: 40px;
        padding: 4px 4px 10px;
      }
      :host(.compact) .tab-btn {
        padding: 4px 12px 6px;
        font-size: 12px;
      }
    `,
  ],
  template: `
    <div class="tabs-header" role="tablist">
      <div
        *ngFor="let t of tabs"
        class="tab-btn"
        role="tab"
        [attr.aria-selected]="t.key === activeKey()"
        [ngClass]="{ active: t.key === activeKey(), disabled: t.disabled }"
        (click)="activate(t)"
        [attr.data-key]="t.key"
      >
        <span class="lbl">{{ t.label }}</span>
      </div>
    </div>
    <div class="tabs-body">
      <ng-container *ngIf="activeTab() as at">
        <ng-container *ngTemplateOutlet="at.templateRef"></ng-container>
      </ng-container>
    </div>
  `,
})
export class TabsContainerComponent implements AfterContentInit {
  @ContentChildren(TabComponent) tabComponents!: QueryList<TabComponent>;
  @Input() set active(value: string | undefined) {
    if (value) this.activeKey.set(value);
  }
  @Output() activeChange = new EventEmitter<string>();
  @Output() changed = new EventEmitter<string>();

  protected activeKey = signal<string>('');
  protected tabs: TabComponent[] = [];

  activeTab = computed(() => this.tabs.find(t => t.key === this.activeKey()));

  constructor() {
    effect(() => {
      const key = this.activeKey();
      if (key) {
        this.activeChange.emit(key);
        this.changed.emit(key);
      }
    });
  }

  ngAfterContentInit(): void {
    this.collectTabs();
    this.tabComponents.changes.subscribe(() => this.collectTabs());
  }

  private collectTabs() {
    this.tabs = this.tabComponents.toArray();
    if (!this.activeKey() && this.tabs.length) {
      const first = this.tabs.find(t => !t.disabled) || this.tabs[0];
      if (first) this.activeKey.set(first.key);
    }
  }

  activate(tab: TabComponent) {
    if (tab.disabled) return;
    if (tab.key !== this.activeKey()) this.activeKey.set(tab.key);
  }
}
