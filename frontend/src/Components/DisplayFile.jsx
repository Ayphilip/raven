import React, { useEffect, useState } from "react";
import axios from "axios";

const DisplayFile = ({ fileId }) => {
    const [imageSrc, setImageSrc] = useState("");

    useEffect(() => {
        const fetchImage = async () => {
            try {
                const response = await axios.get(`http://localhost:22045/api/fileUpload/download/${fileId}`, {
                    responseType: "json",
                });
        
                // console.log("Full API Response:", response.data);
        
                const { fileBase64, mimeType } = response.data;

                console.log(mimeType)
        
                if (!fileBase64) {
                    console.error("Base64 data is missing!");
                    return;
                }
        
                // Ensure no extra spaces or incorrect MIME type
                const base64Src = `data:${mimeType || "image/png"};base64,${fileBase64.trim()}`;
        
                setImageSrc(base64Src);
                // console.log("Image Source Set:", base64Src);
            } catch (error) {
                console.error("Error fetching image:", error);
                alert("Failed to load image.");
            }
        };
        

        fetchImage()
      
    
      return () => {
        
      }
    }, [])
    

    

    return (
        <div>
            {/* <button onClick={fetchImage}>Load Image</button> */}
            {imageSrc && <img src={imageSrc} alt="Uploaded file" style={{ maxWidth: 20+"%", borderRadius: 30 }} />}
        </div>
    );
};

export default DisplayFile;
