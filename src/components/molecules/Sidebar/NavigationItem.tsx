import Button from 'components/atoms/Button';
import Collapse from 'components/atoms/Collapse';
import ListItem from 'components/atoms/ListItem';
import SvgIcon from 'components/atoms/SvgIcon';
import { matchPath } from 'react-router-dom';
import React, { useState } from 'react';
import {
    NavLink, useLocation
} from "react-router-dom";
import Label from 'components/atoms/Label';
import Icon, { IconFormat } from 'components/atoms/Icon';
import { addClasses } from 'helpers/dom';
import { makeStyles } from '@mui/styles';
import { Theme } from '@mui/material';
import { fade } from 'helpers/mui4/color';

interface NavigationItemProps {
    [key: string]: any,
    title: string,
    href?: string,
    depth?: number,
    children?: React.ReactNode,
    icon: IconFormat,
    className?: string,
    open?: boolean,
    label?: {
        [key: string]: any,
    },
    svgIcon?: string,
}

const NavigationItem = ({
    title,
    href,
    depth = 0,
    children,
    icon,
    className = '',
    open: openProp = false,
    label,
    svgIcon,
    ...rest
}: NavigationItemProps) => {

    const classes = useStyles();
    const [open, setOpen] = useState(openProp);

    const { pathname } = useLocation();
    // console.log(pathname);
    const active = getActive(href ? href : '#', pathname);

    const handleToggle = () => {
        setOpen(open => !open);
    };

    let paddingLeft = 8;

    if (depth > 0) {
        paddingLeft = 32 + 8 * depth;
    }

    const style = {
        paddingLeft
    };

    if (children) {
        return (
            <ListItem
                {...rest}
                className={addClasses({
                    [classes.item]: true,
                    [className]: true
                })}
                disableGutters
            >
                <Button
                    className={classes.button}
                    onClick={handleToggle}
                    style={style}
                >
                    {svgIcon ?
                        <SvgIcon className={classes.icon}>
                            <svg dangerouslySetInnerHTML={{ __html: svgIcon }} />
                        </SvgIcon>
                        :
                        <Icon icon={icon} className={classes.icon} />
                    }
                    {title}
                    {open ? (
                        <Icon icon="ExpandLess" color="inherit" className={classes.expandIcon} />
                    ) : (
                        <Icon icon="ExpandMore" color="inherit" className={classes.expandIcon} />
                    )}
                </Button>
                <Collapse in={open}>{children}</Collapse>
            </ListItem>
        );
    } else {
        return (
            <ListItem
                {...rest}
                className={addClasses({
                    [classes.itemLeaf]: true,
                    [className]: true,
                })}
                disableGutters
            >
                {href ?
                    <Button
                        className={addClasses({
                            [classes.buttonLeaf]: true,
                            [`depth-${depth}`]: true,
                            [classes.active]: active
                        })}
                        // activeClassName={classes.active}
                        style={style}
                        component={NavLink}
                        to={href}>
                        {svgIcon ?
                            <SvgIcon className={classes.icon}>
                                <svg dangerouslySetInnerHTML={{ __html: svgIcon }} />
                            </SvgIcon>
                            :
                            <Icon icon={icon} className={classes.icon} />
                        }
                        {title}
                        {label && <Label {...label} className={classes.label}
                        >{label.title}</Label>}
                    </Button>
                    :
                    <Button
                        className={addClasses({
                            [classes.buttonLeaf]: true,
                            [`depth-${depth}`]: true,
                        })}
                        style={style}
                        href={href}>
                        {svgIcon ?
                            <SvgIcon className={classes.icon}>
                                <svg dangerouslySetInnerHTML={{ __html: svgIcon }} />
                            </SvgIcon>
                            :
                            <Icon icon={icon} className={classes.icon} />
                        }
                        {title}
                        {label && <Label {...label} className={classes.label}>{label.title}</Label>}
                    </Button>
                }
            </ListItem >
        );
    }
};

export default NavigationItem;

export function getActive(path: string, pathname: string) {
    return path ? !!matchPath({ path, end: false }, pathname) : false;
}


const useStyles = makeStyles(({ typography, palette, spacing }: Theme) => ({
    item: {
        display: 'block',
        paddingTop: 0,
        paddingBottom: 0
    },
    itemLeaf: {
        display: 'flex',
        paddingTop: 0,
        paddingBottom: 0
    },
    button: {
        color: 'inherit',
        padding: '10px 8px',
        justifyContent: 'flex-start',
        textTransform: 'none',
        letterSpacing: 0,
        width: '100%',
    },
    buttonLeaf: {
        color: 'inherit',
        padding: '10px 8px',
        justifyContent: 'flex-start',
        textTransform: 'none',
        letterSpacing: 0,
        borderRadius: 0,
        width: '100%',
        fontWeight: typography.fontWeightRegular,
        '&.depth-0': {
            fontWeight: typography.fontWeightMedium
        },
    },
    icon: {
        color: palette.icon,
        display: 'flex',
        alignItems: 'center',
        marginRight: spacing(1)
    },
    expandIcon: {
        marginLeft: 'auto',
        height: 16,
        width: 16
    },
    label: {
        display: 'flex',
        alignItems: 'center',
        marginLeft: 'auto'
    },
    active: {
        fontWeight: typography.fontWeightMedium,
        backgroundColor: fade(palette.text.primary, 0.1),
    }
}));