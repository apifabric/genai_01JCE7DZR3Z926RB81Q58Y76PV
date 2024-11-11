import React, { useState, useEffect } from 'react';
import { Button, List, ListItem, ListItemText, Typography, Box, Grid } from '@mui/material';
import { useDataProvider } from 'react-admin';

const PromptList = () => {
    const dataProvider = useDataProvider();
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchData = () => {
        setLoading(true);
        dataProvider.getList("SPAComponent", {
            pagination: { page: 1, perPage: 100 }
        })
        .then(response => {
            setItems(response?.data || []);
            setLoading(false);
        })
        .catch(error => {
            console.error("Error fetching page:", error);
            setLoading(false);
        });
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleApplyClick = (item) => {
        alert(`Apply clicked for: ${item.prompt}`);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${date.getMonth() + 1}/${date.getDate()} ${hours}:${minutes}`;
    };

    return (
        <div>
            <List>
                {items.map(item => (
                    <ListItem key={item.id} sx={{ borderBottom: '1px solid #ddd' }}>
                        <Grid container spacing={2} alignItems="center">
                            <Grid item xs>
                                <ListItemText
                                    secondary={
                                        <>
                                            <Typography variant="body2">
                                                {item.prompt}
                                            </Typography>
                                            <Typography variant="caption" color="textSecondary" sx={{ color: "#ccc" }}>
                                                {formatDate(item.created_at)}
                                            </Typography>
                                        </>
                                    }
                                />
                            </Grid>
                            <Grid item>
                                <Button
                                    variant="outlined"
                                    onClick={() => handleApplyClick(item)}
                                    sx={{ width: '6em' }} // Set a fixed width for the button
                                >
                                    Apply
                                </Button>
                            </Grid>
                        </Grid>
                    </ListItem>
                ))}
            </List>
            <Button variant="outlined" onClick={fetchData} disabled={loading}>
                {loading ? 'Refreshing...' : 'Refresh'}
            </Button>
        </div>
    );
}

export default PromptList;