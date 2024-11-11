// Layout.tsx
import React, { useEffect, useState } from 'react';
import { Container, StylesProvider } from '@mui/material';
import HighLight from './sections/HighLight.tsx';
import ResourceOverview from './sections/ResourceOverview4.tsx';
import ResourceOverview2 from './sections/ResourceOverview2.tsx';
import AIQuery from './sections/AIQuery.tsx';
import SpApp from './SpApp.tsx';
import ErrorBoundary from './ErrorBoundary';
import { AppProvider } from '../AppProvider';

const Layout = () => {
    const hash = document.location.hash;

    if(sessionStorage.getItem('raSpa') === 'true'){
        return <SpApp />;
    }
    //return <ResourceOverview />;
    //return <ResourceOverview2 />;
    //return <HighLight />;
    
    if(hash.startsWith("#/dev")) {
        return (
            <AppProvider>

                    <Container id={"main"} 
                            sx={{ margin: '0px', width: "100%", verticalAlign : "top", 
                                    position: 'absolute', top: 0, left: 0, 
                                    border: "1px solid none"}} 
                            maxWidth={"xl"}>
                    
                        <AIQuery />
                        <ErrorBoundary><HighLight /></ErrorBoundary>
                    </Container>

            </AppProvider>
        );
    }
    return <SpApp/>
};

export default Layout;