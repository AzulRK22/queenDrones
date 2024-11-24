import React, { useState } from 'react';
import axios from 'axios';
import styles from './chatgpt.module.css'; // Ensure this file exists and has the correct styles

const ChatGPT = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showEmergencyForm, setShowEmergencyForm] = useState(false);

    // Use a variable for the API key
    const apiKey = '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'; // Replace this with your actual API key
    const handleSend = async () => {
        if (input.trim()) {
            const userMessage = { text: input, sender: 'user' };
            setMessages([...messages, userMessage]);
            setInput('');
            setIsLoading(true);

            try {
                const response = await axios.post('https://api.openai.com/v1/chat/completions', {
                    model: "gpt-4-turbo", // Use gpt-4-turbo model
                    messages: [
                        {
                            role: "system",
                            content: "You are a specialized assistant trained to handle and report wildfire emergencies. When a user reports a wildfire, gather critical information such as location, size of the fire, nearby structures, and any injuries. Be clear, concise, and supportive."
                        },
                        { role: "user", content: input },
                    ],
                }, {
                    headers: {
                        'Authorization': `Bearer ${apiKey}`, // Use the apiKey variable here
                        'Content-Type': 'application/json',
                    },
                });

                const botMessage = {
                    text: response.data.choices[0].message.content,
                    sender: 'bot',
                };
                setMessages([...messages, userMessage, botMessage]);
            } catch (error) {
                console.error("Error:", error);
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleInputChange = (e) => {
        setInput(e.target.value);
    };

    const handleEmergencyReport = () => {
        setShowEmergencyForm(true);
        const emergencyQuestions = [
            "Please describe the wildfire. What is its size and intensity?",
            "Where exactly is the wildfire located?",
            "Are there any structures or people in immediate danger?",
            "Is anyone injured or in need of assistance?",
        ];
        setMessages([...messages, { text: "Please answer the following questions to report the wildfire:", sender: 'bot' }]);
        emergencyQuestions.forEach(question => {
            setMessages(prevMessages => [...prevMessages, { text: question, sender: 'bot' }]);
        });
    };

    return (
        <div className={styles.chatbotContainer}>
            <div className={styles.chatbotHeader}>
                <h2>Wildfire Reporting Agent</h2>
            </div>
            <div className={styles.chatbotMessages}>
                {messages.map((message, index) => (
                    <div key={index} className={`${styles.chatbotMessage} ${styles[message.sender]}`}>
                        {message.text}
                    </div>
                ))}
                {isLoading && <div className={`${styles.chatbotMessage} ${styles.bot} ${styles.loading}`}>...</div>}
            </div>
            {showEmergencyForm && (
                <div className={styles.emergencyForm}>
                    <p>Please answer the following questions to report the wildfire:</p>
                    <input
                        type="text"
                        placeholder="Describe the wildfire (size, intensity, etc.)"
                        className={styles.emergencyInput}
                    />
                    <input
                        type="text"
                        placeholder="Location of the wildfire"
                        className={styles.emergencyInput}
                    />
                    <input
                        type="text"
                        placeholder="Are there structures or people in danger?"
                        className={styles.emergencyInput}
                    />
                    <input
                        type="text"
                        placeholder="Is anyone injured?"
                        className={styles.emergencyInput}
                    />
                    <button className={styles.submitButton}>Submit Report</button>
                </div>
            )}
            <div className={styles.chatbotInput}>
                <input
                    type="text"
                    value={input}
                    onChange={handleInputChange}
                    placeholder="Type your message..."
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                />
                <button onClick={handleSend}>Send</button>
                <button onClick={handleEmergencyReport} className={styles.emergencyButton}>Report a Wildfire</button>
            </div>
        </div>
    );
};

export default ChatGPT;
