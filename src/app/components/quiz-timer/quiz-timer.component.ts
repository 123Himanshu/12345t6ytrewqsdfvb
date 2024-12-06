import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-quiz-timer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-red-500 text-white p-4 rounded-xl">
      <div class="text-sm mb-1">TIME LEFT ({{ questionType.toUpperCase() }}):</div>
      <div class="text-3xl font-bold">{{ formattedTime }}</div>
    </div>
  `
})
export class QuizTimerComponent implements OnChanges {
  @Input() questionType: string = '';
  @Input() timeInSeconds: number = 0;
  @Output() timeUp = new EventEmitter<void>();

  private timer: any;
  private currentTime: number = 0;

  get formattedTime(): string {
    const minutes = Math.floor(this.currentTime / 60);
    const seconds = this.currentTime % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['timeInSeconds']) {
      this.resetTimer();
    }
  }

  private resetTimer() {
    if (this.timer) {
      clearInterval(this.timer);
    }
    this.currentTime = this.timeInSeconds;
    this.startTimer();
  }

  private startTimer() {
    this.timer = setInterval(() => {
      if (this.currentTime > 0) {
        this.currentTime--;
      } else {
        this.timeUp.emit();
        clearInterval(this.timer);
      }
    }, 1000);
  }

  ngOnDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }
}

