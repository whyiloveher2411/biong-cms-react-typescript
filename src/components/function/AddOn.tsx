import React from "react";
import { useSelector } from "react-redux";
import { toCamelCase } from "helpers/string";
import { RootState } from "store/configureStore";

export default function AddOn() {

    const plugins = useSelector((state: RootState) => state.plugins);

    const callAddOn: any = (group: string, subHook: string, resultDefault: JsonFormat | false = false, params: any) => {
        let result: JsonFormat;

        if (resultDefault !== false) {
            result = { ...resultDefault };
        } else {
            result = {};
        }

        let hook = '/AddOn/' + group + '/' + toCamelCase(subHook);

        Object.keys(plugins).forEach((plugin) => {

            if (plugins[plugin].status === 'publish') {
                try {
                    let component = toCamelCase(plugin) + hook;

                    let resolved = require(`./../../plugins/${component}`).default;

                    if (typeof resolved === 'function') {
                        resolved = resolved(params);
                    }

                    Object.keys(resolved).forEach(key => {
                        result[plugin + '_' + key] = { ...resolved[key], priority: resolved[key].priority ?? 100 };
                    });


                } catch (error) {

                }
            }
        });

        let sortable: [string, number][] = [];

        Object.keys(result).forEach(key => {
            sortable.push([key, result[key].priority ?? 99]);
        });

        sortable.sort(function (a, b) {
            return a[1] - b[1];
        });

        let newState: { [key: string]: JsonFormat } = {};

        sortable.forEach(item => {
            newState[item[0]] = result[item[0]];
        });

        return newState;
    };

    React.useEffect(() => { }, []);

    return { callAddOn };

}