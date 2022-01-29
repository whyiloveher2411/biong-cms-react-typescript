import { Theme } from '@mui/material';
import Box from 'components/atoms/Box';
import Button from 'components/atoms/Button';
import CircularProgress from 'components/atoms/CircularProgress';
import Dialog from 'components/atoms/Dialog';
import DialogActions from 'components/atoms/DialogActions';
import DialogContent from 'components/atoms/DialogContent';
import DialogContentText from 'components/atoms/DialogContentText';
import DialogTitle from 'components/atoms/DialogTitle';
import Fab from 'components/atoms/Fab';
import FieldForm from 'components/atoms/fields/FieldForm';
import Grid from 'components/atoms/Grid';
import Icon from 'components/atoms/Icon';
import IconButton from 'components/atoms/IconButton';
import ListItemIcon from 'components/atoms/ListItemIcon';
import ListItemText from 'components/atoms/ListItemText';
import makeCSS from 'components/atoms/makeCSS';
import Menu from 'components/atoms/Menu';
import MenuItem from 'components/atoms/MenuItem';
import Tooltip from 'components/atoms/Tooltip';
import TooltipWhite from 'components/atoms/TooltipWhite';
import Typography from 'components/atoms/Typography';
import Hook from 'components/function/Hook';
import { __ } from 'helpers/i18n';
import useAjax from 'hook/useApi';
import { usePermission } from 'hook/usePermission';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PostInfo from '../PostInfo';
import LabelPost from '../ShowData/Result/LabelPost';

const useStyles = makeCSS((theme: Theme) => ({
    infopage: {
        lineHeight: '20px'
    },
    backToList: {
        cursor: 'pointer',
    },
    grid: {
        marginBottom: 0
    },
    rowAction: {
        '& .MuiIconButton-root': {
            width: 40,
            height: 40,
            margin: '0 1px',
            opacity: 0.5,
            color: 'inherit',
            '&:hover': {
                opacity: 1
            }
        }
    },
    seperateAction: {
        display: 'inline-block',
        padding: '0 10px',
        position: 'relative',
        minHeight: 12,
        '&:first-child': {
            paddingLeft: 0
        },
        '&:last-child': {
            paddingRight: 0,
            '&::after': {
                display: 'none'
            }
        },
        '&::after': {
            content: '""',
            display: 'inline-block',
            position: 'absolute',
            width: 1,
            height: 20,
            background: theme.palette.dividerDark,
            top: '50%',
            right: 0,
            transform: 'translateY(-50%)'
        }
    }
}))

interface HeaderProps {
    title: string,
    postType: string,
    data: any,
    showLoadingButton: boolean,
    handleSubmit: () => void,
    goBack: boolean,
    backToList: boolean,
    hiddenAddButton?: boolean,
}

const Header = ({ title, showLoadingButton, handleSubmit, data, postType, goBack, backToList, hiddenAddButton = false }: HeaderProps) => {

    const classes = useStyles()

    const navigate = useNavigate();

    const permission = usePermission(
        postType + '_publish',
        postType + '_trash',
        postType + '_delete',
        postType + '_restore',
        postType + '_create',
        postType + '_edit'
    );

    const handleBackToList = () => {
        navigate('/post-type/' + postType + '/list');
    };

    const statusRef = React.useRef(null);
    const viewRef = React.useRef(null);

    const [openMenuStatus, setOpenMenuStatus] = React.useState(false)
    const [openMenuView, setOpenMenuView] = React.useState(false)
    const [openDataPicker, setOpenDataPicker] = React.useState(false);

    const [dateForm, setDateForm] = React.useState({ post_date_gmt: data.post?.post_date_gmt ? Number((data.post.post_date_gmt as string) + '000') : '' });

    const [passwordProtected, setPasswordProtected] = React.useState<{
        open: boolean,
        value: string
    }>({
        open: false,
        value: data.post?.password
    });

    const handleDateChange = (d: string) => {
        if (d) {

            let d2 = new Date(d);

            if (data && data.post) {
                data.post.post_date_gmt = (d2.getTime() + '').slice(0, -3);
                setDateForm({ post_date_gmt: d2.getTime() });
            }

        } else {
            data.post.post_date_gmt = null;
            setDateForm({ post_date_gmt: '' });
        }

    };

    const [updateView, setUpdateview] = React.useState(0);
    const [confirmDelete, setConfirmDelete] = React.useState(false);

    const handelOnClickDelete = () => {
        setConfirmDelete(true);
    };

    const closeDialogConfirmDelete = () => {
        setConfirmDelete(false);
    };

    const { ajax, Loading } = useAjax();

    const deletePost = () => {
        setConfirmDelete(false);
        ajax({
            url: 'post-type/delete/' + data.type,
            method: 'POST',
            data: data.post,
            success: () => {
                navigate('/post-type/' + postType + '/list');
            }
        });
    };



    const handleOnClickStar = () => {
        data.post.starred = data.post.starred * 1 === 1 ? 0 : 1;
        setUpdateview(updateView + 1);
    };

    const updateStatus = (status: string) => {

        if (data.post.status !== status) {
            data.post.status_old = data.post.status;
            data.post.status = status;
            setUpdateview(updateView + 1);
            setOpenMenuStatus(false);
        }
    }

    const restorePost = () => {

        if (data.post.status === 'trash') {

            if (data.post.status_old === 'trash') {
                data.post.status = 'publish';
            } else {
                data.post.status = data.post.status_old;
            }

            data.post.status_old = 'trash';
            setUpdateview(updateView + 1);
            setOpenMenuStatus(false);
        }

    };

    const updateViewStatus = (status: string, value = false) => {
        if (status === 'password') {
            if (value) {
                data.post.visibility = status;
                data.post.password = value;
                setUpdateview(updateView + 1);
                setOpenMenuView(false);
                setPasswordProtected({ ...passwordProtected, open: false });
            } else {
                setPasswordProtected({ ...passwordProtected, open: true });
            }
        } else {
            data.post.visibility = status;
            setUpdateview(updateView + 1);
            setOpenMenuView(false);
        }
    }

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 3
            }}
            className={classes.grid}
        >
            <Grid item>
                <Typography className={classes.infopage} component="h2" gutterBottom variant="overline">
                    {__('Content')} / <span className={classes.backToList} onClick={handleBackToList}>{data.config?.title}</span> / {title} <LabelPost post={data.post} />
                </Typography>
                <Typography component="h1" variant="h3" className={classes.rowAction}>
                    <div className={classes.seperateAction}>
                        {
                            Boolean(goBack) &&
                            <Tooltip className={classes.backToList} onClick={() => navigate(-1)} title={__('Go Back')} aria-label="go-back"><IconButton color="default" aria-label="Go Back" component="span">
                                <Icon icon="ArrowBackOutlined" />
                            </IconButton></Tooltip>
                        }
                        {
                            Boolean(backToList) &&
                            <Tooltip className={classes.backToList} onClick={handleBackToList} title={__('Back to list')} aria-label="back-to-list"><IconButton color="default" aria-label="Back to list" component="span">
                                <Icon icon="FormatListBulletedRounded" />
                            </IconButton></Tooltip>
                        }
                    </div>
                    <div className={classes.seperateAction}>
                        <Tooltip title={__('Starred')} aria-label="Starred"><IconButton onClick={handleOnClickStar} aria-label="Starred" component="span">
                            {
                                data.post?.starred
                                    ?
                                    <Icon icon="StarOutlined" style={{ color: '#f4b400' }} />
                                    :
                                    <Icon icon="StarBorderOutlined" />
                            }
                        </IconButton></Tooltip>

                        <Tooltip title={__('Status')} aria-label="Status"><IconButton ref={statusRef} onClick={() => setOpenMenuStatus(true)} color="default" aria-label="Status" component="span">
                            {
                                data.post?.status === 'draft' ?
                                    <Icon icon="Note" />
                                    :
                                    data.post?.status === 'pending' ?
                                        <Icon icon="Update" />
                                        :
                                        data.post?.status === 'trash' ?
                                            <Icon icon="Delete" />
                                            :
                                            <Icon icon="PublicRounded" />
                            }
                        </IconButton></Tooltip>

                        <Menu
                            anchorEl={statusRef.current}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            onClose={() => setOpenMenuStatus(false)}
                            open={openMenuStatus}
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}>
                            {
                                permission[postType + '_publish'] &&
                                <MenuItem onClick={e => updateStatus('publish')}>
                                    <ListItemIcon>
                                        <Icon icon="PublicRounded" />
                                    </ListItemIcon>
                                    <ListItemText primary={__('Publish')} />
                                </MenuItem>
                            }
                            <MenuItem onClick={e => updateStatus('draft')}>
                                <ListItemIcon>
                                    <Icon icon="Note" />
                                </ListItemIcon>
                                <ListItemText primary={__('Draft')} />
                            </MenuItem>
                            <MenuItem onClick={e => updateStatus('pending')}>
                                <ListItemIcon>
                                    <Icon icon="Update" />
                                </ListItemIcon>
                                <ListItemText primary={__('Pending')} />
                            </MenuItem>
                            {
                                permission[postType + '_trash'] &&
                                <MenuItem onClick={e => updateStatus('trash')}>
                                    <ListItemIcon>
                                        <Icon icon="Delete" />
                                    </ListItemIcon>
                                    <ListItemText primary={__('Trash')} />
                                </MenuItem>
                            }
                        </Menu>

                        <Tooltip
                            title={__('Release date')}
                            aria-label="release-date">
                            <IconButton
                                onClick={() => { setOpenDataPicker(true); }}
                                color="default"
                                aria-label="Release date"
                                component="span">
                                <Icon icon="Event" />
                            </IconButton>
                        </Tooltip>
                        <div style={{ display: 'none' }}>
                            <FieldForm
                                component="date_time"
                                config={{
                                    title: __('Release date')
                                }}
                                name='post_date_gmt'
                                post={dateForm}
                                onReview={(value) => handleDateChange(value)}
                                open={openDataPicker}
                                onClose={() => setOpenDataPicker(false)}
                            />
                        </div>

                        <Tooltip title={__('Visibility')} aria-label="visibility"><IconButton ref={viewRef} onClick={() => setOpenMenuView(true)} color="default" aria-label="Visibility" component="span">
                            {
                                data.post?.visibility === 'password' ?
                                    <Icon icon="VpnKeyRounded" />
                                    :
                                    data.post?.visibility === 'private' ?
                                        <Icon icon="Lock" />
                                        :
                                        <Icon icon="Visibility" />
                            }
                        </IconButton></Tooltip>
                        <Menu
                            anchorEl={viewRef.current}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            onClose={() => setOpenMenuView(false)}
                            open={openMenuView}
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}>
                            <MenuItem onClick={e => updateViewStatus('publish')}>
                                <ListItemIcon>
                                    <Icon icon="Visibility" />
                                </ListItemIcon>
                                <ListItemText primary={__('Public')} />
                            </MenuItem>
                            <MenuItem onClick={e => updateViewStatus('password')}>
                                <ListItemIcon>
                                    <Icon icon="VpnKeyRounded" />
                                </ListItemIcon>
                                <ListItemText primary={__('Password protected')} />
                            </MenuItem>
                            <MenuItem onClick={e => updateViewStatus('private')}>
                                <ListItemIcon>
                                    <Icon icon="Lock" />
                                </ListItemIcon>
                                <ListItemText primary={__('Private')} />
                            </MenuItem>
                        </Menu>
                        <Dialog
                            onClose={() => setPasswordProtected({ ...passwordProtected, open: false })}
                            open={passwordProtected.open}>
                            <DialogTitle>{__('Password confirm')}</DialogTitle>
                            <DialogContent>
                                <DialogContentText>
                                    {__('Protected with a password you choose. Only those with the password can view this post')}
                                </DialogContentText>
                                <FieldForm
                                    component='password'
                                    config={{ title: 'Password' }}
                                    post={{ _password: data.post?.password }}
                                    name='password'
                                    onReview={(value) => setPasswordProtected({ ...passwordProtected, value: value })}
                                />
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={() => setPasswordProtected({ ...passwordProtected, open: false })} color="inherit">
                                    {__('Cancel')}
                                </Button>
                                <Button onClick={() => updateViewStatus('password', passwordProtected.value ? passwordProtected.value : data.post.password)} color="primary">
                                    {__('OK')}
                                </Button>
                            </DialogActions>
                        </Dialog>
                        {
                            Boolean(data.post?.id) &&
                            <TooltipWhite disableInteractive={false} title={<PostInfo data={data} />}   >
                                <IconButton>
                                    <Icon icon="InfoOutlined" />
                                </IconButton>
                            </TooltipWhite>
                        }

                        {
                            Boolean(data.post && data.post._permalink) &&
                            <Tooltip title={__('View post')} aria-label="view-post"><IconButton href={data.post._permalink} style={{ color: '#337ab7', opacity: 1 }} target="_blank" >
                                <Icon icon="LinkRounded" />
                            </IconButton></Tooltip>
                        }
                    </div>
                    <div className={classes.seperateAction}>
                        <Hook hook="PostType/Action" screen="detail" post={data.post ?? null} />
                    </div>
                </Typography>
            </Grid>
            <Grid item style={{ paddingTop: 0 }}>
                {
                    data.post?.status === 'trash' &&
                    <>
                        {
                            permission[postType + '_delete'] && data.post?.id &&
                            <Button style={{ marginRight: 8 }} onClick={handelOnClickDelete} color="secondary" variant="contained">
                                {__('Delete')}
                            </Button>
                        }

                        {
                            permission[postType + '_restore'] &&
                            <Tooltip title={__('Restore')} aria-label="Restore"><span><Button style={{ marginRight: 8 }} onClick={restorePost} color="success" variant="contained">
                                {__('Restore')}
                            </Button></span></Tooltip>
                        }
                        <Dialog
                            open={confirmDelete}
                            onClose={closeDialogConfirmDelete}
                            aria-labelledby="alert-dialog-title"
                            aria-describedby="alert-dialog-description">
                            <DialogTitle id="alert-dialog-title">{"Confirm Deletion"}</DialogTitle>
                            <DialogContent>
                                <DialogContentText id="alert-dialog-description">
                                    {__('Are you sure you want to permanently remove this item?')}
                                </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={deletePost} color="inherit">
                                    {__('OK')}
                                </Button>
                                <Button onClick={closeDialogConfirmDelete} color="primary" autoFocus>
                                    {__('Cancel')}
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </>
                }
                {
                    data ?
                        data.action === 'ADD_NEW' ?
                            (
                                permission[postType + '_create'] ?
                                    <Button
                                        color="primary"
                                        onClick={handleSubmit}
                                        variant="contained"
                                        startIcon={showLoadingButton ? <CircularProgress size={24} color={'inherit'} /> : null}
                                    >
                                        {__('Publish')}
                                    </Button>
                                    : null
                            )
                            :
                            (
                                permission[postType + '_edit'] ?
                                    <>
                                        <Tooltip title={__('Create a new post is a copy of the current post')}><span>
                                            <Button onClick={(e) => { data.post._copy = true; handleSubmit(); }} variant="contained" color="inherit" style={{ marginRight: 8 }}>{__('Copy')}</Button>
                                        </span></Tooltip>
                                        <Button
                                            color="primary"
                                            onClick={handleSubmit}
                                            variant="contained"
                                            startIcon={showLoadingButton ? <CircularProgress size={24} color={'inherit'} /> : null}
                                        >
                                            {__('Update')}
                                        </Button>
                                    </>
                                    : null
                            )
                        :
                        <></>

                }
                {
                    !Boolean(hiddenAddButton) &&
                    <Tooltip title={__('Add new')} aria-label={__('Add new')}><Link to={`/post-type/${postType}/new`}>
                        <Fab style={{ marginLeft: 8 }} size="small" color="primary" aria-label="add">
                            <Icon icon="AddRounded" />
                        </Fab>
                    </Link></Tooltip>
                }
                {Loading}
            </Grid>
        </Box>
    )
}

export default Header
