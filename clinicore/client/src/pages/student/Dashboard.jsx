import { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Button,
  TextField,
  MenuItem,
  Box,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import http from '../../api/http';

export default function StudentDashboard() {
  const [doctors, setDoctors] = useState([]);
  const [doctorId, setDoctorId] = useState('');
  const [date, setDate] = useState('');
  const [slots, setSlots] = useState([]);
  const [complaint, setComplaint] = useState('');
  const [appts, setAppts] = useState([]);

  const loadAppointments = async () => {
    const { data } = await http.get('/appointments');
    setAppts(data);
  };

  useEffect(() => {
    (async () => {
      const { data } = await http.get('/doctors');
      setDoctors(data);
      await loadAppointments();
    })();
  }, []);

  const loadSlots = async () => {
    const { data } = await http.get(`/doctors/${doctorId}/slots`, { params: { date } });
    setSlots(data);
  };

  const book = async (start) => {
    await http.post('/appointments', { doctorId, startISO: start });
    await loadSlots();
    await loadAppointments();
  };

  const cancel = async (id) => {
    await http.delete(`/appointments/${id}`);
    await loadAppointments();
  };

  return (
    <Container>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Student Portal
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <TextField
          select
          label="Doctor"
          value={doctorId}
          onChange={(e) => setDoctorId(e.target.value)}
        >
          {doctors.map((d) => (
            <MenuItem key={d._id} value={d._id}>
              {d.name} — {d.specialization}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <Button variant="contained" onClick={loadSlots}>
          Load Slots
        </Button>
      </Box>

      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        {slots.map((s) => (
          <Button
            key={s.start}
            variant="outlined"
            onClick={() => book(s.start)}
          >
            {new Date(s.start).toLocaleTimeString()}
          </Button>
        ))}
      </Box>

      <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
        <TextField
          placeholder="Complaint..."
          fullWidth
          value={complaint}
          onChange={(e) => setComplaint(e.target.value)}
        />
        <Button
          variant="outlined"
          onClick={async () => {
            if (!complaint) return;
            await http.post('/help/complaint', { text: complaint });
            setComplaint('');
          }}
        >
          Submit
        </Button>
      </Box>

      <Typography variant="h6" sx={{ mt: 3 }}>
        My Appointments
      </Typography>
      <List>
        {appts.map((a) => (
          <ListItem
            key={a._id}
            secondaryAction={
              <Button
                size="small"
                color="error"
                onClick={() => cancel(a._id)}
              >
                Cancel
              </Button>
            }
          >
            <ListItemText
              primary={`${new Date(a.start).toLocaleString()} with Doctor ${a.doctor}`}
              secondary={
                a.prescription?.text
                  ? `Prescription: ${a.prescription.text}`
                  : a.status
              }
            />
          </ListItem>
        ))}
      </List>
    </Container>
  );
}
