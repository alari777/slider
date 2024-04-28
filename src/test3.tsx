import React, { useState } from 'react';
import { Stepper, Step, StepLabel, Button, Typography } from '@mui/material';

function RecursiveStepper({ steps, activePath = [], setActivePath }) {
    const currentStepIndex = activePath[0] ?? 0;
    const currentStep = steps[currentStepIndex];

    const isSubStep = activePath.length > 1;

    const handleNext = () => {
        if (currentStep.subSteps && activePath.length === 1) {
            // Переходим к первому подшагу
            setActivePath([currentStepIndex, 0]);
        } else if (currentStep.subSteps && isSubStep) {
            // Управление внутри подшагов
            let nextSubPath = [...activePath];
            nextSubPath[nextSubPath.length - 1]++;
            setActivePath(nextSubPath);
        } else {
            // Обычный переход к следующему шагу
            setActivePath([currentStepIndex + 1]);
        }
    };

    const handleBack = () => {
        if (isSubStep && activePath[activePath.length - 1] > 0) {
            // Шаг назад в текущем подшаге
            let prevSubPath = [...activePath];
            prevSubPath[prevSubPath.length - 1]--;
            setActivePath(prevSubPath);
        } else {
            // Возврат к родительскому шагу или предыдущему шагу
            setActivePath(activePath.slice(0, activePath.length - 1));
        }
    };

    const currentContent = isSubStep ? (
        <RecursiveStepper
            steps={currentStep.subSteps}
            activePath={activePath.slice(1)}
            setActivePath={(subPath) => setActivePath([activePath[0], ...subPath])}
        />
    ) : (
        <Typography>{currentStep.content}</Typography>
    );

    return (
        <div>
            <Stepper activeStep={currentStepIndex} alternativeLabel>
                {steps.map((step, index) => (
                    <Step key={index}>
                        <StepLabel>{step.label}</StepLabel>
                    </Step>
                ))}
            </Stepper>
            <div>
                {currentContent}
                <Button disabled={activePath.length === 1 && currentStepIndex === 0} onClick={handleBack}>Back</Button>
                <Button onClick={handleNext}>
                    {currentStepIndex === steps.length - 1 && !isSubStep ? 'Finish' : 'Next'}
                </Button>
            </div>
        </div>
    );
}

export default function App() {
    const [activePath, setActivePath] = useState([0]); // Путь активации начинается с первого шага

    return (
        <div>
            <RecursiveStepper
                steps={steps}
                activePath={activePath}
                setActivePath={setActivePath}
            />
        </div>
    );
}

//
