import React, { useEffect, useRef, useState } from 'react';
import useChatStore from '../../services/chatService';
import { Box, Paper, Typography, TextField, IconButton, List, ListItem, ListItemText, ListItemAvatar, Avatar, Divider } from '@mui/material';
import { Send as SendIcon, AttachFile as AttachFileIcon } from '@mui/icons-material';

const ChatInterface = () => {
  const {
    activeChat,
    chats,
    messages,
    onlineUsers,
    typingUsers,
    setActiveChat,
    sendMessage,
    sendFile,
    sendTyping,
    sendReadReceipt
  } = useChatStore();

  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChat) return;

    await sendMessage(activeChat, newMessage.trim());
    setNewMessage('');
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !activeChat) return;

    try {
      await sendFile(activeChat, file);
    } catch (error) {
      console.error('Error uploading file:', error);
      // TODO: Show error notification
    }
  };

  const handleTyping = () => {
    if (!isTyping) {
      setIsTyping(true);
      sendTyping(activeChat);
    }
  };

  const renderMessage = (message) => {
    const isFile = message.type === 'file';
    const isCurrentUser = message.sender === useChatStore.getState().currentUser?.id;

    return (
      <ListItem
        key={message.id}
        sx={{
          flexDirection: isCurrentUser ? 'row-reverse' : 'row',
          alignItems: 'flex-start',
          mb: 1
        }}
      >
        <ListItemAvatar>
          <Avatar src={message.senderAvatar} />
        </ListItemAvatar>
        <Box
          sx={{
            maxWidth: '70%',
            bgcolor: isCurrentUser ? 'primary.light' : 'grey.100',
            borderRadius: 2,
            p: 1,
            ml: isCurrentUser ? 0 : 1,
            mr: isCurrentUser ? 1 : 0
          }}
        >
          {isFile ? (
            <Box>
              <Typography variant="body2" color="text.secondary">
                {message.fileName}
              </Typography>
              <a href={message.content} target="_blank" rel="noopener noreferrer">
                Download File
              </a>
            </Box>
          ) : (
            <Typography variant="body1">{message.content}</Typography>
          )}
          <Typography variant="caption" color="text.secondary">
            {new Date(message.timestamp).toLocaleTimeString()}
          </Typography>
        </Box>
      </ListItem>
    );
  };

  return (
    <Box sx={{ height: '100%', display: 'flex' }}>
      {/* Chat List */}
      <Paper sx={{ width: 300, p: 2, borderRight: 1, borderColor: 'divider' }}>
        <Typography variant="h6" gutterBottom>
          Conversations
        </Typography>
        <List>
          {chats.map((chat) => (
            <ListItem
              key={chat.id}
              button
              selected={activeChat === chat.id}
              onClick={() => setActiveChat(chat.id)}
            >
              <ListItemAvatar>
                <Avatar src={chat.avatar} />
              </ListItemAvatar>
              <ListItemText
                primary={chat.name}
                secondary={
                  <Box component="span" sx={{ display: 'flex', alignItems: 'center' }}>
                    {onlineUsers.has(chat.id) && (
                      <Box
                        component="span"
                        sx={{
                          width: 8,
                          height: 8,
                          bgcolor: 'success.main',
                          borderRadius: '50%',
                          mr: 1
                        }}
                      />
                    )}
                    {chat.lastMessage}
                  </Box>
                }
              />
            </ListItem>
          ))}
        </List>
      </Paper>

      {/* Chat Area */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {activeChat ? (
          <>
            {/* Messages */}
            <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
              {messages.get(activeChat)?.map(renderMessage)}
              {typingUsers.get(activeChat)?.size > 0 && (
                <Typography variant="caption" color="text.secondary">
                  Someone is typing...
                </Typography>
              )}
              <div ref={messagesEndRef} />
            </Box>

            {/* Message Input */}
            <Box
              component="form"
              onSubmit={handleSendMessage}
              sx={{
                p: 2,
                borderTop: 1,
                borderColor: 'divider',
                display: 'flex',
                gap: 1
              }}
            >
              <IconButton
                onClick={() => fileInputRef.current?.click()}
                color="primary"
              >
                <AttachFileIcon />
              </IconButton>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                style={{ display: 'none' }}
              />
              <TextField
                fullWidth
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleTyping}
                placeholder="Type a message..."
                variant="outlined"
                size="small"
              />
              <IconButton type="submit" color="primary">
                <SendIcon />
              </IconButton>
            </Box>
          </>
        ) : (
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Typography variant="h6" color="text.secondary">
              Select a conversation to start chatting
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ChatInterface; 