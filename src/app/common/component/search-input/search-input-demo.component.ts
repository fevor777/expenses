import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SearchInputComponent } from './search-input.component';

@Component({
  selector: 'app-search-input-demo',
  template: `
    <div class="demo-container">
      <h2>Search Input Demo</h2>
      
      <!-- Example 1: Basic usage with two-way binding -->
      <div class="demo-section">
        <h3>Basic Search (Two-way binding)</h3>
        <app-search-input
          placeholder="Search products..."
          [(ngModel)]="searchValue1"
          (searchChange)="onSearch1($event)"
        ></app-search-input>
        <p>Current value: "{{ searchValue1 }}"</p>
      </div>
      
      <!-- Example 2: Custom labels and event handling -->
      <div class="demo-section">
        <h3>Custom Labels & Events</h3>
        <app-search-input
          placeholder="Find documents..."
          ariaLabel="Search documents"
          clearButtonAriaLabel="Clear search field"
          [(ngModel)]="searchValue2"
          (searchChange)="onSearch2($event)"
          (clear)="onClear2()"
        ></app-search-input>
        <p>Search triggered {{ searchCount2 }} times</p>
        <p>Clear triggered {{ clearCount2 }} times</p>
      </div>
      
      <!-- Example 3: Using with reactive forms (ControlValueAccessor) -->
      <div class="demo-section">
        <h3>Reactive Forms Compatible</h3>
        <p>This component implements ControlValueAccessor, so it works with:</p>
        <ul>
          <li>[(ngModel)] - Template-driven forms</li>
          <li>formControlName - Reactive forms</li>
          <li>Direct value binding</li>
        </ul>
      </div>
    </div>
  `,
  styles: [`
    .demo-container {
      padding: 20px;
      max-width: 600px;
      margin: 0 auto;
    }
    
    .demo-section {
      margin-bottom: 30px;
      padding: 15px;
      border: 1px solid var(--color-border);
      border-radius: 8px;
      background: var(--color-bg-alt);
    }
    
    h3 {
      margin-top: 0;
      color: var(--color-primary);
    }
    
    p {
      margin: 8px 0;
      color: var(--color-text-secondary);
    }
  `],
  standalone: true,
  imports: [CommonModule, FormsModule, SearchInputComponent],
})
export class SearchInputDemoComponent {
  searchValue1 = '';
  searchValue2 = '';
  searchCount2 = 0;
  clearCount2 = 0;
  
  onSearch1(value: string) {
    console.log('Search 1:', value);
  }
  
  onSearch2(value: string) {
    this.searchCount2++;
    console.log('Search 2:', value);
  }
  
  onClear2() {
    this.clearCount2++;
    console.log('Clear 2 triggered');
  }
}