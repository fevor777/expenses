import { AfterContentInit, Component, ContentChildren, EventEmitter, Input, Output, QueryList, computed, effect, signal } from '@angular/core';
import { NgFor, NgClass, NgIf, NgTemplateOutlet } from '@angular/common';
import { TabComponent } from './tab.component';

@Component({
    selector: 'app-tabs-container',
    standalone: true,
    imports: [NgFor, NgClass, NgIf, NgTemplateOutlet],
    styles: [`
    :host { display:block; font-family:"Montserrat", sans-serif; }
    /* Header bar mimics expense header palette */
  .tabs-header { display:flex; gap:6px; margin:24px 0 16px; overflow-x:auto; padding:10px 16px 6px; background:#f8d7da; box-shadow:0 -6px 18px #87002466, 0 1px 3px rgba(0,0,0,0.08); border-radius:18px; scrollbar-width:none; }
    .tabs-header::-webkit-scrollbar{display:none;}
    .tab-btn { position:relative; padding:6px 18px 8px; font-size:14px; letter-spacing:.3px; cursor:pointer; border-radius:10px; color:#346078; user-select:none; font-weight:500; transition:background .18s, color .18s, transform .18s; }
    .tab-btn:hover { background:rgba(255,255,255,0.55); }
    .tab-btn:active { transform:translateY(1px); }
    .tab-btn.active { background:#ffffff; color:#870024; box-shadow:0 2px 4px rgba(0,0,0,0.12); }
    .tab-btn.active::after { content:''; position:absolute; left:14px; right:14px; bottom:2px; height:3px; background:#870024; border-radius:2px; }
    .tab-btn.disabled { opacity:.4; cursor:default; }
    .tab-btn .lbl { text-decoration:none; }
    .tabs-body { min-height:40px; padding:4px 4px 10px; }
    /* Compact mode (future) */
    :host(.compact) .tab-btn { padding:4px 12px 6px; font-size:12px; }
  `],
    template: `
    <div class="tabs-header" role="tablist">
      <div *ngFor="let t of tabs" class="tab-btn" role="tab"
           [attr.aria-selected]="t.key === activeKey()" [ngClass]="{active: t.key===activeKey(), disabled: t.disabled}"
           (click)="activate(t)" [attr.data-key]="t.key">
        <span class="lbl">{{t.label}}</span>
      </div>
    </div>
    <div class="tabs-body">
      <ng-container *ngIf="activeTab() as at">
        <ng-container *ngTemplateOutlet="at.templateRef"></ng-container>
      </ng-container>
    </div>
  `
})
export class TabsContainerComponent implements AfterContentInit {
    @ContentChildren(TabComponent) tabComponents!: QueryList<TabComponent>;
    @Input() set active(value: string | undefined) { if (value) this.activeKey.set(value); }
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
