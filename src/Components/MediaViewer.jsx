import React from 'react'


const MediaViewer = ({ fileUrl }) => {

    const isVideo = (url) => {
        const videoExtensions = [".mp4", ".webm", ".mov", ".avi", ".mkv"];
        return videoExtensions.some((ext) => url.includes(ext));
    };

    if (!fileUrl) return <p>No media available</p>;

    return isVideo(fileUrl) ? (
        <video controls={false}  className="w-full max-h-96 rounded-lg">
            <source src={fileUrl} />
            Your browser does not support the video tag.
        </video>
    ) : (
        <img src={fileUrl} alt="Uploaded" className="w-full max-h-96 rounded-lg object-cover" />
    );

}

export default MediaViewer