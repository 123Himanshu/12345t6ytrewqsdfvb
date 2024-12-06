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
    <div class="min-h-screen bg-gray-50 p-6">
      <header class="mb-6">
        <h1 class="text-3xl font-bold text-gray-900">Angular Quiz Application</h1>
      </header>

      <div class="flex gap-6">
        <div class="flex-1">
          <div class="bg-white rounded-xl shadow-sm p-8">
            <div class="flex justify-between items-start mb-6">
              <h2 class="text-xl">
                <span class="text-gray-600">Question {{ currentQuestion + 1 }} of {{ questions.length }}:</span>
                <span class="ml-2 font-medium">{{ currentQuestionData.text }}</span>
              </h2>
              <button 
                (click)="toggleReview()"
                class="px-6 py-2 rounded-full text-white text-sm"
                [class.bg-purple-400]="!currentQuestionData.isMarkedForReview"
                [class.bg-purple-500]="currentQuestionData.isMarkedForReview">
                Mark for Review
              </button>
            </div>

            <div class="space-y-4 mb-8">
              @for (option of currentQuestionData.options; track option; let i = $index) {
                <div 
                  (click)="selectAnswer(i)"
                  class="flex items-center p-4 bg-white rounded-lg border cursor-pointer hover:border-blue-500 transition-colors"
                  [class.border-blue-500]="currentQuestionData.selectedAnswer === i">
                  <input 
                    type="radio" 
                    [id]="'option' + i" 
                    [name]="'question' + currentQuestionData.id" 
                    [value]="i" 
                    [checked]="currentQuestionData.selectedAnswer === i"
                    class="h-4 w-4 text-blue-600 focus:ring-blue-500">
                  <label [for]="'option' + i" class="ml-3 cursor-pointer">{{ option }}</label>
                </div>
              }
            </div>

            <div class="flex justify-between items-center">
              <button 
                (click)="previousQuestion()" 
                [disabled]="currentQuestion === 0"
                class="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed">
                Previous
              </button>
              <button 
                (click)="submitQuiz()"
                class="px-8 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600">
                Submit Quiz
              </button>
              <button 
                (click)="nextQuestion()" 
                [disabled]="!isCurrentQuestionAttempted() || currentQuestion === questions.length - 1"
                class="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed">
                Next
              </button>
            </div>
          </div>
        </div>

        <div class="w-72 space-y-6">
          <app-quiz-timer
            [questionType]="currentQuestionData.questionType"
            [timeInSeconds]="currentQuestionData.timer"
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
  `
})
export class QuizComponent implements OnInit, OnDestroy {
  questions: Question[] = [];
  currentQuestion = 0;
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
  }

  ngOnDestroy() {
    // Clean up if needed
  }

  handleTimeUp() {
    this.toastService.showInfo("Time's up for this question! Moving to the next one.");
    this.nextQuestion();
  }

  submitQuiz() {
    this.showSubmissionModal = true;
  }

  confirmSubmit() {
    this.closeSubmissionModal();
    this.toastService.showSuccess('Quiz submitted successfully! Thank you for your participation.');
    // Here you would typically send the results to a server
  }

  closeSubmissionModal() {
    this.showSubmissionModal = false;
  }

  selectAnswer(answer: number) {
    this.questions[this.currentQuestion].selectedAnswer = answer;
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
    } else {
      this.submitQuiz();
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

