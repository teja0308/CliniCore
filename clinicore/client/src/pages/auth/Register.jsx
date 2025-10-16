import { useState } from 'react';
import { Container, TextField, Button, MenuItem, Typography, Box } from '@mui/material';
import http from '../../api/http';
import '../../styles/auth.css';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'student', specialization: '', adminPasscode: '' });
  const [error, setError] = useState('');

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await http.post('/auth/register', form);
      window.location.href = '/auth/login';
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <Container maxWidth="xs">
      <Box component="form" onSubmit={submit} className="auth-form">
        <Typography variant="h5">Register</Typography>
        <TextField name="name" label="Name" fullWidth margin="normal" value={form.name} onChange={onChange} />
        <TextField name="email" label="Email" fullWidth margin="normal" value={form.email} onChange={onChange} />
        <TextField name="password" label="Password" type="password" fullWidth margin="normal" value={form.password} onChange={onChange} />
        <TextField name="role" select label="Role" fullWidth margin="normal" value={form.role} onChange={onChange}>
          <MenuItem value="student">Student</MenuItem>
          <MenuItem value="doctor">Doctor</MenuItem>
          <MenuItem value="admin">Admin</MenuItem>
        </TextField>
        {form.role === 'doctor' && (
          <TextField name="specialization" label="Specialization" fullWidth margin="normal" value={form.specialization} onChange={onChange} />
        )}
        {form.role === 'admin' && (
          <TextField name="adminPasscode" label="Admin Passcode" fullWidth margin="normal" value={form.adminPasscode} onChange={onChange} />
        )}
        {error && <Typography color="error" variant="body2">{error}</Typography>}
        <Button type="submit" variant="contained" fullWidth sx={{mt:2}}>Create account</Button>
      </Box>
    </Container>
  );
}


