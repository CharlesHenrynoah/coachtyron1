'use client'

import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom';
import NavigationBar from './Navigation/NavigationBar';
import './Chat.css'

function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [file, setFile] = useState(null);
  const [isConversationsOpen, setIsConversationsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [conversations, setConversations] = useState([
    { id: 1, title: 'Conversation 1', date: '2024-01-13' },
    { id: 2, title: 'Conversation 2', date: '2024-01-12' },
  ]);
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);
  const navigate = useNavigate();

  const filteredConversations = conversations.filter(conv =>
    conv.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleNewConversation = () => {
    // Logique pour créer une nouvelle conversation
    const newConv = {
      id: conversations.length + 1,
      title: `Nouvelle conversation ${conversations.length + 1}`,
      date: new Date().toISOString().split('T')[0]
    };
    setConversations([...conversations, newConv]);
    setIsConversationsOpen(false);
  };

  const handleDeleteConversation = (id) => {
    setConversations(conversations.filter(conv => conv.id !== id));
  };

  const handleEditStart = (conv) => {
    setEditingId(conv.id);
    setEditingTitle(conv.title);
  };

  const handleEditSave = () => {
    if (editingTitle.trim()) {
      setConversations(conversations.map(conv =>
        conv.id === editingId
          ? { ...conv, title: editingTitle.trim() }
          : conv
      ));
    }
    setEditingId(null);
    setEditingTitle('');
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditingTitle('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleEditSave();
    } else if (e.key === 'Escape') {
      handleEditCancel();
    }
  };

  const handleSend = () => {
    if (input.trim() || file) {
      const newMessage = {
        id: Date.now(),
        content: file ? `Document importé : ${file.name}` : input.trim(),
        isUser: true,
      };
      setMessages([...messages, newMessage]);
      setInput('');
      setFile(null);
      
      setTimeout(() => {
        const aiResponse = {
          id: Date.now() + 1,
          content: file ? "J'ai bien reçu votre document. Comment puis-je vous aider avec ce fichier ?" : "Voici une réponse simulée de Coach Tyron.",
          isUser: false,
        };
        setMessages(prevMessages => [...prevMessages, aiResponse]);
      }, 1000);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleInputChange = (e) => {
    const input = e.target.value;
    setInput(input);

    // Calculer le nombre de lignes en fonction des retours à la ligne
    const lines = (input.match(/\n/g) || []).length + 1;

    // Activer le défilement à partir de la 4ème ligne
    if (lines > 4) {
      e.target.style.overflowY = 'scroll';
      e.target.style.height = '120px';
    } else {
      e.target.style.overflowY = 'hidden';
      e.target.style.height = 'auto';
    }

    // Ajuster la hauteur du textarea
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
  };

  const Message = ({ text, isUser }) => (
    <div className={`message ${isUser ? 'user' : 'assistant'}`}>
      <div className="message-content">
        {!isUser && <p className="message-sender">Coach Tyron</p>}
        {text}
      </div>
    </div>
  );

  return (
    <div className="chat-container">
      <header className="chat-header">
        <button className="conversations-button" onClick={() => setIsConversationsOpen(true)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 12H8.01M12 12H12.01M16 12H16.01M21 12C21 16.4183 16.9706 20 12 20C10.4607 20 9.01172 19.6565 7.74467 19.0511L3 20L4.39499 16.28C3.51156 15.0423 3 13.5743 3 12C3 7.58172 7.02944 4 12 4C16.9706 4 21 7.58172 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <h1>Coach Tyron</h1>
      </header>

      {isConversationsOpen && (
        <>
          <div className="conversations-overlay" onClick={() => setIsConversationsOpen(false)} />
          <div className="conversations-popup">
            <div className="conversations-header">
              <h2>Mes conversations</h2>
              <button className="close-popup" onClick={() => setIsConversationsOpen(false)}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 18L18 6M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
            
            <div className="conversations-search">
              <input
                type="text"
                placeholder="Rechercher une conversation..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <button className="new-conversation-button" onClick={handleNewConversation}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              Nouvelle conversation
            </button>

            <div className="conversations-list">
              {filteredConversations.map(conv => (
                <div key={conv.id} className="conversation-item">
                  <div className="conversation-info">
                    {editingId === conv.id ? (
                      <input
                        type="text"
                        className="edit-title-input"
                        value={editingTitle}
                        onChange={(e) => setEditingTitle(e.target.value)}
                        onBlur={handleEditSave}
                        onKeyDown={handleKeyPress}
                        autoFocus
                      />
                    ) : (
                      <>
                        <span className="conversation-title">{conv.title}</span>
                        <span className="conversation-date">{conv.date}</span>
                      </>
                    )}
                  </div>
                  <div className="conversation-actions">
                    <button 
                      className="edit-title-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditStart(conv);
                      }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13M18.5 2.5C18.8978 2.10217 19.4374 1.87868 20 1.87868C20.5626 1.87868 21.1022 2.10217 21.5 2.5C21.8978 2.89782 22.1213 3.43739 22.1213 4C22.1213 4.56261 21.8978 5.10217 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                    <button 
                      className="delete-conversation" 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteConversation(conv.id);
                      }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19 7L18.1327 19.1425C18.0579 20.1891 17.187 21 16.1378 21H7.86224C6.81296 21 5.94208 20.1891 5.86732 19.1425L5 7M10 11V17M14 11V17M3 7H21M16 7L15.2797 4.83964C15.107 4.32797 14.6136 4 14.0622 4H9.93782C9.38644 4 8.89298 4.32797 8.72027 4.83964L8 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      <div className="messages-container">
        {messages.map((message) => (
          <Message key={message.id} text={message.content} isUser={message.isUser} />
        ))}
      </div>

      <div className="input-container">
        <div className="input-wrapper">
          <div className="input-buttons-background"></div>
          <div className="input-buttons left">
            <button 
              className="input-button"
              onClick={() => fileInputRef.current?.click()}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon">
                <path d="M13.234 20.252 21 12.3"></path>
                <path d="m16 6-8.414 8.586a2 2 0 0 0 0 2.828 2 2 0 0 0 2.828 0l8.414-8.586a4 4 0 0 0 0-5.656 4 4 0 0 0-5.656 0l-8.415 8.585a6 6 0 1 0 8.486 8.486"></path>
              </svg>
            </button>
            <button className="input-button">
              <svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon">
                <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                <line x1="12" x2="12" y1="19" y2="22"></line>
              </svg>
            </button>
          </div>
          <textarea
            ref={textareaRef}
            className="chat-input"
            placeholder="Message Coach Tyron..."
            value={input}
            onChange={handleInputChange}
            onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
            rows={8}
          />
          <div className="input-buttons right">
            <button 
              className="input-button send"
              onClick={handleSend}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon">
                <path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"></path>
                <path d="m21.854 2.147-10.94 10.939"></path>
              </svg>
            </button>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
          {file && (
            <div className="file-preview">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon-small">
                <path d="M13.234 20.252 21 12.3"></path>
                <path d="m16 6-8.414 8.586a2 2 0 0 0 0 2.828 2 2 0 0 0 2.828 0l8.414-8.586a4 4 0 0 0 0-5.656 4 4 0 0 0-5.656 0l-8.415 8.585a6 6 0 1 0 8.486 8.486"></path>
              </svg>
              <span>{file.name}</span>
              <button 
                onClick={() => setFile(null)}
                className="close-button"
              >
                ×
              </button>
            </div>
          )}
        </div>
      </div>
      <NavigationBar />
    </div>
  );
}

export default Chat;
