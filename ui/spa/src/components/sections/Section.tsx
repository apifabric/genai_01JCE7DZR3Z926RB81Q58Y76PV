import React, { useEffect } from 'react'
import { Box, Typography, Button } from '@mui/material';
import { styled } from '@mui/system';
import {ISection} from './interfaces.tsx';
import ReactMarkdown from 'react-markdown'
import HeroSection from './HeroSection.tsx';

interface SectionBoxProps {
    theme?: any;
    section?: ISection;
}

const StyledBox = styled(Box)<SectionBoxProps>(({ theme, section }) => ({
    minHeight: '80vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    color: 'black',
    textAlign: 'left',
    backgroundImage: `linear-gradient(to right, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.1)), url(${section.background})`,
    border: '0px solid blue',
    ...section.style || {},
}));


const SectionBox = styled(Box)<SectionBoxProps>(({ theme, section }) => {
    useEffect(() => {
        console.log(section.style);  // Log the section style to see its properties
    }, [section]);

    return {
        my: theme.spacing(4),
        minHeight: '80vh',
        backgroundColor: section.style?.backgroundColor || section.index % 2 ? (theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[900]) : 'transparent',
        ...section.style || {},
    };
});

const SimpleSection = ({section}: {section: ISection}) => {
    return <SectionBox section={section}>
                <Typography variant="h4">{section.title}</Typography>
                <Typography paragraph>{section.paragraph}</Typography>
                <Typography component="div">
                    <ReactMarkdown>{section.content}</ReactMarkdown>
                </Typography>
            </SectionBox>
}

const FullSection = ({section}: {section: ISection}) => {
    return <StyledBox section={section}>
                <Typography variant="h1">{section.title}</Typography>
                <Typography paragraph>{section.paragraph}</Typography>
                <Typography component="div">
                    <ReactMarkdown>{section.content}</ReactMarkdown>
                </Typography>
            </StyledBox>
}

const MarkDownSection = ({section}: {section: ISection}) => {
    return <StyledBox section={section}>
                <Typography variant="h1">{section.title}</Typography>
                <Typography component="div">
                    <ReactMarkdown>{section.paragraph}</ReactMarkdown>
                </Typography>
            </StyledBox>
}


const Image = styled('img')(({ theme }) => ({
    width: '100%',
    height: 'auto',
    borderRadius: theme.shape.borderRadius,
    marginBottom: theme.spacing(2),
}));

const ImageSection = ({ section }: { section: ISection }) => {
    return (
      <SectionBox section={section}>
        <Image src={section.image} alt={section.title} />
        <Typography variant="h4" gutterBottom>
          {section.title}
        </Typography>
        <Typography variant="body1">{section.paragraph}</Typography>
      </SectionBox>
    );
  };

const sectionTemplates: { [key: string]: ({ section }: { section: ISection }) => JSX.Element } = {
    'simple': SimpleSection,
    'full': FullSection,
    'hero': HeroSection,
    'markdown': MarkDownSection,
    'image': ImageSection,
    // Add more section templates here
}

export const Section = ({section}: {section: ISection}) => {

    const SectionComponent = sectionTemplates[section.Type?.toLowerCase()] || SimpleSection;
    
    return <>
        <div id={section.id} style={{position: "relative", top: "-4.1em", border: "none", display:"block"}} > </div>
        <SectionComponent section={section}/>
        </>
}
