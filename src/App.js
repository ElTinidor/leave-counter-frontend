import React, { useState } from "react";
import { Container, Typography, TextField, Button, Paper, Tabs, Tab } from "@mui/material";
import axios from "axios";

import AnnualLeaveTable from "./components/AnnualLeaveTable";
import SickLeaveTable from "./components/SickLeaveTable";
import HolidayTable from "./components/HolidayTable";

function App() {
  const [file, setFile] = useState(null);
  const [name, setName] = useState("");
  const [result, setResult] = useState(null);
  const [tab, setTab] = useState(0);
  const [search, setSearch] = useState("");

  const handleSubmit = async () => {
    if (!file || !name) {
      alert("Please enter your name and upload a file.");
      return;
    }
    const formData = new FormData();
    formData.append("file", file);
    formData.append("name", name);

    try {
      const res = await axios.post("https://leave-counter-backend-production.up.railway.app/count-leaves", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setResult(res.data);
    } catch (err) {
      console.error(err);
      alert("Error fetching results");
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Leave Counter
      </Typography>

      <Paper sx={{ p: 2, mb: 2 }}>
        <TextField
          fullWidth
          label="Your Name"
          variant="outlined"
          value={name}
          onChange={(e) => setName(e.target.value)}
          sx={{ mb: 2 }}
        />
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          style={{ marginBottom: 16 }}
        />
        <br />
        <Button variant="contained" onClick={handleSubmit}>
          Upload & Count
        </Button>
      </Paper>

      {result && (
        <>
          <Tabs value={tab} onChange={(_, v) => setTab(v)} centered sx={{ mb: 2 }}>
            <Tab label={`Annual Leave (${result.al_count})`} />
            <Tab label={`Sick Leave (${result.sl_count})`} />
            <Tab label={`Public Holiday (${result.ph_count})`} />
          </Tabs>

          <TextField
            label="Search by month or date"
            variant="outlined"
            fullWidth
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ mb: 2 }}
          />

          {tab === 0 && <AnnualLeaveTable alDates={result.al_dates} search={search} />}
          {tab === 1 && <SickLeaveTable slDates={result.sl_dates} search={search} />}
          {tab === 2 && <HolidayTable phDates={result.ph_dates} search={search} />}
        </>
      )}
    </Container>
  );
}

export default App;
