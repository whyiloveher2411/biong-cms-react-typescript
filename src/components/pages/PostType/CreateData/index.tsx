import LinearProgress from 'components/atoms/LinearProgress';
import { default as TabsCustom } from 'components/atoms/Tabs';
import React, { useState } from 'react';
import { toCamelCase } from 'helpers/string';
import { getUrlParams } from 'helpers/url';
import { __ } from 'helpers/i18n';
import useForm from 'hook/useForm';
import useAjax from 'hook/useApi';
import { unstable_batchedUpdates } from 'react-dom'
import AddOn from 'components/function/AddOn';
import { useNavigate } from 'react-router-dom';
import Hook from 'components/function/Hook';
import PageHeaderSticky from 'components/templates/PageHeaderSticky';
import Form from './Form';
import Header from './Header';
import { useSnackbar } from 'notistack';

const CreateData = ({ type, action }: { type: string, action: string }) => {

    const { data, setData, onUpdateData } = useForm(false);

    const { enqueueSnackbar } = useSnackbar();

    const [times, setTimes] = React.useState(0);

    const navigate = useNavigate();

    const { ajax, open } = useAjax();

    const [title, setTitle] = useState('...');

    let id = getUrlParams(window.location.search, 'post_id');

    const { callAddOn } = AddOn();

    const handleSubmit = () => {

        setData((prev: JsonFormat) => {

            console.log(prev.post);

            if (!open) {
                ajax({
                    url: 'post-type/post/' + type,
                    method: 'POST',
                    data: { ...prev.post, _action: prev.action },
                    success: (result: JsonFormat) => {

                        if (result.post) {
                            if (result.post.id !== prev.post.id) {
                                navigate(`/post-type/${type}/list?redirectTo=edit&post=${result.post.id}`);
                                return;
                            } else {
                                result.updatePost = new Date();
                                setData({ ...prev, post: result.post, author: result.author, editor: result.editor, updatePost: new Date() })
                            }
                        }

                    }
                });
            }

            return prev;
        });
    };

    React.useLayoutEffect(() => {

        ajax({
            url: `post-type/detail/${type}/${id}`,
            method: 'POST',
            success: function (result: JsonFormat) {

                unstable_batchedUpdates(() => {
                    if (result.redirect) {

                        navigate(result.redirect);
                        return;

                    } else {

                        if (result.config) {

                            result.type = type;
                            result.updatePost = new Date();

                            if (result.post) {

                                setTitle(__('Edit') + ' "' + result.post[Object.keys(result.config.fields)[0]] + '"');
                                result.action = 'EDIT';

                            } else {

                                if (action === 'edit') {

                                    navigate(`/post-type/${type}/list`);

                                    enqueueSnackbar(__('Does not exist {{post_type}} with id is {{id}}', {
                                        post_type: result.config.title,
                                        id
                                    }), {
                                        variant: 'warning'
                                    });

                                    return;

                                } else {
                                    setTitle(__('Add new') + ' ' + result.config?.title);
                                    result.action = 'ADD_NEW';
                                    result = { ...result, post: { meta: {} } };
                                }
                            }

                            result.config.extendedTab = callAddOn(
                                'CreateData/Tabs',
                                type,
                                { formEdit: { title: __('Edit'), priority: 1 } },
                                { ...result }
                            );

                            setTimes(prev => prev + 1);
                            setData({ ...result });

                        }

                    }
                })
            }
        });

        //eslint-disable-next-line
    }, [id]);

    const renderElement = () => (
        <>
            <Hook
                hook={'PostType/' + toCamelCase(type) + '/CreateData'}
                data={data}
                postType={type}
                onUpdateData={onUpdateData}
            />
            {!data &&
                <LinearProgress style={{ position: 'absolute', left: 0, right: 0 }} />
            }
            {
                (() => {

                    try {

                        let component = toCamelCase(type);
                        let resolved = require(`../CustomPostType/${component}`).default;

                        if (data) {
                            return React.createElement(resolved, { data: data });
                        }

                        // return <></>;
                    } catch (error) {

                        return (
                            <PageHeaderSticky
                                title={title}
                                header={<Header
                                    postType={type}
                                    data={data}
                                    title={title}
                                    showLoadingButton={open}
                                    handleSubmit={handleSubmit}
                                    goBack={true}
                                    backToList={true}
                                />}
                            >
                                {/* {Loading} */}
                                {data &&
                                    <>
                                        {
                                            Boolean(Object.keys(data.config.extendedTab).length > 1)
                                                ?
                                                <TabsCustom
                                                    name={'create_data_extendedTab_' + type}
                                                    tabs={
                                                        (() => {
                                                            let result = Object.keys(data.config.extendedTab).map(key => {

                                                                if (key === 'formEdit') {
                                                                    return {
                                                                        ...data.config.extendedTab[key],
                                                                        title: data.config.extendedTab[key].title ?? __('Edit'),
                                                                        content: () => <Form
                                                                            data={data}
                                                                            postType={type}
                                                                            onUpdateData={onUpdateData}
                                                                        />
                                                                    }
                                                                }

                                                                if (data.config.extendedTab[key].content) {
                                                                    return {
                                                                        ...data.config.extendedTab[key],
                                                                        content: () => <Hook
                                                                            hook={data.config.extendedTab[key].content}
                                                                            data={data}
                                                                            postType={type}
                                                                            onUpdateData={onUpdateData}
                                                                        />
                                                                    }
                                                                }

                                                                if (data.config.extendedTab[key].component) {
                                                                    return {
                                                                        ...data.config.extendedTab[key],
                                                                        content: () => data.config.extendedTab[key].component({
                                                                            data: data,
                                                                            postType: type,
                                                                            onUpdateData: onUpdateData
                                                                        })
                                                                    }
                                                                }

                                                                return null;
                                                            });
                                                            return result;
                                                        })()
                                                    }
                                                />
                                                :
                                                <Form
                                                    data={data}
                                                    postType={type}
                                                    onUpdateData={onUpdateData}
                                                />
                                        }
                                    </>
                                }
                            </PageHeaderSticky>
                        );
                    }

                })()

            }
        </>
    )

    if (times % 2 === 0) {
        return renderElement()
    }

    return <div>{renderElement()}</div>
}

export default CreateData
