import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateUser } from '../firebase/userService';
import { auth } from '../firebase/config';
import { 
    TextField, 
    Button, 
    Typography, 
    Container,
    FormControl,
    FormLabel,
    RadioGroup,
    FormControlLabel,
    Radio,
    Box,
    Alert,
    Fade,
    ToggleButtonGroup,
    ToggleButton
} from '@mui/material';
import './SignupStepGoogle.css';

const SignupStepGoogle = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        birthDate: '',
        gender: 'male',
        weight: '',
        height: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [measurementSystem, setMeasurementSystem] = useState('metric');
    const [formErrors, setFormErrors] = useState({
        firstName: false,
        lastName: false,
        birthDate: false,
        weight: false,
        height: false
    });

    const validateAge = (birthDate) => {
        const today = new Date();
        const birthDateObj = new Date(birthDate);
        const age = today.getFullYear() - birthDateObj.getFullYear();
        const monthDiff = today.getMonth() - birthDateObj.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDateObj.getDate())) {
            return age - 1;
        }
        return age;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        let finalValue = value;
        let hasError = false;

        if (name === 'birthDate') {
            const age = validateAge(value);
            if (age < 10) {
                setError('You must be at least 10 years old to register');
                setFormErrors(prev => ({ ...prev, birthDate: true }));
                return;
            } else {
                setFormErrors(prev => ({ ...prev, birthDate: false }));
            }
            // Clear error if valid age
            if (error && error.includes('10 years old')) {
                setError('');
            }
        }

        // Validation pour les noms (lettres, espaces et tirets uniquement)
        if (name === 'firstName' || name === 'lastName') {
            finalValue = value.replace(/[^A-Za-z -]/g, '');
            hasError = finalValue.length === 0;
            setFormErrors(prev => ({ ...prev, [name]: hasError }));
        }
        
        // Validation pour les champs numériques
        if (name === 'weight' || name === 'height') {
            // Ne permet que les chiffres et un point décimal
            finalValue = value.replace(/[^\d.]/g, '');
            
            // Empêche plus d'un point décimal
            const dots = finalValue.match(/\./g);
            if (dots && dots.length > 1) {
                hasError = true;
                setFormErrors(prev => ({ ...prev, [name]: true }));
                return;
            }

            // Limite à deux décimales
            if (finalValue.includes('.')) {
                const [, decimal] = finalValue.split('.');
                if (decimal && decimal.length > 2) {
                    hasError = true;
                    setFormErrors(prev => ({ ...prev, [name]: true }));
                    return;
                }
            }
            
            setFormErrors(prev => ({ ...prev, [name]: hasError }));
        }

        setFormData(prev => ({
            ...prev,
            [name]: finalValue
        }));

        // Clear error when user starts typing again
        if (error && !error.includes('10 years old')) {
            setError('');
        }
    };

    const handleMeasurementSystemChange = (event, newSystem) => {
        if (newSystem !== null) {
            // Convertir les valeurs existantes
            let newWeight = formData.weight;
            let newHeight = formData.height;

            if (formData.weight) {
                if (newSystem === 'imperial') {
                    // kg to lbs
                    newWeight = (parseFloat(formData.weight) * 2.20462).toFixed(2);
                } else {
                    // lbs to kg
                    newWeight = (parseFloat(formData.weight) / 2.20462).toFixed(2);
                }
            }

            if (formData.height) {
                if (newSystem === 'imperial') {
                    // cm to inches
                    newHeight = (parseFloat(formData.height) / 2.54).toFixed(2);
                } else {
                    // inches to cm
                    newHeight = (parseFloat(formData.height) * 2.54).toFixed(2);
                }
            }

            setFormData(prev => ({
                ...prev,
                weight: newWeight,
                height: newHeight
            }));
            setMeasurementSystem(newSystem);
        }
    };

    const isFormValid = () => {
        if (!formData.birthDate) return false;
        
        const age = validateAge(formData.birthDate);
        if (age < 10) return false;

        return formData.firstName && 
               formData.lastName && 
               formData.birthDate && 
               formData.gender;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        const age = validateAge(formData.birthDate);
        if (age < 10) {
            setError('You must be at least 10 years old to register');
            return;
        }

        if (!isFormValid()) {
            setError('Please fill in all required fields');
            return;
        }

        try {
            setLoading(true);
            setError('');

            const googleUser = await auth.signInWithPopup(new auth.GoogleAuthProvider());
            
            // Convertir en métrique pour le stockage si nécessaire
            let weightInMetric = formData.weight;
            let heightInMetric = formData.height;

            if (measurementSystem === 'imperial' && formData.weight) {
                weightInMetric = (parseFloat(formData.weight) / 2.20462).toFixed(2);
            }

            if (measurementSystem === 'imperial' && formData.height) {
                heightInMetric = (parseFloat(formData.height) * 2.54).toFixed(2);
            }

            const userData = {
                ...formData,
                email: googleUser.user.email,
                isGoogleUser: true,
                measurements: {
                    weight: weightInMetric ? parseFloat(weightInMetric) : null,
                    height: heightInMetric ? parseFloat(heightInMetric) : null,
                    measurementSystem
                },
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                accountStatus: 'active',
                profileCompleted: true
            };

            await updateUser(googleUser.user.uid, userData);
            navigate('/chat');
        } catch (error) {
            console.error('Error during Google signup:', error);
            if (error.code === 'auth/popup-blocked') {
                setError('Please enable popups to use Google sign-in');
            } else if (error.code === 'auth/cancelled-popup-request') {
                setError('Google sign-in was cancelled. Please try again');
            } else if (error.code === 'auth/account-exists-with-different-credential') {
                setError('An account already exists with this email. Please use a different email or try logging in.');
            } else if (error.message && error.message.includes('already registered')) {
                setError('This email is already registered. Please use a different email or log in to your existing account.');
                navigate('/login'); // Rediriger vers la page de connexion
            } else {
                setError('An error occurred during signup. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="container-box">
            <Typography variant="h4" className="title">
                Complete Your Profile
            </Typography>
            {error && (
                <Fade in={true} timeout={500}>
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                </Fade>
            )}
            <form onSubmit={handleSubmit} className="form">
                <TextField
                    required
                    label="First Name"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    fullWidth
                    className="input-field"
                    error={formErrors.firstName}
                    helperText="Only letters, spaces and hyphens are allowed"
                />
                <TextField
                    required
                    label="Last Name"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    fullWidth
                    className="input-field"
                    error={formErrors.lastName}
                    helperText="Only letters, spaces and hyphens are allowed"
                />
                <TextField
                    required
                    type="date"
                    label="Birth Date"
                    name="birthDate"
                    value={formData.birthDate}
                    onChange={handleInputChange}
                    fullWidth
                    className="input-field"
                    InputLabelProps={{ shrink: true }}
                    error={formErrors.birthDate}
                    helperText={formErrors.birthDate ? 
                        'You must be at least 10 years old to register' : ''}
                />
                <FormControl component="fieldset" className="input-field">
                    <FormLabel>Gender</FormLabel>
                    <RadioGroup
                        name="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                        row
                    >
                        <FormControlLabel value="male" control={<Radio />} label="Male" />
                        <FormControlLabel value="female" control={<Radio />} label="Female" />
                        <FormControlLabel value="other" control={<Radio />} label="Other" />
                    </RadioGroup>
                </FormControl>

                <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
                    <ToggleButtonGroup
                        value={measurementSystem}
                        exclusive
                        onChange={handleMeasurementSystemChange}
                        aria-label="measurement system"
                        sx={{
                            '& .MuiToggleButton-root': {
                                color: '#f97316',
                                borderColor: '#f97316',
                                '&.Mui-selected': {
                                    color: '#fff',
                                    backgroundColor: '#f97316',
                                    '&:hover': {
                                        backgroundColor: '#ea580c',
                                    },
                                },
                                '&:hover': {
                                    backgroundColor: 'rgba(249, 115, 22, 0.1)',
                                },
                            },
                        }}
                    >
                        <ToggleButton value="metric">
                            Metric (kg/cm)
                        </ToggleButton>
                        <ToggleButton value="imperial">
                            Imperial (lbs/in)
                        </ToggleButton>
                    </ToggleButtonGroup>
                </Box>

                <TextField
                    label={`Weight (${measurementSystem === 'metric' ? 'kg' : 'lbs'})`}
                    name="weight"
                    value={formData.weight}
                    onChange={handleInputChange}
                    fullWidth
                    className="input-field"
                    type="text"
                    error={formErrors.weight}
                    helperText="Enter a number with up to 2 decimal places"
                />
                <TextField
                    label={`Height (${measurementSystem === 'metric' ? 'cm' : 'inches'})`}
                    name="height"
                    value={formData.height}
                    onChange={handleInputChange}
                    fullWidth
                    className="input-field"
                    type="text"
                    error={formErrors.height}
                    helperText="Enter a number with up to 2 decimal places"
                />
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    className="submit-button"
                    disabled={!isFormValid() || loading}
                >
                    {loading ? 'Creating Account...' : 'Confirm'}
                </Button>
            </form>
        </Container>
    );
};

export default SignupStepGoogle;
