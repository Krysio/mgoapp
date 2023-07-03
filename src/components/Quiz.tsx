"use client";

import { useRef, useState } from 'react';
import { nanoid } from 'nanoid';
import styles from './Quiz.module.css';
import { QuizService, getQuizService } from '@/services/quiz';

function ViewStart({ quiz }: { quiz: QuizService }) {
    const refInput = useRef<HTMLInputElement>(null);
    const refBtn = useRef<HTMLButtonElement>(null);
    const [inputId] = useState(nanoid);

    const onClickBtn = () => {
        const name = refInput.current?.value as string;

        if (!name) {
            return;
        }

        quiz.startSession(refInput.current?.value as string);
    };

    return <>
        <div className={styles.quiz}>
            <label className={styles.label} htmlFor={inputId}>Enter your name:</label>
            <input id={inputId} className={styles.input} ref={refInput} type="text"/>
            <button
                className={styles.button}
                ref={refBtn}
                onClick={onClickBtn}
            >
                Next
            </button>
        </div>
    </>;
}

function ViewQuestion({ quiz }: { quiz: QuizService }) {
    return <div className={styles.question}>
        <h3>{ quiz.getQuestionString() }</h3>
        { quiz.getQuestionAnswerList().map((item) => (
            <div key={item.id} className={styles.answer} onClick={() => quiz.setAnswer(item)}>{item.name}</div>
        )) }
    </div>;
}

function ViewEnd({ quiz }: { quiz: QuizService }) {
    return <h3>{ `Score: ${quiz.getScoreString()}` }</h3>;
}

export default function Quiz() {
    const [quiz] = useState(getQuizService);

    quiz.useAutoUpdate();

    if (!quiz.isStarted()) {
        return <ViewStart quiz={quiz}/>;
    }

    if (quiz.isFinished()) {
        return <ViewEnd quiz={quiz} />
    }
    
    return <ViewQuestion key={quiz.getQuestionId()} quiz={quiz}/>
}
