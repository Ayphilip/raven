import React from 'react';
import { formatDistanceToNow } from "date-fns";
import { Timestamp } from "firebase/firestore";

const formatTimestamp = (timestamp) => {
    if (!timestamp) return "Unknown time";
    // console.log(timestamp);

    if (timestamp instanceof Timestamp) {
        return formatDistanceToNow(timestamp.toDate(), { addSuffix: true }); // Convert Firestore Timestamp
    } else if (timestamp.seconds) {
        return formatDistanceToNow(new Date(timestamp.seconds * 1000), { addSuffix: true }); // Handle raw object
    }

    return "Invalid time";
}

export default formatTimestamp;
