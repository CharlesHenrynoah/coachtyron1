import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import theme from './components/theme';
import Login from './components/Login';
import Home from './components/Home';
import SignupStep1 from './components/SignupStep1';
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
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignupStep1 />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/training-session" element={<TrainingSession />} />
          <Route path="/stats" element={<Stats />} />
          <Route path="/session-history" element={<SessionHistory />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;