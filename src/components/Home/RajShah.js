import React, { useState, useRef } from 'react';

function interpolateColor(color1, color2, factor) {
    const result = color1.slice(1).match(/.{2}/g).map((hex, index) => {
        const color1Val = parseInt(hex, 16);
        const color2Val = parseInt(color2.slice(1).match(/.{2}/g)[index], 16);
        const interpolatedVal = Math.round(color1Val + (color2Val - color1Val) * factor);
        return interpolatedVal.toString(16).padStart(2, '0');
    });

    return `#${result.join('')}`;
}

function RajShah() {
    const [style, setStyle] = useState({});
    const textRef = useRef(null);

    const handleMouseMove = (e) => {
        if (!textRef.current) {
            return;
        }

        const { clientX, clientY } = e;
        const { left, top, width, height } = textRef.current.getBoundingClientRect();
        const x = (clientX - left) / width;
        const y = (clientY - top) / height;

        const xOffset = (x - 0.5) * 5;
        const yOffset = (y - 0.5) * 5;
        const textShadow = `${xOffset}px ${yOffset}px 5px rgba(255, 255, 255, 0.2)`;

        const baseColor = '#EFBBA1';
        const hoverColor = '#FEFAE0';

        const distanceFromCenter = Math.sqrt(Math.pow(x - 0.5, 2) + Math.pow(y - 0.5, 2));
        const factor = Math.min(distanceFromCenter * 2, 1);
        const color = factor < 0.1 ? 
                      baseColor : 
                      interpolateColor(
                          baseColor, 
                          hoverColor,
                          factor
                      );

        setStyle({
            fontFamily: "Graphik",
            fontWeight: 700,
            fontSize: "clamp(2rem, 30dvw, 25rem)",
            lineHeight: .8,
            textShadow,
            color: color || baseColor,
            margin: 0,
            padding: 0,
        });
    };

    return (
        <div onMouseMove={handleMouseMove} style={{ cursor: 'crosshair', color: '#EFBBA1' }}>
            <h1
                ref={textRef}
                style={style}
            >
                Raj <br></br> Shah
            </h1>
        </div>
    );
}

export default RajShah;
