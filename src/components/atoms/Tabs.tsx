import { default as MuiTabs } from "@mui/material/Tabs";
import { default as MuiTab } from "@mui/material/Tab";
import Button from 'components/atoms/Button'
import Divider from 'components/atoms/Divider'
import Collapse from 'components/atoms/Collapse'
import Box from 'components/atoms/Box'
import React from 'react';
import { addClasses } from 'helpers/dom';
import { withStyles } from "@mui/styles";
import makeCSS from "./makeCSS";
import { Theme } from "@mui/material";
import { fade } from "helpers/mui4/color";
import Icon from "./Icon";
import { TabsProps as MuiTabsProps } from '@mui/material/Tabs';
import { TabProps as MuiTabProps } from '@mui/material/Tab';

const StyledTabs = withStyles({
    indicator: {
        display: 'flex',
        justifyContent: 'center',
        backgroundColor: 'transparent',
        '& > span': {
            width: '100%',
            backgroundColor: 'var(--color)',
        },
    },
})((props: MuiTabsProps) => <MuiTabs {...props} TabIndicatorProps={{ children: <span /> }} />);

const StyledTab = withStyles((theme) => ({
    root: {
        textTransform: 'none',
        fontWeight: theme.typography.fontWeightRegular,
        fontSize: theme.typography.pxToRem(15),
        marginRight: theme.spacing(1),
        '&:focus': {
            opacity: 1,
        },
    },
}))((props: MuiTabProps) => <MuiTab disableRipple {...props} />);



const useStyles = makeCSS((theme: Theme) => ({
    root: {
        '& .tab-content': {
            marginTop: 16
        }
    },
    tabContent: {
        marginTop: 16
    },
    tabs2Root: {
        flexGrow: 1,
        display: 'flex',
        minHeight: 224,
        '& .MuiButton-startIcon': {
            marginBottom: '5px'
        }
    },
    displayNone: {
        display: 'none'
    },
    tabs1: {
        position: 'sticky',
        top: 0,
        zIndex: 2,
        '& .Mui-selected': {
            color: 'var(--color)',
        },
        '& .MuiTabs-indicator': {
            left: 'var(--left) !important',
            transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
        }
    },
    tabsItem: {
        padding: '6px 16px',
        whiteSpace: 'nowrap',
    },
    subTabsItem: {
        padding: '6px 16px 6px 40px',
        whiteSpace: 'initial',
        justifyContent: 'flex-start',
        width: 'var(--tabWidth)',
        minWidth: 160,
        minHeight: 48,
        opacity: 0.7,
        textAlign: 'left',
        '&.active': {
            backgroundColor: fade(theme.palette.text.primary, 0.06)
        }
    },
    tabs: {
        background: theme.palette.body.background,
        display: 'flex',
        width: 'var(--tabWidth)',
        flexDirection: 'column',
        borderRight: `1px solid ${theme.palette.dividerDark}`,
        position: 'relative',
        '--color': theme.palette.primary.main,
        '&>.indicator': {
            position: 'absolute',
            right: 0,
            width: 2,
            height: 48,
            transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
            background: 'var(--color)',
        },
        '&>button': {
            width: 'var(--tabWidth)',
            minWidth: 160,
            minHeight: 48,
            opacity: 0.7,
            '&:not($hasSubTab).active': {
                opacity: 1,
                color: 'var(--color)',
            },
        },
        '& .MuiButton-label': {
            justifyContent: 'left',
            display: 'flex',
            alignItems: 'flex-start'
        }
    },
    tabsIcon: {
        '&>button': {
            minWidth: 0,
            minHeight: 0,
            height: 48,
        },
        '& .MuiButton-label': {
            justifyContent: 'center'
        }
    },
    hasSubTab: {

    },
    indicatorInline: {
        '& $tabsItem.active:not($hasSubTab):after, & $subTabsItem.active:after': {
            content: '""',
            position: 'absolute',
            right: 0,
            width: 2,
            height: 48,
            transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
            background: 'var(--color)',
        },
        '& $subTabsItem.active': {
            opacity: 1,
            color: 'var(--color)',
        },
    },
    tabHorizontal: {
        textTransform: 'unset',
        width: 'auto',
        minWidth: 'auto',
        paddingLeft: 0,
        paddingRight: 0,
        margin: '0 16px',
    },
    dense: {
        '--color': theme.palette.primary.main,
        '& $tabHorizontal:first-child': {
            marginLeft: 0
        }
    },
    scrollable: {
        '& .MuiTabScrollButton-root.Mui-disabled': {
            opacity: .2,
        }
    }

}));

export interface TabProps {
    title: React.ReactNode,
    content: (propContent: any) => React.ReactNode,
    hidden?: boolean,
    subTab?: TabProps[],
    buttonProps?: any,
    restTitle?: any,
    key?: string,
}

interface TabsProps {
    [key: string]: any,
    name: string,
    tabs: TabProps[],
    tabIndex?: number,
    subTabIndex?: number,
    tabIcon?: boolean,
    orientation?: 'horizontal' | 'vertical',
    activeIndicator?: boolean,
    tabWidth?: number,
    propsContent?: any,
    disableDense?: boolean,
    onChangeTab?: (tab: number, subTab: number | undefined | null) => void
}

function Tabs({
    name,
    tabs,
    tabIcon,
    orientation = "horizontal",
    activeIndicator = true,
    tabWidth = 250,
    tabIndex = -1,
    subTabIndex = -1,
    propsContent,
    disableDense,
    ...props
}: TabsProps) {

    const classes = useStyles();

    const [tabCurrent, setTableCurrent] = React.useState<{
        [key: string]: number,
    }>({
        [name]: tabIndex,
        [name + '_subTab']: subTabIndex,
    });

    const [openSubTab, setOpenSubTab] = React.useState<{ [key: number]: boolean }>({});

    const handleChangeTab = (i: number, subTabKey: number | undefined | null = null) => {

        if (tabs[i].subTab) {

            if (subTabKey !== null) {
                setTableCurrent({ ...tabCurrent, [name]: i, [name + '_subTab']: subTabKey });
                if (props.onChangeTab) {
                    props.onChangeTab(i, subTabKey);
                }
            } else {
                setOpenSubTab(prev => ({ ...prev, [i]: !prev[i] }));
            }

        } else {
            setTableCurrent({ ...tabCurrent, [name]: i, [name + '_subTab']: -1 });
            if (props.onChangeTab) {
                props.onChangeTab(i, subTabKey);
            }
        }

    };

    React.useEffect(() => {



    }, [tabCurrent])

    const getIndexFirstShow = (index: number): number => {
        if (tabs[index] && tabs[index].hidden) {
            return getIndexFirstShow(index + 1);
        }
        return index;
    }

    React.useEffect(() => {

        setTableCurrent({
            [name]: tabCurrent[name],
            [name + '_subTab']: tabCurrent[name + '_subTab']
        });

        setOpenSubTab(prev => {
            tabs.forEach((item, index) => {
                if (index === tabCurrent[name] && item.subTab) {
                    prev[index] = true;
                } else {
                    prev[index] = false;
                }
            });

            return { ...prev };
        });

        // eslint-disable-next-line
    }, [name]);

    if (tabs.length < 1) {
        return null;
    }

    if (orientation === 'vertical') {
        return (
            <div className={classes.tabs2Root} style={{ ['--tabWidth' as string]: (!tabIcon ? tabWidth : 58) + 'px' }}>
                <div className={addClasses({
                    [classes.tabs]: true,
                    [classes.tabsIcon]: tabIcon,
                    [classes.indicatorInline]: !activeIndicator
                })}>
                    {
                        activeIndicator &&
                        <span className='indicator' style={{ top: ((tabCurrent[name] ?? -1) - tabs.filter((item, index) => index < (tabCurrent[name] ?? -1) && item.hidden).length) * 48 }}></span>
                    }
                    {
                        tabs.map((tab, i: number) => (
                            !tab.hidden ?
                                <React.Fragment key={i}>
                                    <Button
                                        {...tab.buttonProps}
                                        onClick={() => handleChangeTab(i)}
                                        className={addClasses({
                                            [classes.tabsItem]: true,
                                            active: tabCurrent[name] === i,
                                            [classes.hasSubTab]: Boolean(tab.subTab)
                                        })}
                                        color="inherit"
                                        {...tab.restTitle}
                                    >
                                        <Box
                                            sx={{
                                                display: "flex",
                                                width: 1,
                                                justifyContent: "space-between"
                                            }}
                                        >
                                            {tab.title}
                                            {
                                                Boolean(tab.subTab) &&
                                                (
                                                    openSubTab[i] ? <Icon icon="ExpandLess" /> : <Icon icon="ExpandMore" />
                                                )
                                            }
                                        </Box>
                                    </Button>
                                    {
                                        typeof tab.subTab !== undefined &&
                                        <Collapse in={openSubTab[i]} timeout="auto" unmountOnExit>
                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    flexDirection: "column"
                                                }}
                                            >
                                                {
                                                    tab.subTab && tab.subTab.map((subTabItem, indexSubTab) => (
                                                        <Button
                                                            {...subTabItem.buttonProps}
                                                            key={indexSubTab}
                                                            onClick={() => handleChangeTab(i, indexSubTab)}
                                                            className={classes.subTabsItem + ((tabCurrent[name] === i && tabCurrent[name + '_subTab'] === indexSubTab) ? ' active' : '')}
                                                            color="inherit"
                                                            {...subTabItem.restTitle}
                                                        >
                                                            {subTabItem.title}
                                                        </Button>
                                                    ))
                                                }
                                            </Box>
                                        </Collapse>
                                    }
                                </React.Fragment>
                                : <React.Fragment key={i}></React.Fragment>
                        ))
                    }
                </div>
                <div style={{ paddingLeft: 24, width: '100%' }}>
                    {
                        (() => {
                            if (typeof tabCurrent[name] === 'number' && tabs[tabCurrent[name]] !== undefined && !tabs[tabCurrent[name]].hidden) {
                                if (tabCurrent[name + '_subTab'] !== null
                                    && tabs[tabCurrent[name]].subTab
                                    //@ts-ignore
                                    && tabs[tabCurrent[name]].subTab[tabCurrent[name + '_subTab']]
                                ) {
                                    //@ts-ignore
                                    return (tabs[tabCurrent[name]].subTab[tabCurrent[name + '_subTab']].content)(propsContent);
                                }
                                return (tabs[tabCurrent[name]].content)(propsContent);
                            } else {
                                setTableCurrent({ ...tabCurrent, [name]: getIndexFirstShow(0), [name + '_subTab']: -1 });
                            }
                        })()
                    }
                </div>
            </div >
        )
    }

    return (
        <div className={classes.scrollable}>
            <StyledTabs
                scrollButtons="auto"
                variant="scrollable"
                value={tabCurrent[name]}
                textColor="primary"
                className={addClasses({
                    [classes.dense]: !disableDense
                })}
                onChange={(_e, v: number) => handleChangeTab(v)}
            >
                {tabs.map((tab, i) => (
                    <StyledTab
                        className={addClasses({
                            [classes.tabHorizontal]: true,
                            [classes.displayNone]: tab.hidden,
                        })}
                        key={i}
                        label={tab.title}
                        value={i}
                    />
                ))}
            </StyledTabs>
            <Divider color="dark" />
            <div className={classes.tabContent}>
                {
                    (() => {
                        if (tabs[tabCurrent[name]] && !tabs[tabCurrent[name]].hidden) {
                            return (tabs[tabCurrent[name]].content)(propsContent);
                        } else {
                            setTableCurrent({ ...tabCurrent, [name]: getIndexFirstShow(0), [name + '_subTab']: -1 });
                        }
                    })()
                }
            </div>
        </div>
    )
}

export default Tabs
