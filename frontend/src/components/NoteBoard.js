import React, { useCallback, useEffect, useRef, useState } from 'react';
import socket from '../services/socket';

export default function NoteBoard() {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const lastPositionRef = useRef(null);
  const [drawing, setDrawing] = useState(false);
  const [penColor, setPenColor] = useState('#6366f1');
  const [penWidth, setPenWidth] = useState(3);

  const drawStroke = useCallback((stroke, emit = false) => {
    const context = contextRef.current;
    const canvas = canvasRef.current;
    if (!context || !canvas) return;

    const { x0, y0, x1, y1, color, lineWidth } = stroke;
    if ([x0, y0, x1, y1].some((value) => typeof value !== 'number')) return;

    const strokeColor = color || '#334155';
    const strokeWidth = lineWidth || 3;

    context.strokeStyle = strokeColor;
    context.lineWidth = strokeWidth;
    context.beginPath();
    context.moveTo(x0, y0);
    context.lineTo(x1, y1);
    context.stroke();
    context.closePath();

    if (!emit) return;
    socket.emit('whiteboardEvent', {
      x0,
      y0,
      x1,
      y1,
      color: strokeColor,
      lineWidth: strokeWidth
    });
  }, []);

  // Set up canvas and socket listeners
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ratio = window.devicePixelRatio || 1;
    canvas.width = canvas.offsetWidth * ratio;
    canvas.height = canvas.offsetHeight * ratio;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (typeof ctx.resetTransform === 'function') {
      ctx.resetTransform();
    } else {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
    }
    ctx.scale(ratio, ratio);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    contextRef.current = ctx;

    const handleWhiteboardEvent = (data) => {
      if (!data) return;
      if (data.type === 'clear') {
        const context = contextRef.current;
        if (!context) return;
        context.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
        return;
      }
      drawStroke(data, false);
    };

    socket.on('whiteboardEvent', handleWhiteboardEvent);
    return () => {
      socket.off('whiteboardEvent', handleWhiteboardEvent);
    };
  }, [drawStroke]);

  const getRelativePos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const handleMouseDown = (e) => {
    setDrawing(true);
    lastPositionRef.current = getRelativePos(e);
  };

  const handleMouseMove = (e) => {
    if (!drawing) return;
    const nextPos = getRelativePos(e);
    const prevPos = lastPositionRef.current;
    if (!prevPos) {
      lastPositionRef.current = nextPos;
      return;
    }

    drawStroke(
      {
        x0: prevPos.x,
        y0: prevPos.y,
        x1: nextPos.x,
        y1: nextPos.y,
        color: penColor,
        lineWidth: penWidth
      },
      true
    );
    lastPositionRef.current = nextPos;
  };

  const handleMouseUp = () => {
    setDrawing(false);
    lastPositionRef.current = null;
  };

  const handleClear = () => {
    const context = contextRef.current;
    const canvas = canvasRef.current;
    if (!context || !canvas) return;
    context.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
    socket.emit('whiteboardEvent', { type: 'clear' });
  };

  const colors = ['#6366f1', '#22d3ee', '#ef4444', '#f59e0b', '#10b981', '#f472b6'];

  return (
    <section className="noteboard-container">
      <div className="view-heading">
        <h2>Collaborative whiteboard</h2>
        <p>Sketch flows, map ideas, or jot quick notes while your teammates watch live.</p>
      </div>
      <div className="surface-card whiteboard-wrapper">
        <div className="whiteboard-controls">
          <div className="control-group">
            <span className="muted">Pen</span>
            <div className="color-swatches">
              {colors.map((color) => (
                <button
                  key={color}
                  type="button"
                  className={`color-swatch${penColor === color ? ' is-active' : ''}`}
                  style={{ backgroundColor: color }}
                  onClick={() => setPenColor(color)}
                  aria-label={`Select ${color} ink`}
                />
              ))}
            </div>
          </div>
          <div className="control-group stroke-control">
            <label htmlFor="stroke-width" className="muted">
              Stroke
            </label>
            <input
              id="stroke-width"
              type="range"
              min="1"
              max="12"
              value={penWidth}
              onChange={(e) => setPenWidth(Number(e.target.value))}
            />
            <span className="stroke-value">{penWidth}px</span>
          </div>
          <div className="control-group">
            <button type="button" className="clear-board" onClick={handleClear}>
              Clear board
            </button>
          </div>
        </div>
        <canvas
          ref={canvasRef}
          className="whiteboard"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        />
      </div>
    </section>
  );
}
