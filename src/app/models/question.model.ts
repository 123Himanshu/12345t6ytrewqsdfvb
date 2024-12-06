export interface Question {
  id: number;
  questionType: 'easy' | 'medium' | 'hard' | 'descriptive';
  text: string;
  options: string[];
  correctAnswer: number;
  selectedAnswer?: number;
  descriptiveAnswer?: string;
  isMarkedForReview: boolean;
  isVisited: boolean;
  timer: number; // Time in seconds for this specific question
}

