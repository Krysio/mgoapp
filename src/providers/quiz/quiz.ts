const serviceHost = 'http://localhost:1337/quiz-sessions';

const ErrorUnsupportedStatus = new Error('Unsupported status');
export const ErrorSessionNotFound = new Error('404: Session not found');
export const ErrorSessionOrQuestionNotFound = new Error('404: Session or question not found');

export type TypeQuestion = null | {
    name: string, // TOCHECK name ???
    answers: {
        id: string,
        name: string
    }[]
};

const fetchWrapper = (...args: Parameters<typeof fetch>) => {
    //@ts-ignore
    return fetch(...args);
};

export const createSession = async (args: {
    quizId: string,
    name: string
}) => {
    const response = await fetchWrapper(`${serviceHost}/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(args)
    });

    switch (response.status) {
        case 200: {
            const { sessionId } = await response.json();

            return sessionId as string;
        };
        default: throw ErrorUnsupportedStatus;
    }
};

export const nextQuestion = async (args: {
    sessionId: string
}) => {
    const { sessionId } = args;

    const response = await fetchWrapper(`${serviceHost}/${sessionId}/next`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    });

    switch (response.status) {
        case 200: return await response.json() as TypeQuestion;
        // TODO 
        case 404: return null;
        case 404: throw ErrorSessionNotFound;
        default: throw ErrorUnsupportedStatus;
    }
};

export const answerQuestion = async (args: {
    sessionId: string,
    answerId: string
}) => {
    const { sessionId, answerId } = args;

    const response = await fetchWrapper(`${serviceHost}/${sessionId}/answer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answerId })
    });

    switch (response.status) {
        case 200: return await response.json() as {
            correct: boolean,
            correctAnswerId: string
        };
        case 204: return null;
        case 404: throw ErrorSessionOrQuestionNotFound;
        default: throw ErrorUnsupportedStatus;
    }
};
