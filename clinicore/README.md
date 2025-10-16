## CliniCore (MERN) — NITW Dispensary

### Prerequisites
- Node 18+
- MongoDB (local or Atlas)

### Environment
Create `server/.env` with:

```
MONGO_URI=mongodb://localhost:27017/clinicore
JWT_SECRET=replace_me
JWT_EXPIRES_IN=7d
ADMIN_PASSCODE=xspark
PORT=5000
```

### Install & Run (Backend)
```
cd clinicore/server
npm install
npm run dev
```

### Install & Run (Frontend)
```
cd clinicore/client
npm install
npm run dev
```

### Seed
```
cd clinicore/server
node seed.js
```

### Roles
- student, doctor, admin (admin register requires passcode `xspark`)

### Notes
- Times are stored in UTC; campus hours enforced for Asia/Kolkata (09:00–20:00).
- Slots are 20 minutes aligned to 00/20/40.
 - Doctors must be approved by admin before login.
 - Students can cancel if start - now > 30 minutes; slot is freed.


