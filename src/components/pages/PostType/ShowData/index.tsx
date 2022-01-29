import Box from 'components/atoms/Box';
import Button from 'components/atoms/Button';
import Divider from 'components/atoms/Divider';
import Grid from 'components/atoms/Grid';
import Skeleton from 'components/atoms/Skeleton';
import Table from 'components/atoms/Table';
import TableBody from 'components/atoms/TableBody';
import TableCell from 'components/atoms/TableCell';
import TableRow from 'components/atoms/TableRow';
import Tabs from 'components/atoms/Tabs';
import AddOn from 'components/function/AddOn';
import Hook from 'components/function/Hook';
import Page from 'components/templates/Page';
import { __ } from 'helpers/i18n';
import { toCamelCase } from 'helpers/string';
import { getUrlParams, replaceUrlParam } from 'helpers/url';
import useAjax from 'hook/useApi';
import { usePermission } from 'hook/usePermission';
import React, { useEffect, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import FilterTab from './FilterTab';
import Header from './Header';
import Results from './Results';
import SearchBar from './SearchBar';





const ShowData = ({ type }: { type: string, action: string }) => {

    const [data, setData] = useState<ShowDataResultApiProps | false>(false);
    const [title, setTitle] = useState('...');

    const [showLoading, setShowLoading] = useState(true);
    const [isLoadedData, setIsLoadedData] = useState(false);
    const [render, setRender] = useState(0);

    const navigate = useNavigate();

    const permission = usePermission(type + '_create');

    const { callAddOn } = AddOn();

    const { ajax } = useAjax({ loadingType: 'custom' });

    const valueInital = {
        rowsPerPage: 10,
        page: 1,
        search: '',
        filter: 'all',
        ...getUrlParams(window.location.search) as {}
    };

    const [queryUrl, setQueryUrl] = useState<JsonFormat>(valueInital);

    useEffect(() => {

        setQueryUrl({ ...valueInital, ...getUrlParams(window.location.search) as {} });

        //eslint-disable-next-line
    }, [type]);

    const ajaxHandle = (params: JsonFormat) => {

        setShowLoading(true);

        ajax({
            url: `post-type/${params.url}`,
            method: 'POST',
            data: params.data,
            success: (result: JsonFormat) => {

                if (params.success) {
                    params.success(result);
                }

            },
            finally: () => {
                setShowLoading(false);

                if (params.finally) {
                    params.finally();
                }
            }
        });

    };

    useEffect(() => {

        if (!render) {
            setRender(render + 1);
            return;
        }

        let mounted = true

        ajaxHandle({
            url: `get-data/${type}`,
            method: 'POST',
            data: queryUrl,
            success: function (result: ShowDataResultApiProps) {

                if (result.config.redirect) {
                    navigate(result.config.redirect);
                } else {

                    if (result.config && mounted) {
                        result.type = type;

                        result.config.extendedTab = callAddOn('ShowData/Tabs', type, { list: { title: __('List'), priority: 1 } });

                        setData(result);
                        setTitle(result.config?.title);
                        setIsLoadedData(true);
                        let url = replaceUrlParam(window.location.href, queryUrl);
                        window.history.pushState({ url: url, page: 'Page template table' }, "Page template table", url);

                    }
                }
            }
        });

        return () => {
            mounted = false
        }
        //eslint-disable-next-line
    }, [queryUrl]);

    const acctionPost = (payload: JsonFormat, success?: undefined | ((result: JsonFormat) => void)) => {
        ajaxHandle({
            url: `get-data/${type}`,
            method: 'POST',
            data: {
                ...queryUrl,
                ...payload,
            },
            success: function (result: ShowDataResultApiProps) {
                if (result.config) {

                    result.config.extendedTab = callAddOn('ShowData/Tabs', type, {
                        list: { title: __('List'), priority: 1 }
                    });

                    setData(prev => ({ ...prev, ...result }));
                }
                if (success) {
                    success(result);
                }
            }
        });
    };

    const handleSearch = (value: string) => {
        setQueryUrl({
            ...queryUrl,
            search: value
        });
    }

    const ListDataComponent = (
        <Box display="flex">
            <div style={{ width: 255, flexShrink: 0, paddingRight: 24 }}>
                <Button component={Link} to={`/post-type/${type}/new`} variant="contained" size="large" disabled={!permission[type + '_create']} color="primary" style={{ width: '100%', marginBottom: 24 }}>
                    {__('Add new')}
                </Button>
                <FilterTab
                    name={type}
                    acctionPost={acctionPost}
                    queryUrl={queryUrl}
                    data={data}
                    setQueryUrl={setQueryUrl}
                />
            </div>
            <div style={{ width: 'calc(100% - 255px) ' }}>
                <SearchBar
                    value={queryUrl.search}
                    onSearch={handleSearch}
                />
                {data !== false && (
                    <Results
                        data={data}
                        loading={showLoading}
                        queryUrl={queryUrl}
                        setQueryUrl={setQueryUrl}
                        isLoadedData={isLoadedData}
                        postType={type}
                        acctionPost={acctionPost}
                    />
                )}
            </div>
        </Box>
    );

    const redirectTo = getUrlParams(window.location.search, 'redirectTo');

    if (data !== false && data.config?.redirect) {
        return <Navigate to={data.config?.redirect} />
    }

    if (redirectTo === 'edit') {
        return <Navigate to={`/post-type/${type}/edit?post_id=` + getUrlParams(window.location.search, 'post')} />
    }

    return (
        <>
            <Hook
                hook={'PostType/' + toCamelCase(type) + '/ShowData'}
                result={data}
                loading={showLoading}
                queryUrl={queryUrl}
                setQueryUrl={setQueryUrl}
                isLoadedData={isLoadedData}
                postType={type}
                acctionPost={acctionPost}
            />
            {
                Boolean(data && data.config && data.config.extendedTab && Object.keys(data.config.extendedTab).length > 0)
                    ?
                    <Page title={title} width="xl">
                        <Header
                            data={data}
                        />
                        <Tabs
                            name={'show_data_' + type}
                            tabs={
                                (() => {
                                    if (data !== false) {

                                        //eslint-disable-next-line
                                        let result = Object.keys(data.config.extendedTab).map((key: string) => {

                                            if (key === 'list') {
                                                return {
                                                    ...data.config.extendedTab[key],
                                                    title: data.config.extendedTab[key].title ?? __('List'),
                                                    content: () => ListDataComponent
                                                }
                                            }

                                            if (data.config.extendedTab[key].content) {
                                                return {
                                                    ...data.config.extendedTab[key],
                                                    content: () => <Hook
                                                        hook={data.config.extendedTab[key].content}
                                                        result={data}
                                                        loading={showLoading}
                                                        queryUrl={queryUrl}
                                                        setQueryUrl={setQueryUrl}
                                                        isLoadedData={isLoadedData}
                                                        postType={type}
                                                        acctionPost={acctionPost}
                                                    />
                                                }
                                            }

                                            if (data.config.extendedTab[key].component) {
                                                return {
                                                    ...data.config.extendedTab[key],
                                                    content: () => data.config.extendedTab[key].component({
                                                        result: data,
                                                        loading: showLoading,
                                                        queryUrl: queryUrl,
                                                        setQueryUrl: setQueryUrl,
                                                        isLoadedData: isLoadedData,
                                                        postType: type,
                                                        acctionPost: acctionPost,
                                                    })
                                                }
                                            }
                                        });
                                        return result;
                                    }

                                    return [];
                                })()
                            }
                        />
                    </Page>
                    :
                    <SkeletonListData />
            }
        </>
    )
}

function SkeletonListData() {

    return (
        <Page
            title={__('Post Type')}
            width="xl"
        >
            <Box
                sx={{
                    alignItems: "flex-end",
                    justifyContent: "space-between",
                    gap: 32
                }}
                style={{ marginBottom: 8 }}
            >
                <Grid item>
                    <Skeleton width={100} height={13} style={{ transform: 'scale(1, 1)', marginBottom: 8 }} />
                    <Skeleton width={200} height={28} style={{ transform: 'scale(1, 1)', marginBottom: 8 }} />
                </Grid>
            </Box>

            <Box
                sx={{
                    display: "flex",
                    width: 1,
                    gridGap: 32
                }}
                style={{ marginBottom: 10 }}>
                <Skeleton style={{ transform: 'scale(1, 1)' }} width={80} height={22} />
                <Skeleton style={{ transform: 'scale(1, 1)' }} width={80} height={22} />
                <Skeleton style={{ transform: 'scale(1, 1)' }} width={80} height={22} />
            </Box>
            <Divider />
            <Box
                sx={{
                    display: "flex",
                    width: 1,
                    gridGap: 24
                }}
                style={{ marginTop: 16 }}
            >
                <div>
                    <Skeleton style={{ transform: 'scale(1, 1)', marginBottom: 24 }} width={230} height={40} />
                    {
                        [...Array(10)].map((key, index) => (
                            <Skeleton key={index} style={{ transform: 'scale(1, 1)', marginBottom: 12 }} width={230} height={24} />
                        ))
                    }
                </div>
                <div style={{ width: '100%' }}>
                    <Box
                        sx={{
                            display: "flex",
                            width: 1,
                            gridGap: 12
                        }}
                    >
                        <Skeleton style={{ transform: 'scale(1, 1)', marginBottom: 24 }} width={230} height={40} />
                        <Skeleton style={{ transform: 'scale(1, 1)', marginBottom: 24 }} width={120} height={40} />
                    </Box>
                    <div>
                        <Skeleton
                            variant='text'
                            style={{ transform: 'scale(1, 1)', marginBottom: 8 }}
                            width={280}
                            height={18}
                        />
                        <Table style={{ width: '100%' }}>
                            <TableBody>
                                {
                                    [...Array(8)].map((key, index) => (
                                        <TableRow key={index}>
                                            <TableCell>
                                                <Skeleton style={{ transform: 'scale(1, 1)' }} width={48} height={32} />
                                            </TableCell>
                                            <TableCell>
                                                <Skeleton style={{ transform: 'scale(1, 1)' }} width={48} height={32} />
                                            </TableCell>
                                            <TableCell>
                                                <Skeleton style={{ transform: 'scale(1, 1)' }} width={200} height={32} />
                                            </TableCell>
                                            <TableCell>
                                                <Skeleton style={{ transform: 'scale(1, 1)' }} width={200} height={32} />
                                            </TableCell>
                                            <TableCell style={{ width: '100%' }}>
                                                <Skeleton style={{ transform: 'scale(1, 1)' }} width={'100%'} height={32} />
                                            </TableCell>
                                            <TableCell>
                                                <Skeleton style={{ transform: 'scale(1, 1)' }} width={200} height={32} />
                                            </TableCell>
                                            <TableCell>
                                                <Skeleton style={{ transform: 'scale(1, 1)' }} width={200} height={32} />
                                            </TableCell>
                                        </TableRow>
                                    ))
                                }
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </Box>
        </Page >
    );
}

export interface ShowDataResultApiProps {
    type: string,
    config: {
        [key: string]: any,
        redirect: string | null,
        title: string,
        fields: {
            [key: string]: {
                [key: string]: any,
                title: string,
                view: string,
            }
        },
        filters: {
            [key: string]: {
                count: number,
                icon: string,
                key: string,
                title: string,
                color: string,
                where: any,
            },
        },
        label: {
            name: string,
            singularName: string,
            allItems: string,
        },
        public_view: boolean,
        slug: string,
        table: string,
        tabs?: {
            [key: string]: {
                title: string,
                fields: string[]
            },
        },
        extendedTab: JsonFormat
    },
    rows: {
        current_page: number,
        data: JsonFormat[],
        first_page_url: string,
        last_page_url: string,
        next_page_url: null | string,
        prev_page_url: null | string,
        total: number,
        from: number,
        to: number,
        last_page: number,
        path: string,
        per_page: number,
    }
}

export default ShowData
