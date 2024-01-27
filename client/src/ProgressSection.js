import React, { useState, useEffect, useCallback } from "react";

const progressContainerStyle = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
}

const progressBarContainerStyle = {
    width: '500px',
    height: '10px',
    backgroundColor: '#ccc',
    margin: '10px',
    position: 'relative',
}

const progressBarStyle = {
    height: '100%',
    width: '0',
    backgroundColor: '#4caf50',
    position: 'absolute',
}

const ProgressSection = ({ audio }) => {
    const [timestamp, setTimestamp] = useState('0:00 / 0:00');

    const progressBar = document.getElementById('progressBar');
    const progressBarContainer = document.getElementById('progressBarContainer');

    const updateTimeAndProgressBar = useCallback(() => {
        // Update Time
        const currentTime = formatTime(audio.currentTime);
        const duration = formatTime(audio.duration);
        setTimestamp(`${currentTime} / ${duration}`);

        // Update Progress Bar
        const percentage = (audio.currentTime / audio.duration) * 100;
        progressBar.style.width = `${percentage}%`;
    }, [audio, progressBar]);

    useEffect(() => {
        if (audio !== null) {
            audio.addEventListener('timeupdate', updateTimeAndProgressBar);
            audio.addEventListener('ended', updateTimeAndProgressBar);
        }
    }, [audio, updateTimeAndProgressBar]);

    const seek = (event) => {
        const progressBarRect = progressBarContainer.getBoundingClientRect();
        const clickPosition = event.clientX - progressBarRect.left;
        const percentage = (clickPosition / progressBarRect.width) * 100;
        const newPosition = (percentage / 100) * audio.duration;
        audio.currentTime = newPosition;
        updateTimeAndProgressBar();
    }

    return (
        <div style={progressContainerStyle}>
            <div id="progressBarContainer" style={progressBarContainerStyle} onClick={seek}>
                <div id="progressBar" style={progressBarStyle} />
            </div>
            <div>{timestamp}</div>
        </div>
    );
};

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
}

export default ProgressSection;