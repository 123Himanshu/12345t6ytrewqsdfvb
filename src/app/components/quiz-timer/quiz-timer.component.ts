import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-quiz-timer',
  standalone: true,
  imports: [CommonModule],
  template: ` <div class="bg-red-500 text-white rounded-md shadow-md px-4 py-2 text-center mx-auto">
  <h3 class="text-sm font-semibold">TIME LEFT ({{ questionType }}):</h3>
  <div class="text-xl font-bold">{{ formattedTime }}</div>
</div>
  `
})
export class QuizTimerComponent {
  @Input() totalSeconds = 0;
  @Input() questionType?: string;
  @Output() timeUp = new EventEmitter<void>();

  get formattedTime(): string {
    const minutes = Math.floor(this.totalSeconds / 60);
    const seconds = this.totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
}

