import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateUser } from '../firebase/userService';
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
    ToggleButton,
    MenuItem
} from '@mui/material';
import './SignupStep2Manual.css';

const SignupStep2Manual = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        birthDate: '',
        gender: 'male',
        weight: '',
        height: '',
        goal: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [measurementSystem, setMeasurementSystem] = useState('metric');
    const [formErrors, setFormErrors] = useState({
        birthDate: false,
        weight: false,
        height: false,
        goal: false
    });

    const goals = [
        "Weight Loss",
        "Muscle Gain",
        "Improve Endurance",
        "Maintain Fitness",
        "Better Overall Health"
    ];

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
            if (error && error.includes('10 years old')) {
                setError('');
            }
        }
        
        // Validation pour les champs numériques
        if (name === 'weight' || name === 'height') {
            finalValue = value.replace(/[^\d.]/g, '');
            
            const dots = finalValue.match(/\./g);
            if (dots && dots.length > 1) {
                hasError = true;
                setFormErrors(prev => ({ ...prev, [name]: true }));
                return;
            }

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

        if (error && !error.includes('10 years old')) {
            setError('');
        }
    };

    const handleMeasurementSystemChange = (event, newSystem) => {
        if (newSystem !== null) {
            let newWeight = formData.weight;
            let newHeight = formData.height;

            if (formData.weight) {
                if (newSystem === 'imperial') {
                    newWeight = (parseFloat(formData.weight) * 2.20462).toFixed(2);
                } else {
                    newWeight = (parseFloat(formData.weight) / 2.20462).toFixed(2);
                }
            }

            if (formData.height) {
                if (newSystem === 'imperial') {
                    newHeight = (parseFloat(formData.height) / 2.54).toFixed(2);
                } else {
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

        return formData.birthDate && 
               formData.gender && 
               formData.weight && 
               formData.height &&
               formData.goal;
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

            await updateUser(userData);
            navigate('/chat');
        } catch (error) {
            console.error('Error during profile update:', error);
            setError('An error occurred while updating your profile. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="signup-step2-container">
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
                    type="date"
                    label="Birth Date"
                    name="birthDate"
                    value={formData.birthDate}
                    onChange={handleInputChange}
                    fullWidth
                    className="form-field"
                    InputLabelProps={{ shrink: true }}
                    error={formErrors.birthDate}
                    helperText={formErrors.birthDate ? 
                        'You must be at least 10 years old to register' : ''}
                />

                <FormControl component="fieldset" className="form-field">
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
                        className="measurement-toggle"
                    >
                        <ToggleButton value="metric">
                            Metric (kg/cm)
                        </ToggleButton>
                        <ToggleButton value="imperial">
                            Imperial (lbs/in)
                        </ToggleButton>
                    </ToggleButtonGroup>
                </Box>

                <div className="form-row">
                    <TextField
                        required
                        label={`Weight (${measurementSystem === 'metric' ? 'kg' : 'lbs'})`}
                        name="weight"
                        value={formData.weight}
                        onChange={handleInputChange}
                        className="form-field"
                        type="text"
                        error={formErrors.weight}
                        helperText="Enter a number with up to 2 decimal places"
                    />
                    <TextField
                        required
                        label={`Height (${measurementSystem === 'metric' ? 'cm' : 'inches'})`}
                        name="height"
                        value={formData.height}
                        onChange={handleInputChange}
                        className="form-field"
                        type="text"
                        error={formErrors.height}
                        helperText="Enter a number with up to 2 decimal places"
                    />
                </div>

                <TextField
                    required
                    select
                    label="Primary Goal"
                    name="goal"
                    value={formData.goal}
                    onChange={handleInputChange}
                    className="form-field"
                    error={formErrors.goal}
                >
                    {goals.map((goal) => (
                        <MenuItem key={goal} value={goal}>
                            {goal}
                        </MenuItem>
                    ))}
                </TextField>

                <Button
                    type="submit"
                    variant="contained"
                    className="next-button"
                    disabled={!isFormValid() || loading}
                >
                    {loading ? 'Updating Profile...' : 'Continue'}
                </Button>
            </form>
        </Container>
    );
};

export default SignupStep2Manual;
