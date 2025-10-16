import { useEffect, useState } from 'react';
import { Container, Typography, TextField, Button, Box, List, ListItem, ListItemText } from '@mui/material';
import http from '../../api/http';

export default function DoctorDashboard() {
  const [payload, setPayload] = useState({ startDate: '', endDate: '', startTime: '10:00', endTime: '12:00' });
  const [appts, setAppts] = useState([]);

  const onChange = (e) => setPayload({ ...payload, [e.target.name]: e.target.value });
  const submit = async (e) => {
    e.preventDefault();
    await http.post('/doctor/availability', payload);
    alert('Availability created');
  };

  const loadAppts = async () => { const { data } = await http.get('/appointments'); setAppts(data); };
  useEffect(()=>{ loadAppts(); }, []);

  const addRx = async (id) => {
    const text = prompt('Prescription');
    if (!text) return;
    await http.post(`/appointments/${id}/prescription`, { text });
    await loadAppts();
  };
  return (
    <Container>
      <Typography variant="h5" sx={{mb:2}}>Doctor Portal</Typography>
      <Box component="form" onSubmit={submit} sx={{display:'grid', gap:2, maxWidth:400}}>
        <TextField name="startDate" label="Start Date" type="date" InputLabelProps={{ shrink: true }} value={payload.startDate} onChange={onChange} />
        <TextField name="endDate" label="End Date" type="date" InputLabelProps={{ shrink: true }} value={payload.endDate} onChange={onChange} />
        <TextField name="startTime" label="Start Time" type="time" InputLabelProps={{ shrink: true }} value={payload.startTime} onChange={onChange} />
        <TextField name="endTime" label="End Time" type="time" InputLabelProps={{ shrink: true }} value={payload.endTime} onChange={onChange} />
        <Button type="submit" variant="contained">Create Slots</Button>
      </Box>
      <Typography variant="h6" sx={{mt:3}}>My Appointments</Typography>
      <List>
        {appts.map(a => (
          <ListItem key={a._id} secondaryAction={<Button size="small" onClick={()=>addRx(a._id)}>Prescription</Button>}>
            <ListItemText primary={`${new Date(a.start).toLocaleString()} with Student ${a.student}`} secondary={a.prescription?.text || a.status} />
          </ListItem>
        ))}
      </List>
    </Container>
  );
}


