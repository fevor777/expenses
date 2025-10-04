import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';

@Component({
  selector: 'app-calculator-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './calculator-modal.component.html',
  styleUrls: ['./calculator-modal.component.scss']
})
export class CalculatorModalComponent {
  @Input() initialValue: string = '';
  @Output() apply: EventEmitter<string> = new EventEmitter<string>();
  @Output() cancel: EventEmitter<void> = new EventEmitter<void>();

  expression = '0';
  private caretPos = 0;
  // Allowed characters (digits, operators, parentheses, decimal point)
  private readonly allowedPattern = /[0-9+\-*/().]/;

  ngOnInit() {
    this.expression = this.initialValue && this.initialValue.trim() !== '' ? this.initialValue : '0';
  }

  onKey(key: string) {
    // Insert at caret
    if (!this.allowedPattern.test(key)) return;

    // Special handling when whole expression is '0'
    if (this.expression === '0') {
      if (/[0-9.]/.test(key)) {
        this.expression = key === '.' ? '0.' : key;
        this.caretPos = this.expression.length;
        return;
      }
      if (key === '(') {
        this.expression = '(';
        this.caretPos = 1;
        return;
      }
    }

    const before = this.expression.slice(0, this.caretPos);
    const after = this.expression.slice(this.caretPos);

    // Operator normalization (avoid duplicate sequential operators)
    const operators = ['+', '-', '*', '/'];
    if (operators.includes(key)) {
      const prevChar = before.slice(-1);
      if (operators.includes(prevChar)) {
        // Replace previous operator
        this.expression = before.slice(0, -1) + key + after;
        this.caretPos = before.length; // stays in same logical position
        return;
      }
    }

    if (key === '.') {
      // Determine current numeric token at caret
      const tokenStart = before.search(/[^0-9.]*$/); // last non-number-dot
      const token = before.slice(tokenStart);
      if (token.includes('.')) return;
    }

    this.expression = before + key + after;
    this.caretPos += key.length;
  }

  onClean() {
    this.expression = '0';
  }

  onDelete() {
    if (this.caretPos === 0) return;
    const before = this.expression.slice(0, this.caretPos - 1);
    const after = this.expression.slice(this.caretPos);
    this.expression = before + after || '0';
    this.caretPos = Math.max(0, this.caretPos - 1);
    if (this.expression === '-' || this.expression === '') {
      this.expression = '0';
      this.caretPos = this.expression.length;
    }
  }

  onApply() {
    try {
      const safeExp = this.expression.replace(/[^0-9+\-*/().]/g, '');
      // eslint-disable-next-line no-new-func
      const result = Function(`"use strict"; return (${safeExp})`)();
      const normalized = (result ?? 0);
      // If result is numerically zero, emit empty string per requirement
      if (Number(normalized) === 0) {
        this.apply.emit('');
      } else {
        this.apply.emit(normalized.toString());
      }
    } catch {
      this.cancel.emit();
    }
  }

  onEquals() {
    try {
      const safeExp = this.expression.replace(/[^0-9+\-*/().]/g, '');
      // eslint-disable-next-line no-new-func
      const result = Function(`"use strict"; return (${safeExp})`)();
      this.expression = (result ?? 0).toString();
      this.caretPos = this.expression.length;
    } catch {
      // Keep expression unchanged on error
    }
  }

  onBackdrop() {
    this.cancel.emit();
  }

  @HostListener('document:keydown', ['$event'])
  onKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      this.cancel.emit();
    } else if (e.key === 'Enter') {
      this.onApply();
    } else if (e.key === 'Backspace') {
      e.preventDefault();
      this.onDelete();
    } else if (this.allowedPattern.test(e.key)) {
      e.preventDefault();
      this.onKey(e.key);
      this.deferSetCaret();
    } else if (e.key === 'ArrowLeft') {
      this.caretPos = Math.max(0, this.caretPos - 1);
      this.deferSetCaret();
    } else if (e.key === 'ArrowRight') {
      this.caretPos = Math.min(this.expression.length, this.caretPos + 1);
      this.deferSetCaret();
    }
  }

  updateCaret(event: Event) {
    const input = event.target as HTMLInputElement;
    this.caretPos = input.selectionStart || 0;
  }

  onDirectInput(event: Event) {
    const input = event.target as HTMLInputElement;
    const filtered = (input.value || '')
      .split('')
      .filter(ch => this.allowedPattern.test(ch))
      .join('');
    this.expression = filtered.length ? filtered : '0';
    this.caretPos = input.selectionStart || this.expression.length;
  }

  private deferSetCaret() {
    // Wait for DOM update
    requestAnimationFrame(() => {
      const el = document.querySelector('.calc-display-input') as HTMLInputElement;
      if (el) {
        el.setSelectionRange(this.caretPos, this.caretPos);
      }
    });
  }
}
