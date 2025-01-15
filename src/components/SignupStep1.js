import React, { useState } from 'react';
import { 
  TextField, 
  Button, 
  Typography, 
  Divider, 
  Box, 
  Container,
  LinearProgress
} from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import './SignupStep1.css';

const SignupStep1 = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);

  const isFormValid = () => {
    return email.trim() !== '' && 
           password.trim() !== '' && 
           confirmPassword.trim() !== '' &&
           password === confirmPassword;
  };

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length > 0) strength += 20;
    if (password.length >= 8) strength += 20;
    if (/[A-Z]/.test(password)) strength += 20;
    if (/[0-9]/.test(password)) strength += 20;
    if (/[^A-Za-z0-9]/.test(password)) strength += 20;
    return strength;
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setPasswordStrength(calculatePasswordStrength(newPassword));
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 20) return '#f44336';
    if (passwordStrength <= 40) return '#ff9800';
    if (passwordStrength <= 60) return '#ffeb3b';
    if (passwordStrength <= 80) return '#8bc34a';
    return '#4caf50';
  };

  const handleEmailSignup = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      console.log('Passwords do not match');
      return;
    }
    console.log('Email signup:', email, password);
  };

  const handleGoogleSignup = () => {
    console.log('Google signup clicked');
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box className="container-box">
        <Typography component="h1" variant="h5" className="title">
          Create Account
        </Typography>
        
        <Box component="form" onSubmit={handleEmailSignup} className="form-container">
          <TextField
            className="text-field"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            className="text-field"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            value={password}
            onChange={handlePasswordChange}
          />
          <Box className="password-strength">
            <LinearProgress
              variant="determinate"
              value={passwordStrength}
              sx={{ 
                height: 8, 
                borderRadius: 5,
                backgroundColor: 'rgba(0,0,0,0.1)',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: getPasswordStrengthColor()
                }
              }}
            />
            <Typography variant="caption" sx={{ color: getPasswordStrengthColor() }}>
              {passwordStrength === 0 ? 'Enter password' :
               passwordStrength <= 20 ? 'Very weak' :
               passwordStrength <= 40 ? 'Weak' :
               passwordStrength <= 60 ? 'Medium' :
               passwordStrength <= 80 ? 'Strong' :
               'Very strong'}
            </Typography>
          </Box>
          <TextField
            className="text-field"
            margin="normal"
            required
            fullWidth
            name="confirmPassword"
            label="Confirm Password"
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <Button
            className="submit-button"
            type="submit"
            fullWidth
            variant="contained"
            disabled={!isFormValid()}
          >
            Next Step
          </Button>
        </Box>

        <Divider className="divider">OR</Divider>

        <Button
          className="google-button"
          fullWidth
          variant="outlined"
          startIcon={<GoogleIcon />}
          onClick={handleGoogleSignup}
        >
          Continue with Google
        </Button>

        <Box className="account-section">
          <Typography variant="body2">
            Already have an account?
          </Typography>
          <Button
            className="signin-button"
            variant="contained"
            fullWidth
          >
            Sign in
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default SignupStep1;
