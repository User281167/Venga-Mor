"use client";

import React from 'react';
import './confetti.css';

const Confetti = () => {
    const confettiCount = 150;
    const confetti = [];

    for (let i = 0; i < confettiCount; i++) {
        confetti.push(<div key={i} className="confetti-piece"></div>);
    }

    return <div className="confetti-container">{confetti}</div>;
};

export default Confetti;
