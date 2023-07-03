import { useState, useEffect } from 'react';
import { EventEmitter } from 'events';
import { createSession, nextQuestion, TypeQuestion, answerQuestion } from '@/providers/quiz';

export class QuizService {
    protected name: null | string = null;
    protected sessionId: null | string = null;
    protected events: EventEmitter;
    protected countOfQuestions = 0;
    protected countOfCorrectAnswers = 0;
    protected finishedStatus = false;
    protected loadingState = true;
    protected currentQuestion: TypeQuestion = null;

    constructor() {
        this.events = new EventEmitter();
    }

    useAutoUpdate() {
        let [updateValue, update] = useState(0);

        useEffect(() => {
            const forceUpdate = () => {
                update(++updateValue);
            };

            this.events.on('changed', forceUpdate);

            return () => {
                this.events.off('changed', forceUpdate);
            }
        }, []);
    }

    async startSession(name: string) {
        this.name = name;
        this.sessionId = await createSession({
            name,
            quizId: 'default'
        });
        
        this.getNextQuestion();
    }

    async getNextQuestion() {
        if (this.sessionId) {
            this.currentQuestion = null;
            this.loadingState = true;
            this.events.emit('changed');

            this.currentQuestion = await nextQuestion({ sessionId: this.sessionId });

            if (this.currentQuestion === null) {
                this.finishedStatus = true;
            }

            this.loadingState = false;
            this.events.emit('changed');
        }
    };

    async setAnswer (answer: NonNullable<TypeQuestion>['answers'][0]) {
        if (this.sessionId) {
            this.loadingState = true;
            this.events.emit('changed');
    
            const answerResponse = await answerQuestion({ sessionId: this.sessionId, answerId: answer.id });

            this.countOfQuestions++;

            if (answerResponse?.correct) {
                this.countOfCorrectAnswers++;
            }

            this.getNextQuestion();
        }
    };

    isStarted() { return Boolean(this.sessionId); }
    isFinished() { return this.finishedStatus; }

    getQuestionId() { return this.currentQuestion?.name; }
    getQuestionString() { return this.currentQuestion?.name; }
    getQuestionAnswerList() { return this.currentQuestion?.answers || []; }
    getScoreString() { return `${this.countOfCorrectAnswers}/${this.countOfQuestions}`; }

}

export const getQuizService = () => new QuizService();
