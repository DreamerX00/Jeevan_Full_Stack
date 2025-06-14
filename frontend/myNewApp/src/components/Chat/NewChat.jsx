import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Autocomplete,
  Box,
  Typography
} from '@mui/material';
import useChatStore from '../../services/chatService';

const NewChat = ({ open, onClose }) => {
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const { createChat } = useChatStore();

  const handleSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/users/search?q=${encodeURIComponent(query)}`);
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error('Error searching users:', error);
      // TODO: Show error notification
    } finally {
      setLoading(false);
    }
  };

  const handleCreateChat = async () => {
    if (selectedUsers.length === 0) return;

    try {
      await createChat(selectedUsers.map(user => user.id));
      onClose();
    } catch (error) {
      console.error('Error creating chat:', error);
      // TODO: Show error notification
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>New Conversation</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <Autocomplete
            multiple
            options={searchResults}
            value={selectedUsers}
            onChange={(_, newValue) => setSelectedUsers(newValue)}
            onInputChange={(_, newInputValue) => {
              setSearchQuery(newInputValue);
              handleSearch(newInputValue);
            }}
            getOptionLabel={(option) => `${option.name} (${option.email})`}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Search users"
                placeholder="Type to search..."
                fullWidth
              />
            )}
            renderOption={(props, option) => (
              <Box component="li" {...props}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <img
                    src={option.avatar}
                    alt={option.name}
                    style={{ width: 24, height: 24, borderRadius: '50%' }}
                  />
                  <Box>
                    <Typography variant="body1">{option.name}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {option.email}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            )}
            loading={loading}
            noOptionsText="No users found"
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleCreateChat}
          variant="contained"
          disabled={selectedUsers.length === 0}
        >
          Create Chat
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NewChat; 