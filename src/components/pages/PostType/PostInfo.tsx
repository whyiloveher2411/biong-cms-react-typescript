import List from 'components/atoms/List';
import ListItem from 'components/atoms/ListItem';
import ListItemText from 'components/atoms/ListItemText';
import AvatarGroup from 'components/atoms/AvatarGroup';
import Avatar from 'components/atoms/Avatar';
import Skeleton from 'components/atoms/Skeleton';
import React from 'react';
import { __ } from 'helpers/i18n';
import useAjax from 'hook/useApi';
import makeCSS from 'components/atoms/makeCSS';

const useStyles = makeCSS(() => ({
    listInfo: {
        '& .MuiListItem-root': {
            whiteSpace: 'nowrap'
        }
    },
}));

function PostInfo({ data }: {
    data: {
        [key: string]: any,
        post: JsonFormat
    }
}) {

    const classes = useStyles();

    const [info, setInfo] = React.useState<JsonFormat | false>(false);

    const { ajax, open } = useAjax();

    React.useEffect(() => {

        if (data.post.__author) {
            setInfo(data.post.__author);
        } else {
            if (data.author || data.editor) {
                let infoTemp: JsonFormat = {};

                if (data.author) {
                    infoTemp.author = data.author;
                }

                if (data.editor && data.editor.length) {
                    infoTemp.editor = data.editor;
                }

                setInfo(infoTemp);
            } else {
                if (!data.post.__author) {
                    ajax({
                        url: 'post-type/get-author/' + data.post.id,
                        method: 'POST',
                        data: {
                            postID: data.post.id,
                            postType: data.post.type,
                        },
                        success: (result: JsonFormat) => {
                            if (result.success) {
                                setInfo(prev => ({ ...prev, ...result }));
                                data.post.__author = result;
                            }
                        }
                    });
                }
            }
        }
    }, []);

    return (
        <List component="nav" className={classes.listInfo} aria-label="secondary mailbox folders">
            {
                open || info === false ?
                    <div style={{ width: 280, maxWidth: '100%' }}>
                        <Skeleton variant='rectangular' height={36} style={{ marginBottom: 8 }} />
                        <Skeleton variant='rectangular' height={20} style={{ marginBottom: 4 }} />
                        <Skeleton variant='rectangular' height={54} style={{ marginBottom: 8 }} />
                        <Skeleton variant='rectangular' height={20} style={{ marginBottom: 4 }} />
                        <Skeleton variant='rectangular' height={54} style={{ marginBottom: 8 }} />
                        <Skeleton variant='rectangular' height={36} style={{ marginBottom: 8 }} />
                        <Skeleton variant='rectangular' height={36} style={{ marginBottom: 8 }} />
                        <Skeleton variant='rectangular' height={36} style={{ marginBottom: 8 }} />
                    </div>
                    :
                    <>
                        <ListItem button>
                            <ListItemText><strong>ID:</strong> {data.post.id} </ListItemText>
                        </ListItem>
                        {Boolean(info.author) &&
                            <ListItem button>
                                <ListItemText><strong>{__('Author')}:</strong>
                                    <Avatar
                                        image={info.author.profile_picture}
                                        name={info.author.first_name + ' ' + info.author.last_name}
                                    />
                                </ListItemText>
                            </ListItem>
                        }
                        {
                            Boolean(info.editor) &&
                            <ListItem button>
                                <ListItemText>
                                    <strong>{__('Editor')}:</strong>
                                    <div>
                                        <AvatarGroup max={6}>
                                            {info.editor.map((user: JsonFormat, index: number) =>
                                                <Avatar
                                                    key={index}
                                                    image={user.profile_picture}
                                                    name={user.first_name + ' ' + user.last_name}
                                                />
                                            )}
                                        </AvatarGroup>
                                    </div>
                                </ListItemText>
                            </ListItem>
                        }
                        <ListItem button>
                            <ListItemText><strong>{__('Created At')}:</strong> {data.post.created_at} </ListItemText>
                        </ListItem>
                        <ListItem button>
                            <ListItemText><strong>{__('Last Updated')}:</strong> {data.post.updated_at} </ListItemText>
                        </ListItem>
                        <ListItem button>
                            <ListItemText><strong>{__('Update')}:</strong> {data.post.update_count} {__('times')}</ListItemText>
                        </ListItem>
                    </>
            }
        </List>
    )
}

export default PostInfo
