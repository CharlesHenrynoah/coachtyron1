import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import theme from './components/theme';
import SignupStep1 from './components/SignupStep1';
import SignupStep2Manual from './components/SignupStep2Manual';
import SignupStepGoogle from './components/SignupStepGoogle';
import Chat from './components/Chat';
import TrainingSession from './components/TrainingSession/training-session';
import Stats from './components/Stats/Stats';
import SessionHistory from './components/SessionHistory/SessionHistory';
import './styles/globals.css';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Routes>
          <Route path="/" element={<SignupStep1 />} />
          <Route path="/signup" element={<SignupStep1 />} />
          <Route path="/signup/step2" element={<SignupStep2Manual />} />
          <Route path="/signup-step-google" element={<SignupStepGoogle />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/training" element={<TrainingSession />} />
          <Route path="/stats" element={<Stats />} />
          <Route path="/session-history" element={<SessionHistory />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;