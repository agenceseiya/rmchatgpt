// pages/index.js

import { useState } from 'react';

export default function Home() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: 'Vous', text: input };
    setMessages([...messages, userMessage]);

    // Envoyer la requête au backend
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: input }),
    });

    const data = await response.json();

    if (data.message) {
      const botMessage = { sender: 'rmchatgpt', text: data.message };
      setMessages([...messages, userMessage, botMessage]);
    } else {
      const errorMessage = { sender: 'rmchatgpt', text: 'Désolé, une erreur est survenue.' };
      setMessages([...messages, userMessage, errorMessage]);
    }

    setInput('');
  };

  return (
    <div style={styles.container}>
      <h1>rmchatgpt</h1>
      <div style={styles.chatBox}>
        {messages.map((msg, index) => (
          <div key={index} style={msg.sender === 'Vous' ? styles.userMessage : styles.botMessage}>
            <strong>{msg.sender} :</strong> {msg.text}
          </div>
        ))}
      </div>
      <div style={styles.inputContainer}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={styles.input}
          placeholder="Tapez votre message..."
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <button onClick={handleSend} style={styles.button}>Envoyer</button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '600px',
    margin: '50px auto',
    fontFamily: 'Arial, sans-serif',
    textAlign: 'center',
  },
  chatBox: {
    border: '1px solid #ccc',
    padding: '20px',
    height: '400px',
    overflowY: 'scroll',
    marginBottom: '20px',
    backgroundColor: '#f9f9f9',
  },
  userMessage: {
    textAlign: 'right',
    margin: '10px 0',
    color: '#0070f3',
  },
  botMessage: {
    textAlign: 'left',
    margin: '10px 0',
    color: '#333',
  },
  inputContainer: {
    display: 'flex',
    justifyContent: 'center',
  },
  input: {
    width: '80%',
    padding: '10px',
    fontSize: '16px',
    borderRadius: '4px 0 0 4px',
    border: '1px solid #ccc',
    outline: 'none',
  },
  button: {
    padding: '10px 20px',
    fontSize: '16px',
    borderRadius: '0 4px 4px 0',
    border: '1px solid #0070f3',
    backgroundColor: '#0070f3',
    color: '#fff',
    cursor: 'pointer',
  },
};
