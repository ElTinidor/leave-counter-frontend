import React from "react";
import { Paper, Table, TableHead, TableBody, TableRow, TableCell, Typography } from "@mui/material";

function groupByMonth(dates) {
  const groups = {};
  dates.forEach((dateStr) => {
    const date = new Date(dateStr);
    const monthKey = date.toLocaleString("default", { month: "long", year: "numeric" });
    if (!groups[monthKey]) groups[monthKey] = [];
    groups[monthKey].push(dateStr);
  });
  return groups;
}

export default function HolidayTable({ phDates, search }) {
  const TOTAL_HOLIDAYS = 26;  

  const grouped = groupByMonth(phDates);

  const filteredEntries = Object.entries(grouped).filter(([month, dates]) => {
    const lowerSearch = search.toLowerCase();
    if (!lowerSearch) return true;
    if (month.toLowerCase().includes(lowerSearch)) return true;
    return dates.some((d) => d.toLowerCase().includes(lowerSearch));
  });

  const totalTaken = phDates.length;
  const remaining = TOTAL_HOLIDAYS - totalTaken;

  return (
    <Paper sx={{ maxWidth: 700, mx: "auto", p: 2, overflowX: "auto" }}>
      <Typography variant="h6" gutterBottom>
        Public Holiday Summary
      </Typography>
      <Typography variant="body1" gutterBottom>
        Total Holidays: {totalTaken} / {TOTAL_HOLIDAYS}
      </Typography>
      <Typography variant="body1" gutterBottom>
        Remaining: {remaining > 0 ? remaining : 0}
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

          {filteredEntries.map(([month, dates]) =>
            dates.map((dateStr, idx) => (
              <TableRow key={`${month}-${dateStr}`}>
                {idx === 0 ? <TableCell rowSpan={dates.length}>{month}</TableCell> : null}
                <TableCell>
                  {new Date(dateStr).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </Paper>
  );
}
