import React from 'react';
import { Badge, IconButton, Menu, MenuItem, Typography, Box, Divider } from '@mui/material';
import { Notifications as NotificationsIcon } from '@mui/icons-material';
import useChatStore from '../../services/chatService';
import { useNavigate } from 'react-router-dom';

const ChatNotifications = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const navigate = useNavigate();
  const { chats, messages } = useChatStore();

  const unreadMessages = React.useMemo(() => {
    let count = 0;
    chats.forEach(chat => {
      const chatMessages = messages.get(chat.id) || [];
      const unread = chatMessages.filter(msg => 
        !msg.readBy?.includes(useChatStore.getState().currentUser?.id)
      ).length;
      count += unread;
    });
    return count;
  }, [chats, messages]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleChatClick = (chatId) => {
    navigate(`/chat/${chatId}`);
    handleClose();
  };

  return (
    <>
      <IconButton
        color="inherit"
        onClick={handleClick}
        sx={{ position: 'relative' }}
      >
        <Badge badgeContent={unreadMessages} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          sx: { width: 320, maxHeight: 400 }
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6">Notifications</Typography>
        </Box>
        <Divider />
        
        {chats.map(chat => {
          const chatMessages = messages.get(chat.id) || [];
          const unread = chatMessages.filter(msg => 
            !msg.readBy?.includes(useChatStore.getState().currentUser?.id)
          ).length;

          if (unread === 0) return null;

          return (
            <MenuItem
              key={chat.id}
              onClick={() => handleChatClick(chat.id)}
              sx={{ py: 1.5 }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <img
                  src={chat.avatar}
                  alt={chat.name}
                  style={{ width: 40, height: 40, borderRadius: '50%' }}
                />
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle2">{chat.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {unread} unread message{unread !== 1 ? 's' : ''}
                  </Typography>
                </Box>
                <Badge
                  badgeContent={unread}
                  color="error"
                  sx={{ ml: 1 }}
                />
              </Box>
            </MenuItem>
          );
        })}

        {unreadMessages === 0 && (
          <MenuItem disabled>
            <Typography variant="body2" color="text.secondary">
              No new messages
            </Typography>
          </MenuItem>
        )}
      </Menu>
    </>
  );
};

export default ChatNotifications; 