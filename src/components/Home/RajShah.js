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

const baseColor = '#F7DEC4';
const colorList = [
    '#FCF3D9',
    '#213052',
    '#6a0609'
]

function RajShah() {
    const [style, setStyle] = useState({
        fontFamily: "Graphik",
        fontWeight: 700,
        fontSize: "clamp(2rem, 29dvw, 38dvh)",
        lineHeight: .8,
        color: baseColor,
    });    
    const [currColor, setCurrColor] = useState(0);
    const textRef = useRef(null);

    const handleMouseMove = (e) => {
        if (!textRef.current) {
            return;
        }

        const { clientX, clientY } = e;
        const { left, top, width, height } = textRef.current.getBoundingClientRect();
        const x = (clientX - left) / width;
        const y = (clientY - top) / height;

        let xOffset = (x - 0.5) * 5;
        let yOffset = (y - 0.5) * 5;
        xOffset = Math.min(Math.max(xOffset, -3), 2);
        yOffset = Math.min(Math.max(yOffset, -3), 2);

        const textShadow = `${xOffset}px ${yOffset}px 5px rgba(255, 255, 255, 0.15)`;
        const hoverColor = "#FCF3D9";

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
            fontSize: "clamp(2rem, 29dvw, 38dvh)",
            lineHeight: .8,
            textShadow,
            color: color || baseColor,
        });
    };

    return (
        <div
            style={{
                cursor: 'default',
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                height: '100%',
                marginTop: "clamp(1.5rem, 4dvh, 3rem)",
            }}
        >
            <h2
                style={{
                    cursor: 'pointer',
                    fontFamily: "Graphik",
                    fontWeight: 700,
                    fontSize: `clamp(1rem, 12dvw, 16dvh)`,
                    marginBlockStart: "1dvh",
                    marginBlockEnd: "1.5dvh",
                    marginInlineStart: "1.3dvw",
                    color: colorList[currColor],
                }}
                onClick={() => setCurrColor((currColor + 1) % colorList.length)}
            >
                Hello, I'm
            </h2>
            <div
                onMouseMove={handleMouseMove}
                style={{
                    color: baseColor,
                    margin: "0 0 0 0",
                }}>
                <h1
                    ref={textRef}
                    style={{
                        ...style,
                        margin: "0 0 0 0",
                    }}
                >
                    Raj <br></br> Shah.
                </h1>
            </div>
        </div>
    );
}

export default RajShah;
