import React from 'react'
import { Helmet } from 'react-helmet'
import Divider from 'components/atoms/Divider'
import { useSelector } from 'react-redux';
import { makeStyles } from '@mui/styles';
import { Theme } from '@mui/material';
import { RootState } from 'store/configureStore';
import { addClasses } from 'helpers/dom';

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
    headTop: {
        position: 'sticky',
        top: 0,
        background: theme.palette.body.background,
        boxShadow: '6px 0px 0 ' + theme.palette.body.background + ', -6px 0px 0 ' + theme.palette.body.background,
        zIndex: 1000,
        paddingTop: 8,
    },
    divider: {
        margin: '16px 0 16px 0',
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
    width?: 'lg' | 'xl',
    header: React.ReactNode,
}

const PageHeaderSticky = ({ title, children, header, width = 'lg', isContentCenter = false, className, ...rest }: PageProps) => {

    const setting = useSelector((state: RootState) => state.settings);

    const classes = useStyles();
    return (
        <div className={addClasses({
            [classes.root]: true,
            [classes.rootXl]: width === 'xl',
            [classes.rootlg]: width === 'lg',
        })}>
            <div
                {...rest}
                className={addClasses({
                    [className]: true,
                    [classes.rootCenter]: isContentCenter
                })}
            >
                <Helmet>
                    <title>{title} - {setting.general_site_title ?? ''}</title>
                </Helmet>
                <div className={classes.headTop}>
                    {header}
                    <Divider className={classes.divider} color="dark" />
                </div>
                {children}
            </div>
        </div >
    )
}

export default PageHeaderSticky
