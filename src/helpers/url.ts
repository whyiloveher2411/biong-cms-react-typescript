
type URL = string;

export function replaceUrlParam(url: URL, params: { [key: string]: string }): URL {

    for (let paramName in params) {
        let pattern = new RegExp('\\b(' + paramName + '=).*?(&|$)');

        if (url.search(pattern) >= 0) {
            url = url.replace(pattern, '$1' + params[paramName] + '$2');
        } else {
            url = url + (url.indexOf('?') > 0 ? '&' : '?') + paramName + '=' + params[paramName];
        }

    }

    return url;
}

export function getUrlParams(
    url: URL,
    param?: null | string | { [key: string]: any }
): null | string | { [key: string]: any } {

    let urlSearch = new URLSearchParams(url);

    let result: { [key: string]: any } = {};

    if (param) {

        if (typeof param == 'string') {
            return urlSearch.get(param);
        }

        for (let i in param) {

            result[i] = urlSearch.get(param[i]);
        }
    }

    urlSearch.forEach((value, key) => {
        result[key] = value;
    });

    return result;
}


export function validURL(str: URL): boolean {

    let url;

    try {
        url = new URL(str);
    } catch (_) {
        return false;
    }

    return url.protocol === "http:" || url.protocol === "https:";

}