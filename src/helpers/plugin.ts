
export function plugins(): { [key: string]: any } {

    if (window.__plugins) return window.__plugins;

    return {};

}