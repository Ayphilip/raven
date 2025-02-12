import React from 'react';
import { formatDistanceToNow } from "date-fns";



const formatTimestamp = (timestamp) => {
    if (!timestamp) return "Unknown time";
    return formatDistanceToNow(new Date(timestamp.toDate()), { addSuffix: true });

}

export default formatTimestamp