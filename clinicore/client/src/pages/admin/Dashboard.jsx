import { useEffect, useState } from 'react';
import { Container, Typography, Button, List, ListItem, ListItemText, Box } from '@mui/material';
import http from '../../api/http';

export default function AdminDashboard() {
  const [pending, setPending] = useState([]);
  const [complaints, setComplaints] = useState([]);

  const load = async () => {
    const p = await http.get('/admin/doctors/pending');
    const c = await http.get('/admin/complaints');
    setPending(p.data);
    setComplaints(c.data);
  };
  useEffect(() => { load(); }, []);

  const approve = async (id) => { await http.post(`/admin/doctors/${id}/approve`); await load(); };
  const reject = async (id) => { await http.post(`/admin/doctors/${id}/reject`); await load(); };

  return (
    <Container>
      <Typography variant="h5" sx={{mb:2}}>Admin Portal</Typography>
      <Typography variant="h6">Pending Doctors</Typography>
      <List>
        {pending.map(d => (
          <ListItem key={d._id} secondaryAction={
            <Box sx={{display:'flex', gap:1}}>
              <Button size="small" variant="contained" onClick={()=>approve(d._id)}>Approve</Button>
              <Button size="small" color="error" variant="outlined" onClick={()=>reject(d._id)}>Reject</Button>
            </Box>
          }>
            <ListItemText primary={`${d.name} — ${d.specialization}`} secondary={d.email} />
          </ListItem>
        ))}
      </List>

      <Typography variant="h6" sx={{mt:3}}>Complaints</Typography>
      <List>
        {complaints.map(c => (
          <ListItem key={c._id}>
            <ListItemText primary={c.text} secondary={new Date(c.createdAt).toLocaleString()} />
          </ListItem>
        ))}
      </List>
    </Container>
  );
}


