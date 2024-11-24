import React, { useState } from 'react';
import axios from 'axios';

const ImageBot = () => {
    const [imageData, setImageData] = useState(null);
    const [response, setResponse] = useState('');

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            setImageData(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = async () => {
        const res = await axios.post('http://localhost:5000/classify-image', {
            image_data: imageData
        });
        setResponse(res.data);
    };

    return (
        <div>
            <h2>Image Classification Chatbot</h2>
            <input type="file" onChange={handleImageUpload} />
            <button onClick={handleSubmit}>Classify Image</button>
            <div>
                <h3>Response:</h3>
                <p>{response}</p>
            </div>
        </div>
    );
};

export default ImageBot;
