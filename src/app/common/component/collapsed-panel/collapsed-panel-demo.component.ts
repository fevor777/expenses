import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CollapsedPanelComponent } from './collapsed-panel.component';

@Component({
  selector: 'app-collapsed-panel-demo',
  template: `
    <div class="demo-container">
      <h2>Collapsed Panel Demo</h2>
      
      <!-- Example 1: Simple title -->
      <app-collapsed-panel 
        title="Simple Panel" 
        [collapsed]="panel1Collapsed" 
        (toggle)="togglePanel1()"
      >
        <p>This is content inside a collapsed panel using just a title.</p>
        <p>The panel can contain any HTML content.</p>
      </app-collapsed-panel>
      
      <!-- Example 2: Custom header content -->
      <app-collapsed-panel 
        [collapsed]="panel2Collapsed" 
        (toggle)="togglePanel2()"
      >
        <div slot="header" class="custom-header">
          <i class="fas fa-chart-bar"></i>
          <span>Custom Header Content</span>
          <span class="badge">New</span>
        </div>
        
        <div class="custom-content">
          <h3>Rich Content Example</h3>
          <ul>
            <li>Item 1</li>
            <li>Item 2</li>
            <li>Item 3</li>
          </ul>
        </div>
      </app-collapsed-panel>
      
      <!-- Example 3: Without collapse button -->
      <app-collapsed-panel 
        title="Always Expanded" 
        [collapsed]="false" 
        [showCollapseButton]="false"
      >
        <p>This panel cannot be collapsed (no collapse button shown).</p>
      </app-collapsed-panel>
    </div>
  `,
  styles: [`
    .demo-container {
      padding: 30px;
      max-width: 800px;
      margin: 0 auto;
      background: var(--color-bg);
      min-height: 100vh;
    }
    
    h2 {
      text-align: center;
      color: var(--color-primary);
      font-weight: 700;
      font-size: 28px;
      margin-bottom: 40px;
      background: linear-gradient(135deg, var(--color-primary), color-mix(in srgb, var(--color-primary) 70%, var(--color-accent, #6366f1)));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    
    .custom-header {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    
    .custom-header i {
      color: var(--color-primary);
      font-size: 16px;
    }
    
    .badge {
      background: linear-gradient(135deg, var(--color-primary), color-mix(in srgb, var(--color-primary) 80%, #ff6b6b));
      color: white;
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    
    .custom-content {
      padding: 16px;
      background: linear-gradient(135deg, 
        color-mix(in srgb, var(--color-bg-alt) 30%, transparent) 0%,
        color-mix(in srgb, var(--color-bg-alt) 50%, transparent) 100%
      );
      border-radius: 12px;
      border: 1px solid color-mix(in srgb, var(--color-border) 40%, transparent);
    }
    
    .custom-content h3 {
      margin-top: 0;
      color: var(--color-text);
      font-weight: 600;
      font-size: 18px;
      margin-bottom: 12px;
    }
    
    .custom-content ul {
      margin: 0;
      padding-left: 20px;
    }
    
    .custom-content li {
      margin: 8px 0;
      color: var(--color-text-secondary);
      line-height: 1.5;
    }
    
    .custom-content li:before {
      content: '→';
      color: var(--color-primary);
      font-weight: bold;
      margin-right: 8px;
      margin-left: -16px;
    }
  `],
  standalone: true,
  imports: [CommonModule, CollapsedPanelComponent],
})
export class CollapsedPanelDemoComponent {
  panel1Collapsed = false;
  panel2Collapsed = true;
  
  togglePanel1() {
    this.panel1Collapsed = !this.panel1Collapsed;
  }
  
  togglePanel2() {
    this.panel2Collapsed = !this.panel2Collapsed;
  }
}