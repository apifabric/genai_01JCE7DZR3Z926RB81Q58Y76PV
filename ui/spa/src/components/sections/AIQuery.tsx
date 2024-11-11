import React, { useState } from 'react';
import { IconButton, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, Paper, Typography, Tabs, Tab, Box, List, ListItem, Backdrop, CircularProgress, Radio, RadioGroup, FormControlLabel, Grid, Link } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import SettingsIcon from '@mui/icons-material/Settings';
import Draggable from 'react-draggable';
import { useDataProvider } from 'react-admin';
import handleAIQuery from './AIQueryHandler';
import PromptList from './PromptList';
import { getAppId } from '../../util/util.tsx';
import './style/AIQuery.css'; // Import the CSS file

// Custom PaperComponent for draggable dialog functionality
const PaperComponent = (props) => {
  return (
    <Draggable handle="#draggable-dialog-title" cancel={'[class*="MuiDialogContent-root"]'}>
      <Paper {...props} />
    </Draggable>
  );
};

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

const AIQuery = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [textValue, setTextValue] = useState('');
  const [imagePrompt, setImagePrompt] = useState('');
  const [selectedTab, setSelectedTab] = useState(0);
  const [imageNames, setImageNames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState('generate');
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
  const dataProvider = useDataProvider();
  const appName = sessionStorage.getItem('appName') || getAppId();

  const toggleDialog = () => {
    setIsDialogOpen(!isDialogOpen);
  };

  const toggleImageDialog = () => {
    setIsImageDialogOpen(!isImageDialogOpen);
  };

  const handleChange = (event) => {
    setTextValue(event.target.value);
  };

  const handleImagePromptChange = (event) => {
    setImagePrompt(event.target.value);
  };

  const handleSubmit = async () => {
    setLoading(true);
    await handleAIQuery(dataProvider, `${textValue}`);
    setLoading(false);
  };

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImageNames([...imageNames, file.name]);
      alert(`Uploaded Image: ${file.name}`);
    }
  };

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleSettingsClick = () => {
    localStorage.removeItem('appId');
    document.location.reload();
  };

  const appId = (
    <Typography variant='caption' sx={{ color: "#ccc", verticalAlign: "left", width: "90%" }}>
      <IconButton onClick={handleSettingsClick} sx={{ color: "#ccc", padding: 0, marginRight: '8px' }}>
        <SettingsIcon />
      </IconButton>
    </Typography>
  );

  return (
    <div>
      {/* Draggable wrapper for the button */}
      <Draggable>
        <div
          style={{
            display: 'inline-block',
            position: 'fixed', // Keeps the button in a fixed position
            bottom: '20px', // Positions the button at the bottom
            right: '20px', // Positions the button at the right
            zIndex: 9999, // Ensures it stays on top of other elements
            background: 'transparent',
          }}
        >
          <IconButton
            onClick={toggleDialog}
            color="primary"
            style={{
              width: '70px', // Larger size for the button
              height: '70px',
              backgroundColor: 'transparent',
              borderRadius: '50%',
              padding: 0,
              border: '2px solid white', // Circular border with white color
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            sx={{
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)', // Slight hover effect
              },
              '&:focus, &:active': {
                borderColor: 'white', // Ensure border stays white when focused or active
                outline: 'none',
              },
            }}
          >
            <ChatIcon style={{ fontSize: '36px' }} /> {/* Larger icon */}
          </IconButton>
        </div>
      </Draggable>

      {/* MUI Dialog with Draggable Functionality */}
      <Dialog
        open={isDialogOpen}
        onClose={toggleDialog}
        PaperComponent={PaperComponent}
        aria-labelledby="draggable-dialog-title"
        maxWidth="md" // Sets the maximum width to medium size
        fullWidth // Ensures the dialog takes the full width allowed
      >
         <DialogTitle style={{ cursor: 'move', display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }} id="draggable-dialog-title">
            <span style={{ flexGrow: 1, textAlign: 'left' }}>AI WebDev</span>
            <Link href="/spa-dev/#/" sx={{ color: "#ccc", textDecoration: 'none', fontSize: '0.6em' }}>
                {appName || appId}
            </Link>
        </DialogTitle>
        <DialogContent className="custom-scrollbar" sx={{ height: '380px', overflowY: 'auto' }}> {/* Adjusted height for the DialogContent */}
          <Tabs value={selectedTab} onChange={handleTabChange} aria-label="basic tabs example">
            <Tab
              label="AI Prompt"
              sx={{
                '&:focus, &:active': {
                  borderColor: 'white', // Ensure border stays white when focused or active
                  outline: 'none',
                },
              }}
            />
            <Tab
              label="Images"
              sx={{
                '&:focus, &:active': {
                  borderColor: 'white', // Ensure border stays white when focused or active
                  outline: 'none',
                },
              }}
            />
            <Tab
              label="Prompts"
              sx={{
                '&:focus, &:active': {
                  borderColor: 'white', // Ensure border stays white when focused or active
                  outline: 'none',
                },
              }}
            />
          </Tabs>
          <TabPanel value={selectedTab} index={0}>
            <Box position="relative">
              <TextField
                value={textValue}
                onChange={handleChange}
                label="Prompt"
                multiline
                rows={5}
                variant="outlined"
                fullWidth
                InputProps={{
                  style: { minHeight: '100px' }, // Ensure the TextField expands instead of scrolls
                }}
              />
              {loading && (
                <Backdrop
                  sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: (theme) => theme.zIndex.drawer + 1, color: '#fff' }}
                  open={loading}
                >
                  <CircularProgress color="inherit" />
                </Backdrop>
              )}
            </Box>
            {/* Informational paragraph below the TextField */}
            <Typography variant="body2" color="textSecondary" style={{ marginTop: '8px' }}>
              {selectedOption === 'generate' ? 'Specify how you want to modify the page' : 'Ask information about this page design and backend resources'}
            </Typography>
            <RadioGroup
              aria-label="options"
              name="options"
              value={selectedOption}
              onChange={handleOptionChange}
              row
              sx={{ marginTop: '8px' }}
            >
              <FormControlLabel value="generate" control={<Radio />} label="Generate" />
              <FormControlLabel value="question" control={<Radio />} label="Question" />
            </RadioGroup>
          </TabPanel>
          <TabPanel value={selectedTab} index={1}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  value={imagePrompt}
                  onChange={handleImagePromptChange}
                  label="Image Prompt"
                  multiline
                  rows={2}
                  variant="outlined"
                  fullWidth
                  InputProps={{
                    style: { minHeight: '50px' }, // Ensure the TextField expands instead of scrolls
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="outlined"
                  color="primary"
                  sx={{
                    width: '12em',
                    '&:focus, &:active': {
                      borderColor: 'white', // Ensure border stays white when focused or active
                      outline: 'none',
                    },
                  }}
                >
                  Generate Image
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="outlined"
                  component="label"
                  sx={{
                    width: '12em',
                    '&:focus, &:active': {
                      borderColor: 'white', // Ensure border stays white when focused or active
                      outline: 'none',
                    },
                  }}
                >
                  Upload File
                  <input
                    type="file"
                    hidden
                    onChange={handleImageUpload}
                  />
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Link
                  component="button"
                  color="textSecondary"
                  onClick={toggleImageDialog}
                  style={{ marginBottom: '8px', textDecoration: 'none' }}
                  sx={{
                    '&:focus, &:active': {
                      borderColor: 'white', // Ensure border stays white when focused or active
                      outline: 'none',
                    },
                  }}
                >
                  Uploaded Images
                </Link>
                <List>
                  {imageNames.map((name, index) => (
                    <ListItem key={index}>
                      {name}
                    </ListItem>
                  ))}
                </List>
              </Grid>
            </Grid>
          </TabPanel>
          <TabPanel value={selectedTab} index={2}>
            <PromptList />
          </TabPanel>
        </DialogContent>
        <DialogActions>
          {appId}
          <Button
            onClick={handleSubmit}
            color="primary"
            variant="outlined"
            sx={{
              '&:focus, &:active': {
                borderColor: 'white', // Ensure border stays white when focused or active
                outline: 'none',
              },
            }}
          >
            Submit
          </Button>
          <Button
            onClick={toggleDialog}
            color="secondary"
            variant="outlined"
            sx={{
              '&:focus, &:active': {
                borderColor: 'white', // Ensure border stays white when focused or active
                outline: 'none',
              },
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* New Dialog for Uploaded Images */}
      <Dialog
        open={isImageDialogOpen}
        onClose={toggleImageDialog}
        PaperComponent={PaperComponent}
        aria-labelledby="uploaded-images-dialog-title"
        maxWidth="md" // Sets the maximum width to medium size
        fullWidth // Ensures the dialog takes the full width allowed
      >
        <DialogTitle style={{ cursor: 'move' }} id="uploaded-images-dialog-title">
          Uploaded Images
        </DialogTitle>
        <DialogContent className="custom-scrollbar" sx={{ height: '350px', overflowY: 'auto' }}>
          <List>
            {imageNames.map((name, index) => (
              <ListItem key={index}>
                {name}
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={toggleImageDialog}
            color="secondary"
            variant="outlined"
            sx={{
              '&:focus, &:active': {
                borderColor: 'white', // Ensure border stays white when focused or active
                outline: 'none',
              },
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AIQuery;