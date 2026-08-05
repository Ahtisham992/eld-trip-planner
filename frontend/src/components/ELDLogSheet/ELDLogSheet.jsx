import React, { useRef, useEffect } from 'react';
import './ELDLogSheet.css';

const ELDLogSheet = ({ log }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !log) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Constants for drawing
    const marginX = 160; // Left margin for labels (increased for long labels)
    const marginY = 40;  // Top margin
    const gridWidth = width - marginX - 30; // right margin
    const rowHeight = 40;
    
    const rows = [
      { id: 'off_duty', label: '1. OFF DUTY', index: 0 },
      { id: 'sleeper_berth', label: '2. SLEEPER BERTH', index: 1 },
      { id: 'driving', label: '3. DRIVING', index: 2 },
      { id: 'on_duty', label: '4. ON DUTY (NOT DRIVING)', index: 3 }
    ];
    
    // Draw background
    ctx.fillStyle = '#ffffff'; // Match --bg-secondary
    ctx.fillRect(0, 0, width, height);
    
    // Draw Headers
    ctx.font = '500 12px Outfit, sans-serif';
    ctx.fillStyle = '#0f172a'; // Match --text-primary
    ctx.textAlign = 'center';
    
    // Draw Midnight to Noon to Midnight labels
    const hours = ['M', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', 'N', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', 'M'];
    
    hours.forEach((h, i) => {
      const x = marginX + (i * (gridWidth / 24));
      ctx.fillText(h, x, marginY - 10);
      
      // Draw vertical lines
      ctx.beginPath();
      ctx.strokeStyle = '#e2e8f0'; // Slate 200
      ctx.lineWidth = 1;
      ctx.moveTo(x, marginY);
      ctx.lineTo(x, marginY + (4 * rowHeight));
      ctx.stroke();
      
      // Draw half-hour tick marks
      if (i < 24) {
        const halfX = x + ((gridWidth / 24) / 2);
        ctx.beginPath();
        ctx.strokeStyle = '#f1f5f9'; // Slate 100
        ctx.moveTo(halfX, marginY);
        ctx.lineTo(halfX, marginY + (4 * rowHeight));
        ctx.stroke();
      }
    });
    
    // Draw Rows
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    
    rows.forEach((row, i) => {
      const y = marginY + (i * rowHeight);
      
      // Horizontal line
      ctx.beginPath();
      ctx.strokeStyle = '#cbd5e1'; // Slate 300
      ctx.lineWidth = 1;
      ctx.moveTo(marginX, y + (rowHeight / 2));
      ctx.lineTo(marginX + gridWidth, y + (rowHeight / 2));
      ctx.stroke();
      
      // Row label
      ctx.fillStyle = '#475569'; // Match --text-secondary
      ctx.fillText(row.label, 10, y + (rowHeight / 2));
    });
    
    // Draw border around grid
    ctx.beginPath();
    ctx.strokeStyle = '#94a3b8'; // Slate 400
    ctx.lineWidth = 1;
    ctx.rect(marginX, marginY, gridWidth, 4 * rowHeight);
    ctx.stroke();
    
    // Draw log entries
    if (log.entries && log.entries.length > 0) {
      ctx.beginPath();
      ctx.strokeStyle = '#305c3d'; // Forest Green for high contrast
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.lineWidth = 3;
      
      let prevX = null;
      let prevY = null;
      
      log.entries.forEach((entry, index) => {
        const row = rows.find(r => r.id === entry.duty_status);
        if (!row) return;
        
        const y = marginY + (row.index * rowHeight) + (rowHeight / 2);
        const startX = marginX + (entry.start_hour / 24) * gridWidth;
        const endX = marginX + (entry.end_hour / 24) * gridWidth;
        
        // Draw vertical line if duty status changed
        if (prevX !== null && prevY !== null && prevY !== y) {
          ctx.moveTo(prevX, prevY);
          ctx.lineTo(startX, y);
        }
        
        // Draw horizontal line for this period
        ctx.moveTo(startX, y);
        ctx.lineTo(endX, y);
        
        prevX = endX;
        prevY = y;
      });
      
      ctx.stroke();
    }
    
  }, [log]);

  if (!log) return null;

  return (
    <div className="eld-log-sheet card glass-panel">
      <div className="log-header">
        <h3>Daily Log: Day {log.day_number}</h3>
        <span className="log-date">{new Date(log.log_date).toLocaleDateString()}</span>
      </div>
      
      <div className="log-info-grid">
        <div className="info-item">
          <label>From</label>
          <span>{log.from_location}</span>
        </div>
        <div className="info-item">
          <label>To</label>
          <span>{log.to_location}</span>
        </div>
        <div className="info-item">
          <label>Total Miles</label>
          <span>{log.total_miles_driving.toFixed(0)}</span>
        </div>
        <div className="info-item">
          <label>Hours Used</label>
          <span>{log.recap_hours.hours_used_today.toFixed(1)}</span>
        </div>
      </div>
      
      <div className="canvas-container">
        <canvas 
          ref={canvasRef} 
          width={800} 
          height={240} 
          className="log-canvas"
        ></canvas>
      </div>
      
      <div className="log-remarks">
        <h4>Events & Remarks</h4>
        <ul>
          {log.entries.filter(e => e.duty_status !== 'off_duty' || e.end_hour - e.start_hour < 10).map((entry, idx) => (
            <li key={idx}>
              <strong>{entry.duty_status.replace('_', ' ').toUpperCase()}</strong>
              {' '} ({entry.start_hour.toFixed(2)} - {entry.end_hour.toFixed(2)}): {entry.location} {entry.remarks}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ELDLogSheet;
