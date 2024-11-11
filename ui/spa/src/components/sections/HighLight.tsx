import React, { useState, useEffect } from 'react';
import {
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  Paper,
  List,
  ListItem,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useDataProvider } from 'react-admin';
import { getConf } from '../../Config';

const DogResourceList = () => {
  const dataProvider = useDataProvider();
  const [dogData, setDogData] = useState([]);
  const [dialogData, setDialogData] = useState(null);
  const conf = getConf();

  const fetchDogs = async () => {
    const response = await dataProvider.getList('Dog', {
      pagination: { page: 1, perPage: 10 },
      meta: { include: ['+all'] },
    });
    setDogData(response.data);
  };

  useEffect(() => {
    fetchDogs();
  }, []);

  const handlePaperClick = (item) => {
    setDialogData(item);
  };

  const handleCloseDialog = () => {
    setDialogData(null);
  };

  const renderRelatedData = (relations) => {
    return Object.keys(relations).map((key) => (
      <Accordion key={key} style={{ marginTop: '8px' }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1" color="primary">{key}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            {relations[key].data && JSON.stringify(relations[key].data, null, 2)}
          </Typography>
        </AccordionDetails>
      </Accordion>
    ));
  };

  return (
    <div style={{ padding: '16px' }}>
      <Typography variant="h4" gutterBottom style={{ borderBottom: '3px solid green', paddingBottom: '8px', color: 'green' }}>
        Dog Resource Overview
      </Typography>
      {dogData.map((dog) => (
        <Paper
          key={dog.id}
          style={{ margin: '16px 0', padding: '16px', cursor: 'pointer', border: '1px solid green' }}
          onClick={() => handlePaperClick(dog)}
        >
          <Typography variant="h6">
            {dog.name}
          </Typography>
          <Typography color="textSecondary">
            Breed: {dog.breed}
          </Typography>
        </Paper>
      ))}
      <Dialog open={!!dialogData} onClose={handleCloseDialog} fullWidth maxWidth="md">
        <DialogTitle>Dog Details</DialogTitle>
        <DialogContent>
          {dialogData && (
            <div>
              <Typography variant="h5" gutterBottom>
                {`Details for ${dialogData.name}`}
              </Typography>
              <List>
                {Object.entries(dialogData)
                  .filter(([key]) => !['id', 'ja_type', 'relationships', 'attributes', 'meta', 'type'].includes(key))
                  .map(([key, value]) => (
                    <ListItem key={key}>
                      <ListItemText primary={`${key}: ${value || 'N/A'}`} />
                    </ListItem>
                  ))}
              </List>
              {dialogData.relationships && renderRelatedData(dialogData.relationships)}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DogResourceList;