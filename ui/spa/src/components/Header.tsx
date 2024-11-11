import { AppBar, Toolbar, Typography, Box, Button, IconButton, Menu, MenuItem, Link } from '@mui/material';
import { styled } from '@mui/system';
import { ISection } from '../interfaces.tsx';
import SettingsIcon from '@mui/icons-material/Settings';
import React, { useState } from 'react';

const StyledAppBar = styled(AppBar)({
    position: 'fixed',
    backgroundColor: '#222',
    height: '4.5em',
});

const StyledToolbar = styled(Toolbar)({
    display: 'flex',
    justifyContent: 'space-between',
});

const Settings = () => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLinkClick = (link: string) => {
        console.log(`Navigating to ${link}`);
        handleClose(); // Close menu on link click
    };

    const pageRoot = document.location.href.split('#')[0];

    return (
        <div>
            <IconButton edge="end" color="inherit" onClick={handleClick}>
                <SettingsIcon sx={{ color: "#888" }} />
            </IconButton>
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                sx={{ '& .MuiPaper-root': { backgroundColor: '#222', color: '#fff' } }}
            >
                <MenuItem onClick={handleClose} sx={{ color: '#fff' }}>
                    <Link href={`${pageRoot}#/dev`} color="inherit" underline="none">AI Dev</Link>
                </MenuItem>
                <MenuItem onClick={handleClose} sx={{ color: '#fff' }}>
                    <Link href="#" color="inherit" underline="none">Backend Admin</Link>
                </MenuItem>
                <MenuItem onClick={handleClose} sx={{ color: '#fff' }}>
                    <Link href="#" color="inherit" underline="none">User Settings</Link>
                </MenuItem>
            </Menu>
        </div>
    );
};

const Header = ({ title, SectionList }: { title: string; SectionList: ISection[] | undefined }) => {
    const SRAappBarId = 'SRAheader';

    const scrollTo = (section: ISection) => {
        const element = document.getElementById(section.id);
        element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    if (!SectionList) return null;

    const sections = SectionList.sort((a: ISection, b: ISection) => a.order - b.order)
        .map((section: ISection) => (
            <Button key={section.id} color="inherit" onClick={() => scrollTo(section)}>
                {section.label || section.name}
            </Button>
        ));

    return (
        <StyledAppBar id={SRAappBarId}>
            <StyledToolbar>
                <Typography variant="h6">{title}</Typography>
                <Box sx={{ flexGrow: 1 }} />
                {sections}
                <Settings />
            </StyledToolbar>
        </StyledAppBar>
    );
};

export default Header;