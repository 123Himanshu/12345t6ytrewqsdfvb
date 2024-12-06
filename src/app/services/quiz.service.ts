import { Injectable } from '@angular/core';
import { Question } from '../models/question.model';

@Injectable({
  providedIn: 'root'
})
export class QuizService {
  private baseQuestions: Question[] = [
    {
      id: 1,
      questionType: "easy",
      text: 'What is the main building block of Angular applications?',
      options: ['Components', 'Modules', 'Services', 'Templates'],
      correctAnswer: 0,
      isMarkedForReview: false,
      isVisited: false,
      timer: 60 // 1 minute for easy question
    },
    {
      id: 2,
      questionType: "descriptive",
      text: 'Explain the concept of dependency injection in Angular and its benefits.',
      options: [],
      correctAnswer: -1,
      isMarkedForReview: false,
      isVisited: false,
      timer: 180 // 3 minutes for descriptive question
    },
    {
      id: 3,
      questionType: "hard",
      text: 'What is Change Detection in Angular and how does it work?',
      options: ['Manual checking of values', 'Zone.js tracking changes', 'Regular DOM updates', 'Continuous polling'],
      correctAnswer: 1,
      isMarkedForReview: false,
      isVisited: false,
      timer: 120 // 2 minutes for hard question
    }
  ];

  generateQuestions(): Question[] {
    const questions = [...this.baseQuestions];
    const topics = ['Services', 'Routing', 'Forms', 'HTTP', 'Directives', 'Pipes', 'CLI'];
    const actions = ['implement', 'configure', 'use', 'define', 'create'];

    // Add more descriptive questions
    questions.push({
      id: 4,
      questionType: "medium",
      text: 'Compare and contrast Angular Services and Components. When would you use each?',
      options: [],
      correctAnswer: -1,
      isMarkedForReview: false,
      isVisited: false,
      timer: 90 // 1.5 minutes for medium question
    });

    // Generate remaining questions
    for (let i = questions.length; i < 20; i++) {
      const topic = topics[Math.floor(Math.random() * topics.length)];
      const action = actions[Math.floor(Math.random() * actions.length)];
      const type = Math.random() > 0.8 ? 'descriptive' : (Math.random() > 0.5 ? 'medium' : (Math.random() > 0.25 ? 'easy' : 'hard'));

      let timer: number;
      switch (type) {
        case 'easy':
          timer = 60;
          break;
        case 'medium':
          timer = 90;
          break;
        case 'hard':
          timer = 120;
          break;
        case 'descriptive':
          timer = 180;
          break;
        default:
          timer = 60;
      }

      if (type === 'descriptive') {
        questions.push({
          id: i + 1,
          questionType: type,
          text: `Explain how to ${action} Angular ${topic} and discuss its importance in application development.`,
          options: [],
          correctAnswer: -1,
          isMarkedForReview: false,
          isVisited: false,
          timer: timer
        });
      } else {
        questions.push({
          id: i + 1,
          questionType: type,
          text: `How do you ${action} Angular ${topic}?`,
          options: [
            `Using the ${topic} module`,
            `Through ${topic} configuration`,
            `With ${topic} implementation`,
            `Via ${topic} service`
          ],
          correctAnswer: Math.floor(Math.random() * 4),
          isMarkedForReview: false,
          isVisited: false,
          timer: timer
        });
      }
    }

    return questions;
  }
}

