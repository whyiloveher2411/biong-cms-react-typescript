import Typography from 'components/atoms/Typography';
import Tooltip from 'components/atoms/Tooltip';
import TableRow from 'components/atoms/TableRow';
import TablePagination from 'components/atoms/TablePagination';
import TableHead from 'components/atoms/TableHead';
import TableCell from 'components/atoms/TableCell';
import TableBody from 'components/atoms/TableBody';
import Table from 'components/atoms/Table';
import IconButton from 'components/atoms/IconButton';
import Divider from 'components/atoms/Divider';
import CircularProgress from 'components/atoms/CircularProgress';
import Checkbox from 'components/atoms/Checkbox';
import CardHeader from 'components/atoms/CardHeader';
import CardContent from 'components/atoms/CardContent';
import CardActions from 'components/atoms/CardActions';
import Card from 'components/atoms/Card';
import Button from 'components/atoms/Button';
import Box from 'components/atoms/Box';
import { default as DialogCustom } from 'components/molecules/Dialog';
// import { ActionPost, DialogCustom, DrawerEditPost, FieldView, NotFound, TableEditBar } from 'components';
// import MoreButton from 'components/MoreButton';
import React, { useState } from 'react';
import useAjax from 'hook/useApi';
import { __ } from 'helpers/i18n';
import LabelPost from './Result/LabelPost';
import { ShowDataResultApiProps } from '.';
import NotFound from 'components/molecules/NotFound';
import FieldView from 'components/atoms/fields/FieldView';
import Icon from 'components/atoms/Icon';
import { useNavigate } from 'react-router-dom';
import makeCSS from 'components/atoms/makeCSS';
import { Theme } from '@mui/material';
import ActionOnPost from './Result/ActionOnPost';
import ActionOnPostSelected from './Result/ActionOnPostSelected';
import ConfirmDialog from 'components/molecules/ConfirmDialog';

const useStyles = makeCSS((theme: Theme) => ({
    root: {
        paddingBottom: 56,
    },
    results: {
        marginTop: theme.spacing(3),
    },
    cardWarper: {
        position: 'relative',
        '&>.MuiCardHeader-root>.MuiCardHeader-action': {
            margin: 0
        }
    },
    cardHeader: {
        padding: 0,
        height: 56,
        '& .MuiCardHeader-action': {
            alignSelf: 'center'
        }
    },
    showLoading: {
        '&::before': {
            display: 'inline-block',
            content: '""',
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            top: 0,
            background: 'rgba(0, 0, 0, 0.1)',
            zIndex: 1,
        }
    },
    content: {
        padding: 0,
    },
    actions: {
        padding: theme.spacing(1),
        justifyContent: 'flex-end',

    },
    iconLoading: {
        position: 'absolute',
        zIndex: 2,
        top: 'calc(50% - 20px)',
        left: 'calc(50% - 20px)',
    },
    iconStar: {
        width: 40,
        height: 40,
        opacity: 0.7,
        '&:hover': {
            opacity: 1
        }
    },
    trRowAction: {
        position: 'relative',
    },
    pad8: {
        paddingLeft: 8,
        paddingRight: 8,
    },
    rowRecord: {
        cursor: 'pointer',
        '&:hover': {
            '& .actionPost': {
                opacity: 1,
                '& .MuiIconButton-root': {
                    opacity: 0.7,
                    '&:hover': {
                        opacity: 1
                    }
                }
            }
        },
        '&>td': {
            padding: 8,
            position: 'relative',
            height: 56
        },
        '&>.MuiTableCell-paddingCheckbox': {
            padding: '0 0 0 4px'
        }
    },
}))

interface ShowDataTableProps {
    data: ShowDataResultApiProps,
    loading: boolean,
    queryUrl: JsonFormat,
    setQueryUrl: React.Dispatch<React.SetStateAction<JsonFormat>>,
    isLoadedData: boolean,
    postType: string,
    acctionPost: (payload: JsonFormat, success?: ((result: JsonFormat) => void) | undefined) => void,
}

const Results = ({ data, postType, loading, queryUrl, setQueryUrl, isLoadedData, acctionPost, ...rest }: ShowDataTableProps) => {

    const classes = useStyles();

    const navigate = useNavigate();

    const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);

    const [confirmDelete, setConfirmDelete] = React.useState(0);

    const { ajax, Loading, open } = useAjax();

    const [openDrawer, setOpenDrawer] = React.useState(false);
    const [dataDrawer, setDataDrawer] = React.useState(false);


    const closeDialogConfirmDelete = () => {
        setConfirmDelete(0);
    };

    const [render, setRender] = useState(0);

    const handleOnClickSelectAll = () => {

        if (selectedCustomers.length === 0) {
            setSelectedCustomers(data.rows.data.map((customer) => customer.id))
        } else {
            if (selectedCustomers.length === data.rows.data.length) {
                setSelectedCustomers([]);
            } else {
                setSelectedCustomers(data.rows.data.map((customer) => customer.id))
            }
        }

    }

    React.useEffect(() => {
        setSelectedCustomers([]);
    }, [postType]);

    const handleSelectOne = (_event: React.ChangeEvent<HTMLInputElement>, id: string) => {

        const selectedIndex = selectedCustomers.indexOf(id);

        let newSelectedCustomers: string[] = []

        if (selectedIndex === -1) {
            newSelectedCustomers = newSelectedCustomers.concat(
                selectedCustomers,
                id
            )
        } else if (selectedIndex === 0) {
            newSelectedCustomers = newSelectedCustomers.concat(
                selectedCustomers.slice(1)
            )
        } else if (selectedIndex === selectedCustomers.length - 1) {
            newSelectedCustomers = newSelectedCustomers.concat(
                selectedCustomers.slice(0, -1)
            )
        } else if (selectedIndex > 0) {
            newSelectedCustomers = newSelectedCustomers.concat(
                selectedCustomers.slice(0, selectedIndex),
                selectedCustomers.slice(selectedIndex + 1)
            )
        }

        setSelectedCustomers(newSelectedCustomers)
    }

    const handleClickOne: React.MouseEventHandler<HTMLButtonElement> | undefined = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
    };

    const handleChangePage = (_event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null, page: number) => {
        setQueryUrl({ ...queryUrl, page: page + 1 });
        setRender(render + 1);
    }

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setQueryUrl({ ...queryUrl, rowsPerPage: event.target.value });
        setRender(render + 1);
    }

    const actionLiveEdit = (key: any, value: any, post: JsonFormat) => {
        ajax({
            url: 'post-type/post-inline-edit',
            data: {
                post: post,
                key: key,
                value: value,
            },
            success: (result: JsonFormat) => {

            }
        });

    };

    const handleSubmit = () => {

        // if (!open) {
        //     ajax({
        //         url: 'post-type/post/' + dataDrawer.type,
        //         method: 'POST',
        //         data: { ...dataDrawer.post, _action: 'EDIT' },
        //         isGetData: false,
        //         success: (result) => {
        //             if (result.post?.id) {
        //                 setOpenDrawer(false);
        //                 setQueryUrl({ ...queryUrl });
        //             }
        //         }
        //     });
        // }
    }

    const eventClickRow = (_e: React.MouseEvent<HTMLTableRowElement>, id: string) => {

        if (id) {
            navigate(`/post-type/${postType}/edit?post_id=${id}`);
        }

        // setOpen(true);
        // // console.log(data);
        // ajax({
        //     url: `post-type/detail/${postType}/${id}`,
        //     method: 'POST',
        //     isGetData: false,
        //     success: function (result) {
        //         if (result.post) {
        //             result.type = postType;
        //             result.updatePost = new Date();
        //             setDataDrawer(prev => ({ ...result }));
        //             setOpenDrawer(true);
        //         }
        //     }
        // });

    };


    let keyFields = data.config.fields ? Object.keys(data.config.fields).filter(key => data.config.fields[key].show_data !== false || data.config.fields[key].show_data === undefined) : [];


    // (keyFields = Object.keys(options.fields)) &&
    // keyFields.map(key => (
    //     (options.fields[key].show_data !== false || options.fields[key].show_data


    return (
        <div {...rest} className={classes.root + ' ' + classes.results}>
            {
                data.rows.total ?
                    <Typography color="textSecondary" gutterBottom variant="body2">
                        {
                            __('{{total}} Records found. Page {{current_page}} of {{total_page}}', {
                                total: data.rows.total,
                                current_page: data.rows.current_page,
                                total_page: Math.ceil(data.rows.total / data.rows.per_page * 1)
                            })
                        }
                    </Typography>
                    :
                    <Typography color="textSecondary" gutterBottom variant="body2">
                        &nbsp;
                    </Typography>
            }
            <Card className={classes.cardWarper + ' ' + (loading ? classes.showLoading : '')}>
                <CardHeader
                    className={classes.cardHeader}
                    action={
                        <>
                            <Button color='inherit'>Import</Button>
                            <Button color='inherit'>Export</Button>
                            <Button color='inherit'>Columns</Button>
                            {/* <MoreButton
                                action={[
                                    {
                                        import: {
                                            title: 'Import',
                                            icon: 'PublishRounded',
                                            action: () => { alert('Coming sooon.') }
                                        },
                                        export: {
                                            title: 'Export',
                                            icon: 'GetAppRounded',
                                            action: () => { alert('Coming sooon.') }
                                        },
                                    },
                                    {
                                        columns: {
                                            title: 'Columns',
                                            icon: 'SettingsOutlined',
                                            action: () => { alert('Coming sooon.') }
                                        }
                                    }
                                ]}
                            /> */}
                        </>
                    }
                />
                <Divider />
                <CardContent className={classes.content}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell padding="checkbox">
                                    {
                                        data.rows.total ?
                                            <Checkbox
                                                checked={
                                                    Boolean(selectedCustomers.length ===
                                                        data.rows.total && data.rows.total)
                                                }
                                                color="primary"
                                                indeterminate={
                                                    selectedCustomers.length > 0 &&
                                                    selectedCustomers.length < data.rows.total
                                                }
                                                onClick={handleOnClickSelectAll}
                                            />
                                            : <></>
                                    }
                                </TableCell>
                                <TableCell padding="checkbox">

                                </TableCell>
                                {data.config.fields &&
                                    keyFields.map(key => (
                                        <TableCell className={classes.pad8} key={key}>{data.config.fields[key].title}</TableCell>
                                    ))
                                }
                                <TableCell align='right'>{__('Status')}</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data.rows.data.length > 0 ?
                                data.rows.data.map((customer) => (
                                    <TableRow
                                        hover
                                        onClick={(e: React.MouseEvent<HTMLTableRowElement>) => eventClickRow(e, customer.id)}
                                        data-id={customer.id}
                                        key={customer.id}
                                        className={classes.rowRecord}
                                        selected={
                                            selectedCustomers.indexOf(
                                                customer.id
                                            ) !== -1
                                        }>
                                        <TableCell padding="checkbox">
                                            <Checkbox
                                                checked={
                                                    selectedCustomers.indexOf(
                                                        customer.id
                                                    ) !== -1
                                                }
                                                color="primary"
                                                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                                    handleSelectOne(
                                                        event,
                                                        customer.id
                                                    )
                                                }
                                                onClick={handleClickOne}
                                                value={
                                                    selectedCustomers.indexOf(
                                                        customer.id
                                                    ) !== -1
                                                }
                                            />
                                        </TableCell>
                                        <TableCell padding="checkbox">
                                            <Tooltip
                                                title={customer.starred ? __('Starred') : __('Not starred')}
                                                aria-label="Star">
                                                <IconButton
                                                    onClick={(e: React.MouseEvent<HTMLSpanElement>) => {
                                                        e.stopPropagation();
                                                        acctionPost({
                                                            starred: {
                                                                post: customer.id,
                                                                value: !customer.starred
                                                            }
                                                        });
                                                    }}
                                                    color="default"
                                                    className={classes.iconStar}
                                                    aria-label="Back"
                                                    component="span">
                                                    {
                                                        customer.starred
                                                            ?
                                                            <Icon icon="StarOutlined" style={{ color: '#f4b400' }} />
                                                            :
                                                            <Icon icon="StarBorderOutlined" />
                                                    }
                                                </IconButton>
                                            </Tooltip>
                                        </TableCell>
                                        {
                                            keyFields.map(key => (
                                                key === keyFields[0] ?
                                                    <TableCell key={key} className={classes.trRowAction}>
                                                        <Box display="flex" alignItems="center" >
                                                            <FieldView
                                                                name={key}
                                                                component={data.config.fields[key].view}
                                                                post={customer}
                                                                config={data.config.fields[key]}
                                                                content={customer[key]}
                                                                actionLiveEdit={actionLiveEdit}
                                                            />
                                                            {
                                                                (() => {
                                                                    if (customer.is_homepage) {
                                                                        try {
                                                                            let label = JSON.parse(customer.is_homepage);

                                                                            if (label) {
                                                                                return <strong>&nbsp;- {label.title}</strong>;
                                                                            }
                                                                        } catch (error) {
                                                                            return null;
                                                                        }
                                                                    }
                                                                })()
                                                            }
                                                        </Box>
                                                    </TableCell>
                                                    :
                                                    <TableCell key={key}>
                                                        <FieldView
                                                            name={key}
                                                            component={data.config.fields[key].view}
                                                            config={data.config.fields[key]}
                                                            post={customer}
                                                            content={customer[key]}
                                                            actionLiveEdit={actionLiveEdit}
                                                        />
                                                    </TableCell>
                                            ))
                                        }
                                        <TableCell style={{ position: 'relative', padding: 16 }} align='right'>
                                            <LabelPost post={customer} />
                                            <ActionOnPost
                                                fromLayout="list"
                                                setConfirmDelete={setConfirmDelete}
                                                acctionPost={acctionPost}
                                                post={customer}
                                                postType={postType}
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))
                                :
                                (isLoadedData ?
                                    <TableRow>
                                        <TableCell colSpan={100}>
                                            <NotFound subTitle={__('Seems like no {{data}} have been created yet.', {
                                                data: data.config?.label?.singularName ?? __('Data')
                                            })} />
                                        </TableCell>
                                    </TableRow>
                                    :
                                    <TableRow>
                                        <TableCell colSpan={100}>
                                            <NotFound>
                                                {__('Loading...')}
                                            </NotFound>
                                        </TableCell>
                                    </TableRow>
                                )
                            }
                        </TableBody>
                    </Table>
                </CardContent>
                <CardActions className={classes.actions}>
                    <TablePagination
                        component="div"
                        rowsPerPageOptions={[10, 25, 50, 100]}
                        count={data.rows.total ? data.rows.total * 1 : 0}
                        rowsPerPage={data.rows.per_page ? data.rows.per_page * 1 : 10}
                        page={data.rows.current_page ? data.rows.current_page - 1 : 0}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        labelRowsPerPage={__('Rows per page:')}
                        labelDisplayedRows={({ from, to, count }) => `${from} - ${to} ${__('of')} ${count !== -1 ? count : `${__('more than')} ${to}`}`}
                    />
                </CardActions>
                {loading && <CircularProgress value={75} className={classes.iconLoading} />}
            </Card>

            <ActionOnPostSelected
                acctionPost={acctionPost}
                selected={selectedCustomers}
                setSelectedCustomers={setSelectedCustomers}
            />

            {/* <DrawerEditPost
                open={openDrawer}
                onClose={() => setOpenDrawer(false)}
                data={dataDrawer}
                setData={setDataDrawer}
                handleSubmit={handleSubmit}
                showLoadingButton={open}
            /> */}

            <ConfirmDialog
                open={Boolean(confirmDelete !== 0)}
                onClose={closeDialogConfirmDelete}
                onConfirm={() => {
                    acctionPost({ delete: [confirmDelete] });
                    closeDialogConfirmDelete();
                }}
                message={__("Are you sure you want to permanently remove this item?")}
            />

            {Loading}
        </div >
    )
}

export default Results
