import Typography from 'components/atoms/Typography';
import FormHelperText from 'components/atoms/FormHelperText';
import Fab from 'components/atoms/Fab';
import React from 'react';
import { __ } from 'helpers/i18n';
import useAjax from 'hook/useApi';
import { FieldFormItemProps } from '../type';
// import DataTable from './DataTable';
// import DrawerEditPost from './DrawerEditPost';
import Icon from 'components/atoms/Icon';
import NotFound from 'components/molecules/NotFound';

export default React.memo(function RelationshipOneToManyShowForm({ config, post }: FieldFormItemProps) {

    const [data, setData] = React.useState<JsonFormat | false>(false);
    const [openDrawer, setOpenDrawer] = React.useState(false);
    const { ajax, open } = useAjax();

    const [queryUrl, setQueryUrl] = React.useState({
        ...config,
        mainType: post.type,
        id: post.id,
        page: 1,
        rowsPerPage: 5,
        ...config.paginate
    });

    const handleOnClose = () => {
        setOpenDrawer(false);
    }

    const handelOnOpen = () => {
        setOpenDrawer(true);
    }

    const onLoadCollection = () => {
        ajax({
            url: 'post-type/show-post-relationship',
            method: 'POST',
            data: queryUrl,
            success: (result: JsonFormat) => {
                if (result.rows) {
                    result.action = 'ADD_NEW';
                    setData({ ...result, type: config.object });
                }
            }
        });
    };

    React.useEffect(() => {
        if (post.id) {
            onLoadCollection();
        } else {
            setData(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [queryUrl]);

    const handleSubmit = () => {

        if (!open) {
            ajax({
                url: 'post-type/post/' + config.object,
                method: 'POST',
                data: data ? { ...data.post, _action: data.action } : {},
                success: (result) => {
                    if (result.post?.id) {
                        setOpenDrawer(false);
                        onLoadCollection();
                    }
                }
            });
        }

    };


    if (!post.id) {
        return (<>
            <Typography variant="h5" style={{ margin: '8px 0' }}>
                {config.title}
                < Fab onClick={handelOnOpen} style={{ marginLeft: 8 }} size="small" color="primary" aria-label="add">
                    <Icon icon="AddRounded" />
                </Fab>
            </Typography>
            {
                Boolean(config.note) &&
                <FormHelperText ><span dangerouslySetInnerHTML={{ __html: config.note }}></span></FormHelperText>
            }
            <NotFound
                title={__(' You need to create taxonomy before creating {{post_type}}', { post_type: config.title })}
                subTitle={__('Seems like no {{data}} have been created yet.', {
                    data: data !== false ? data?.config?.label?.singularName : "data"
                })}
            />
        </>);
    }

    return (
        <div>
            <Typography variant="h5" style={{ margin: '8px 0' }}>
                {config.title}
                < Fab onClick={handelOnOpen} style={{ marginLeft: 8 }} size="small" color="primary" aria-label="add">
                    <Icon icon="AddRounded" />
                </Fab>
            </Typography>
            {
                Boolean(config.note) &&
                <FormHelperText ><span dangerouslySetInnerHTML={{ __html: config.note }}></span></FormHelperText>
            }
            {
                data !== false && post.id &&
                <>
                    {/* <DataTable
                        requestApi={{ ...config, id: post.id }}
                        setQueryUrl={setQueryUrl}
                        queryUrl={queryUrl}
                        data={data}
                        onEdit={onLoadCollection}
                        editTemplate="1column"
                        config={config}
                    /> */}
                    {/* <DrawerEditPost
                        open={openDrawer}
                        onClose={handleOnClose}
                        data={data}
                        setData={setData}
                        handleSubmit={handleSubmit}
                        showLoadingButton={open}
                    /> */}
                </>
            }
        </div >
    )
}, (props1, props2) => {
    return props1.post[props1.name] === props2.post[props2.name] && props1.post?.id === props2.post?.id;
})

