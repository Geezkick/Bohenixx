"use client";

import React, { useEffect, useRef } from "react";
import createGlobe from "cobe";

export default function CobeGlobe() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let phi = 0;
    let width = 0;
    let globe: any;
    
    const onResize = () => {
      if (canvasRef.current) {
        width = canvasRef.current.offsetWidth;
      }
    };
    
    window.addEventListener('resize', onResize);
    onResize();

    if (canvasRef.current) {
      globe = createGlobe(canvasRef.current, {
        devicePixelRatio: 2,
        width: width * 2,
        height: width * 2,
        phi: 0,
        theta: 0.2,
        dark: 1,
        diffuse: 1.2,
        mapSamples: 16000,
        mapBrightness: 6,
        baseColor: [0.1, 0.05, 0.15],
        markerColor: [0.69, 0.29, 1.0], // #B14CFF glowing purple
        glowColor: [0.1, 0.05, 0.2],
        markers: [
          // Nairobi, Kenya
          { location: [-1.2921, 36.8219], size: 0.08 },
          // Lagos, Nigeria
          { location: [6.5244, 3.3792], size: 0.06 },
          // Johannesburg, SA
          { location: [-26.2041, 28.0473], size: 0.06 },
          // Kigali, Rwanda
          { location: [-1.9403, 30.0599], size: 0.05 },
          // Cairo, Egypt
          { location: [30.0444, 31.2357], size: 0.05 }
        ],
        // @ts-expect-error - onRender is valid but missing from some types
        onRender: (state: any) => {
          // Called on every animation frame.
          // `state` will be an empty object, return updated params.
          state.phi = phi;
          phi += 0.005;
          state.width = width * 2;
          state.height = width * 2;
        }
      });
    }

    return () => {
      if (globe) globe.destroy();
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <div style={{ width: '100%', maxWidth: '600px', aspectRatio: 1, margin: 'auto', position: 'relative' }}>
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
          contain: 'layout paint size',
          opacity: 1,
          transition: 'opacity 1s ease',
        }}
      />
    </div>
  );
}
