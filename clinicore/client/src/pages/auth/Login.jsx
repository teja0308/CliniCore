import { useState } from 'react';
import { Container, TextField, Button, MenuItem, Typography, Box } from '@mui/material';
import http from '../../api/http';
import '../../styles/auth.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const { data } = await http.post('/auth/login', { email, password, role });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      window.location.href = `/${data.user.role}`;
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <Container maxWidth="xs">
      <Box component="form" onSubmit={submit} className="auth-form">
        <Typography variant="h5">Login</Typography>
        <TextField label="Email" fullWidth margin="normal" value={email} onChange={(e)=>setEmail(e.target.value)} />
        <TextField label="Password" type="password" fullWidth margin="normal" value={password} onChange={(e)=>setPassword(e.target.value)} />
        <TextField select label="Role" fullWidth margin="normal" value={role} onChange={(e)=>setRole(e.target.value)}>
          <MenuItem value="student">Student</MenuItem>
          <MenuItem value="doctor">Doctor</MenuItem>
          <MenuItem value="admin">Admin</MenuItem>
        </TextField>
        {error && <Typography color="error" variant="body2">{error}</Typography>}
        <Button type="submit" variant="contained" fullWidth sx={{mt:2}}>Login</Button>
      </Box>
    </Container>
  );
}


