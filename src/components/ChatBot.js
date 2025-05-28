import React, { Component } from 'react';
import { FiSend, FiPaperclip, FiUser, FiMessageSquare } from 'react-icons/fi';
import './Chatbot.css';

class ChatBot extends Component {
    state = {
        prompt: '',
        chatHistory: [],
        error: null,
        file: null,
        fileName: ''
    };

    chatEndRef = React.createRef();

    componentDidMount() {
        this.scrollToBottom();
    }

    componentDidUpdate() {
        this.scrollToBottom();
    }


    scrollToBottom = () => {
        if (this.chatEndRef.current) {
            this.chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    handleChange = (event) => {
        this.setState({ prompt: event.target.value, error: null });
    };

    handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            this.setState({ 
                file,
                fileName: file.name 
            });
        }
    };

    handleSubmit = async (e) => {
        e.preventDefault();
        const { prompt, file, chatHistory } = this.state;
        
        if (!prompt.trim() && !file) return;

        // Add user message immediately for better UX
        const userMessage = { 
            sender: 'user', 
            text: prompt || `Uploaded file: ${file.name}`,
            timestamp: new Date().toISOString()
        };

        this.setState(prevState => ({
            chatHistory: [...prevState.chatHistory, userMessage],
            prompt: '',
            file: null,
            fileName: ''
        }));

        const formData = new FormData();
        if (prompt) formData.append('prompt', prompt);
        if (file) formData.append('file', file);

        try {
            const response = await fetch('http://localhost:8000/chat/', {
                method: 'POST',
                body: formData,
            });


            const data = await response.json();
            console.log("response is :-", data.response);

            this.setState(prevState => ({
                chatHistory: [
                    ...prevState.chatHistory,
                    { 
                        sender: 'bot', 
                        text: data.response || 'No response from bot',
                        timestamp: new Date().toISOString()
                    }
                ]
            }));
        } catch (error) {
            console.error('Error fetching chat response:', error);
            this.setState(prevState => ({
                chatHistory: [
                    ...prevState.chatHistory,
                    { 
                        sender: 'bot', 
                        text: 'Sorry, there was an error processing your request. Please try again.',
                        isError: true,
                        timestamp: new Date().toISOString()
                    }
                ]
            }));
        }
    };

    formatTime = (timestamp) => {
        if (!timestamp) return '';
        const date = new Date(timestamp);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    render() {
        const { prompt, chatHistory, error, fileName } = this.state;

        return (
            <div className="container">
                <div className="chatBox">
                    {chatHistory.length > 0 ? (
                        chatHistory.map((msg, index) => (
                            <div
                                key={index}
                                className={`message ${msg.sender === 'user' ? 'user-message' : 'bot-message'} ${msg.isError ? 'error' : ''}`}
                            >
                                <div className="message-header">
                                    <span className="sender-icon">
                                        {msg.sender === 'user' ? <FiUser /> : <FiMessageSquare />}
                                    </span>
                                    <strong>{msg.sender === 'user' ? 'You' : 'Assistant'}</strong>
                                    <span className="message-time">{this.formatTime(msg.timestamp)}</span>
                                </div>
                                <div className="message-content">{msg.text}</div>
                            </div>
                        ))
                    ) : (
                        <div className="welcome-message">
                            <h2>Welcome to the Chatbot</h2>
                            <p>Start a conversation or upload a file to get started!</p>
                        </div>
                    )}
                    <div ref={this.chatEndRef} />
                    {error && <div className="error-message">{error}</div>}
                </div>
                
                <form onSubmit={this.handleSubmit} className="input-form">
                    <div className="inputContainer">
                        <div className="input-group">
                            <input
                                type="text"
                                value={prompt}
                                onChange={this.handleChange}
                                placeholder="Type your message..."
                                className="input"
                                aria-label="Type your message"
                            />
                            <label className="file-label">
                                <FiPaperclip className="file-icon" />
                                <span>{fileName || 'Attach file'}</span>
                                <input
                                    type="file"
                                    className="file-input"
                                    accept=".pdf,.docx,.txt,.xlsx"
                                    onChange={this.handleFileChange}
                                    aria-label="Upload file"
                                />
                            </label>
                            <button 
                                type="submit" 
                                className="button"
                                disabled={!prompt.trim() && !this.state.file}
                                aria-label="Send message"
                            >
                                <FiSend className="button-icon" />
                                <span>Send</span>
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        );
    }
}

export default ChatBot;
