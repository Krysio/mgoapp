import { TypeQuestion as _TypeQuestion } from './quiz';
import { nanoid } from 'nanoid';

export type TypeQuestion = _TypeQuestion;

let currentQuestionDebug: TypeQuestion = null;
const questionsDebug = (function *() {
    yield {
        name: 'Ile jest 2 + 2?',
        answers: [
            { id: nanoid(), name: '3', _correct: false },
            { id: nanoid(), name: '4', _correct: true },
            { id: nanoid(), name: '5', _correct: false },
            { id: nanoid(), name: '6', _correct: false },
        ]
    };
    yield {
        name: 'Ile jest 2 + 3?',
        answers: [
            { id: nanoid(), name: '3', _correct: false },
            { id: nanoid(), name: '4', _correct: false },
            { id: nanoid(), name: '5', _correct: true },
            { id: nanoid(), name: '6', _correct: false },
        ]
    };
    yield {
        name: 'Ile jest 2 + 4?',
        answers: [
            { id: nanoid(), name: '3', _correct: false },
            { id: nanoid(), name: '4', _correct: false },
            { id: nanoid(), name: '5', _correct: false },
            { id: nanoid(), name: '6', _correct: true },
        ]
    };
    yield null;
})();

export const createSession = async (args: {
    quizId: string,
    name: string
}) => {
    return nanoid();
};

export const nextQuestion = async (args: {
    sessionId: string
}) => {
    return currentQuestionDebug = questionsDebug.next().value as TypeQuestion;
};

export const answerQuestion = async (args: {
    sessionId: string,
    answerId: string
}) => {
    const { answerId } = args;

    if (!currentQuestionDebug) {
        return null;
    }

    const choosenAnswer = currentQuestionDebug.answers.filter((item) => item.id === answerId)[0];
    //@ts-ignore
    const correctAnswer = currentQuestionDebug.answers.filter((item) => item._correct)[0];

    return {
        correct: choosenAnswer === correctAnswer,
        correctAnswerId: correctAnswer.id
    };
};
