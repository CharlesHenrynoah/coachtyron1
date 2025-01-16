import React, { useState } from 'react';
import { 
  TextField, 
  Button, 
  Typography, 
  Divider, 
  Box, 
  Container 
} from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Ajouter cette fonction de validation
  const isFormValid = () => {
    return email.trim() !== '' && password.trim() !== '';
  };

  const handleEmailLogin = (e) => {
    e.preventDefault();
    console.log('Email login:', email, password);
  };

  const handleGoogleLogin = () => {
    console.log('Google login clicked');
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
          Welcome Back
        </Typography>
        
        <Box component="form" onSubmit={handleEmailLogin} sx={{ mt: 1 }}>
          <TextField
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
            sx={{
              '& .MuiOutlinedInput-root': {
                '&:hover fieldset': {
                  borderColor: '#f97316',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#f97316',
                },
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: '#f97316',
              },
            }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                '&:hover fieldset': {
                  borderColor: '#f97316',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#f97316',
                },
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: '#f97316',
              },
            }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={!isFormValid()}
            sx={{ 
              mt: 3, 
              mb: 2,
              backgroundColor: '#f97316',
              '&:hover': {
                backgroundColor: '#fb923c',
              },
              '&.Mui-disabled': {
                backgroundColor: 'rgba(249, 115, 22, 0.3)',
              }
            }}
          >
            Login
          </Button>
        </Box>

        <Divider sx={{ width: '100%', my: 2 }}>OR</Divider>

        <Button
          fullWidth
          variant="outlined"
          startIcon={<GoogleIcon />}
          onClick={handleGoogleLogin}
          sx={{
            borderColor: '#f97316',
            color: '#f97316',
            '&:hover': {
              borderColor: '#fb923c',
              backgroundColor: 'rgba(249, 115, 22, 0.04)',
            },
          }}
        >
          Continue with Google
        </Button>

        <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <Button
            color="primary"
            size="small"
            sx={{ color: '#f97316' }}
          >
            Forgot password?
          </Button>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2">
              Don't have an account?
            </Typography>
            <Button
              variant="contained"
              fullWidth
              sx={{ 
                backgroundColor: '#f97316',
                '&:hover': {
                  backgroundColor: '#fb923c',
                },
                minWidth: '200px'
              }}
            >
              Sign up
            </Button>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;