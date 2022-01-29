/* eslint-disable no-undef */
import { Theme } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { addClasses } from 'helpers/dom';
import React from 'react'
import { Helmet } from 'react-helmet'
import { useSelector } from 'react-redux';
import { RootState } from 'store/configureStore';

const useStyles = makeStyles((theme: Theme) => ({

    root: {
        maxWidth: '100%',
        margin: '0 auto',
        padding: theme.spacing(3),
    },
    rootCenter: {
        padding: theme.spacing(3),
        paddingTop: '10vh',
        display: 'flex',
        flexDirection: 'column',
        alignContent: 'center'
    },
    rootlg: {
        width: 1280,
    },
    rootXl: {
        width: '100%',
    },

}));

interface PageProps {
    [key: string]: any,
    title: string,
    children: React.ReactNode,
    isContentCenter?: boolean,
    width?: 'lg' | 'xl'
}

const Page = ({ title, children, width = 'lg', isContentCenter = false, className, ...rest }: PageProps) => {

    const setting = useSelector((state: RootState) => state.settings);

    const classes = useStyles();

    return (
        <div className={addClasses({
            [classes.root]: true,
            [classes.rootXl]: width === 'xl',
            [classes.rootlg]: width === 'lg',
        })}>
            <div
                className={addClasses({
                    [className]: true,
                    [classes.rootCenter]: isContentCenter
                })}
                {...rest}>
                <Helmet>
                    <title>{title} - {setting.general_site_title ?? ''}</title>
                </Helmet>
                {children}
            </div>
        </div>
    )
}

export default Page
