import React from "react";
import { Paper, Table, TableHead, TableBody, TableRow, TableCell, Typography } from "@mui/material";

function groupByMonth(dates) {
  const groups = {};
  dates.forEach((dateStr) => {
    const date = new Date(dateStr);
    const monthKey = date.toLocaleString("default", { month: "long", year: "numeric" }); // e.g. "March 2025"
    if (!groups[monthKey]) groups[monthKey] = [];
    groups[monthKey].push(dateStr);
  });
  return groups;
}

export default function AnnualLeaveTable({ alDates, search }) {
  const ALLOTED = 21;

  const grouped = groupByMonth(alDates);

  const filteredEntries = Object.entries(grouped).filter(([month, dates]) => {
    const lowerSearch = search.toLowerCase();
    if (!lowerSearch) return true;
    if (month.toLowerCase().includes(lowerSearch)) return true;
    return dates.some((d) => d.toLowerCase().includes(lowerSearch));
  });

  const totalTaken = alDates.length;
  const remaining = ALLOTED - totalTaken;

  return (
    <Paper sx={{ maxWidth: 700, mx: "auto", p: 2, overflowX: "auto" }}>
      <Typography variant="h6" gutterBottom>
        Annual Leave Summary
      </Typography>
      <Typography variant="body1" gutterBottom>
        Total Taken: {totalTaken} / {ALLOTED} days
      </Typography>
      <Typography variant="body1" gutterBottom>
        Remaining: {remaining > 0 ? remaining : 0} days
      </Typography>

      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Month</TableCell>
            <TableCell>Date</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredEntries.length === 0 && (
            <TableRow>
              <TableCell colSpan={2} align="center">
                No results found.
              </TableCell>
            </TableRow>
          )}

          {filteredEntries.map(([month, dates]) => {
            return dates.map((dateStr, idx) => (
              <TableRow key={`${month}-${dateStr}`}>
                {/* Show month only on first row for this group */}
                {idx === 0 ? <TableCell rowSpan={dates.length}>{month}</TableCell> : null}
                <TableCell>
                  {new Date(dateStr).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </TableCell>
              </TableRow>
            ));
          })}
        </TableBody>
      </Table>
    </Paper>
  );
}
