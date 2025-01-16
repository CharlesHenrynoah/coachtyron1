import React, { useState } from 'react';
import { Box, Container, Typography } from '@mui/material';
import ExerciseCard from './exercise-card';
import './training-session.css';

const TrainingSession = () => {
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);

  const exercises = [
    {
      name: "Push-ups",
      description: "3 sets of 10 reps",
      duration: 60
    },
    {
      name: "Squats",
      description: "3 sets of 15 reps",
      duration: 90
    },
    // Add more exercises as needed
  ];

  const handleExerciseComplete = () => {
    if (currentExerciseIndex < exercises.length - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Training Session
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          Exercise {currentExerciseIndex + 1} of {exercises.length}
        </Typography>
        <ExerciseCard
          exercise={exercises[currentExerciseIndex]}
          onComplete={handleExerciseComplete}
        />
      </Box>
    </Container>
  );
};

export default TrainingSession;
