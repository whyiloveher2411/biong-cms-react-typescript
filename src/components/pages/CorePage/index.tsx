import { toCamelCase } from 'helpers/string';
import React from 'react';
import { useParams, Navigate } from 'react-router-dom';

function CorePage() {

    let { page, tab, subtab1, subtab2 } = useParams<{
        page: string,
        tab: string,
        subtab1: string,
        subtab2: string,
    }>();

    if (page) {

        try {
            let pageCompoment = toCamelCase(page);

            try {
                if (tab && subtab1 && subtab2) {
                    let resolved = require('./' + pageCompoment + '/' + toCamelCase(tab) + '/' + toCamelCase(subtab1) + '/' + toCamelCase(subtab2)).default;
                    return React.createElement(resolved, { page: page });
                }
            } catch (error) {

            }

            try {
                if (tab && subtab1) {
                    let resolved = require('./' + pageCompoment + '/' + toCamelCase(tab) + '/' + toCamelCase(subtab1)).default;
                    return React.createElement(resolved, { page: page });
                }
            } catch (error) {

            }

            try {
                if (tab) {
                    let resolved = require('./' + pageCompoment + '/' + toCamelCase(tab)).default;
                    return React.createElement(resolved, { page: page });
                }
            } catch (error) {

            }

            let resolved = require('./' + pageCompoment).default;

            return React.createElement(resolved, { page: page });

        } catch (error) {

        }

        return <Navigate to="/error-404" />

    }

    return <Navigate to="/dashboard" />
}

export default CorePage
