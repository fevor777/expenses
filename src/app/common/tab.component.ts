import { Component, Input, TemplateRef, ViewChild } from '@angular/core';

@Component({
    selector: 'app-tab',
    standalone: true,
    template: ` <ng-template><ng-content></ng-content></ng-template> `,
})
export class TabComponent {
    @Input() key!: string; // unique tab id
    @Input() label!: string; // header label
    @Input() disabled = false;
    // capture the component's own <ng-template>
    @ViewChild(TemplateRef, { static: true }) templateRef!: TemplateRef<any>;
}
