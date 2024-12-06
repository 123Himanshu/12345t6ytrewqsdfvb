import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { QuestionNavigatorComponent } from '../question-navigator/question-navigator.component';
import { QuestionDisplayComponent } from '../question-display/question-display.component';
import { QuizTimerComponent } from '../quiz-timer/quiz-timer.component';
import { SubmissionModalComponent } from '../submission-modal/submission-modal.component';
import { QuizService } from '../../services/quiz.service';
import { ToastService } from '../../services/toast.service';
import { Question } from '../../models/question.model';

@Component({
  selector: 'app-quiz',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    QuestionNavigatorComponent,
    QuestionDisplayComponent,
    QuizTimerComponent,
    SubmissionModalComponent
  ],
  template: `
    <div class="min-h-screen bg-gray-100 ">
      <header class="bg-white shadow-sm mb-6 p-4 rounded-lg">
        <h1 class="text-2xl md:text-3xl font-bold text-gray-900">Angular Quiz Application</h1>
      </header>

      <div class="flex flex-col sm:flex-row gap-6">
        <div class="flex-1 order-2 sm:order-1">
          <app-question-display
            [question]="currentQuestionData"
            [questionNumber]="currentQuestion + 1"
            [totalQuestions]="questions.length"
            (answerSelect)="selectAnswer($event)"
            (descriptiveAnswerChange)="setDescriptiveAnswer($event)"
            (reviewToggle)="toggleReview()"
          ></app-question-display>

          <div class="flex justify-between items-center mt-6 space-x-4">
            <button 
              (click)="previousQuestion()" 
              [disabled]="currentQuestion === 0"
              class="btn btn-secondary">
              Previous
            </button>
            <button 
              (click)="submitQuiz()"
              class="btn btn-success">
              Submit Quiz
            </button>
            <button 
              (click)="nextQuestion()" 
              [disabled]="!isCurrentQuestionAttempted() || currentQuestion === questions.length - 1"
              class="btn btn-primary">
              Next
            </button>
          </div>
        </div>

        <div class="w-full sm:w-64 space-y-4 order-1 sm:order-2">
          <app-quiz-timer
            [totalSeconds]="totalSeconds"
            [questionType]="currentQuestionData.questionType"
            (timeUp)="handleTimeUp()"
          ></app-quiz-timer>
          <app-question-navigator
            [questions]="questions"
            [currentQuestionIndex]="currentQuestion"
            (questionSelect)="goToQuestion($event)"
          ></app-question-navigator>
        </div>
      </div>
    </div>

    <app-submission-modal
      [show]="showSubmissionModal"
      [questions]="questions"
      (onConfirm)="confirmSubmit()"
      (onCancel)="closeSubmissionModal()"
    ></app-submission-modal>
  `,
  styles: [`
    .btn {
      @apply px-4 py-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed;
    }
    .btn-secondary {
      @apply bg-gray-500 text-white hover:bg-gray-600 focus:ring-gray-500;
    }
    .btn-success {
      @apply bg-green-500 text-white hover:bg-green-600 focus:ring-green-500;
    }
    .btn-primary {
      @apply bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-500;
    }
  `]
})
export class QuizComponent implements OnInit, OnDestroy {
  questions: Question[] = [];
  currentQuestion = 0;
  totalSeconds = 0;
  private timerInterval: any;
  showSubmissionModal = false;

  constructor(
    private quizService: QuizService,
    private toastService: ToastService
  ) {}

  get currentQuestionData(): Question {
    return this.questions[this.currentQuestion];
  }

  ngOnInit() {
    this.questions = this.quizService.generateQuestions();
    this.calculateTotalTime();
    this.startTimer();
  }

  ngOnDestroy() {
    this.clearTimer();
  }

  private calculateTotalTime() {
    this.totalSeconds = this.questions.reduce((total, q) => 
      total + this.quizService.calculateQuestionTime(q.questionType), 0);
  }

  private startTimer() {
    this.timerInterval = setInterval(() => {
      if (this.totalSeconds > 0) {
        this.totalSeconds--;
        if (this.totalSeconds === 120) {
          this.toastService.showWarning('⚠️ Only 2 minutes remaining!');
        }
      } else {
        this.handleTimeUp();
      }
    }, 1000);
  }

  private clearTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }

  handleTimeUp() {
    this.clearTimer();
    this.toastService.showInfo("Time's up! We'll submit your quiz now.");
    this.confirmSubmit();
  }

  submitQuiz() {
    this.showSubmissionModal = true;
  }

  confirmSubmit() {
    this.closeSubmissionModal();
    this.clearTimer();
    this.toastService.showSuccess('Quiz submitted successfully! Thank you for your participation.');
    // Here you would typically send the results to a server
  }

  closeSubmissionModal() {
    this.showSubmissionModal = false;
  }

  selectAnswer(answer: number) {
    this.questions[this.currentQuestion].selectedAnswer = answer;
  }

  setDescriptiveAnswer(answer: string) {
    this.questions[this.currentQuestion].descriptiveAnswer = answer;
  }

  toggleReview() {
    this.questions[this.currentQuestion].isMarkedForReview = 
      !this.questions[this.currentQuestion].isMarkedForReview;
  }

  goToQuestion(index: number) {
    this.questions[this.currentQuestion].isVisited = true;
    this.currentQuestion = index;
    this.questions[index].isVisited = true;
  }

  nextQuestion() {
    if (this.currentQuestion < this.questions.length - 1) {
      this.goToQuestion(this.currentQuestion + 1);
    }
  }

  previousQuestion() {
    if (this.currentQuestion > 0) {
      this.goToQuestion(this.currentQuestion - 1);
    }
  }

  isCurrentQuestionAttempted(): boolean {
    const current = this.questions[this.currentQuestion];
    return current.questionType === 'descriptive'
      ? (current.descriptiveAnswer?.trim().length || 0) > 0
      : current.selectedAnswer !== undefined;
  }
}

