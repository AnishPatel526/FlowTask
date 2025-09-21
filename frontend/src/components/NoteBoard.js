import React, { useRef, useEffect, useState } from 'react';
import socket from '../services/socket';

export default function NoteBoard() {
  const canvasRef = useRef(null);
  const [drawing, setDrawing] = useState(false);
  const [context, setContext] = useState(null);

  // Set up canvas and socket listeners
  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    const ctx = canvas.getContext('2d');
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    setContext(ctx);

    // Receive whiteboard events from server
    socket.on('whiteboardEvent', (data) => {
      drawLine(data.x0, data.y0, data.x1, data.y1, false);
    });
    return () => {
      socket.off('whiteboardEvent');
    };
  }, []);

  const drawLine = (x0, y0, x1, y1, emit) => {
    if (!context) return;
    context.beginPath();
    context.moveTo(x0, y0);
    context.lineTo(x1, y1);
    context.stroke();
    context.closePath();
    if (!emit) return;
    socket.emit('whiteboardEvent', { x0, y0, x1, y1 });
  };

  const getRelativePos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const handleMouseDown = (e) => {
    setDrawing(true);
    const pos = getRelativePos(e);
    setLastPos(pos);
  };

  const [lastPos, setLastPos] = useState({ x: 0, y: 0 });
  const handleMouseMove = (e) => {
    if (!drawing) return;
    const pos = getRelativePos(e);
    drawLine(lastPos.x, lastPos.y, pos.x, pos.y, true);
    setLastPos(pos);
  };

  const handleMouseUp = () => {
    setDrawing(false);
  };

  return (
    <div className="noteboard-container">
      <h2>Collaborative Whiteboard</h2>
      <canvas
        ref={canvasRef}
        className="whiteboard"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseOut={handleMouseUp}
      />
    </div>
  );
}