import Typography from 'components/atoms/Typography'
import React, { useEffect, useState } from 'react'
import { __ } from 'helpers/i18n'
import PageHeaderSticky from 'components/templates/PageHeaderSticky'
import Markdown from 'components/atoms/Markdown'
import useAjax from 'hook/useApi'

const GettingStarted = () => {

    const [source, setSource] = useState('')

    const useAjax1 = useAjax();

    useEffect(() => {

        useAjax1.ajax({
            url: 'docs/getting-started',
            success: (result: { text?: string }) => {
                if (result.text) {
                    setSource(result.text)
                }
            }
        });

    }, []);

    return (
        <PageHeaderSticky
            title={__('Getting Started')}
            header={
                <>
                    <Typography gutterBottom variant="overline">
                        {__('Development')}
                    </Typography>
                    <Typography variant="h3">{__('Getting Started')}</Typography>
                </>
            }
        >
            {source && (
                <Markdown components={{ a: LinkRenderer }} skipHtml={true} escapeHtml={false}>
                    {source}
                </Markdown>
            )}
            {useAjax1.Loading}
        </PageHeaderSticky>
    )
}

function LinkRenderer(props: any) {
    return (
        <a href={props.href} target="_blank" rel="noreferrer">
            {props.children}
        </a>
    );
}

export default GettingStarted
