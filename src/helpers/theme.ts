import { IconFormat } from 'components/atoms/Icon';
import { __ } from "./i18n";
import cloneDeep from 'lodash/cloneDeep';
import { colors, Theme } from "@mui/material";

export type keys = 'light' | 'dark';

export interface ThemeMode {
    theme: string,
    color: {
        primary: keyof typeof colors,
        secondary: keyof typeof colors,
    },
}
export const shadeColor: {
    [key: string]: {
        dark: keyof typeof colors["amber"],
        main: keyof typeof colors["amber"],
        light: keyof typeof colors["amber"],
    }
} = {
    primary: {
        dark: 900,
        main: 500,
        light: 100,
    },
    secondary: {
        dark: 900,
        main: 700,
        light: 100,
    }
};

export const colorsSchema: {
    [key: string]: {
        title: keyof typeof colors
    }
} = {
    red: {
        title: 'red',
        // dark: colors.red[shadePrimaryDark],
        // main: colors.red[shadePrimaryMain],
        // light: colors.red[shadePrimaryLight],
    },
    pink: {
        title: 'pink',
        // dark: colors.pink[shadePrimaryDark],
        // main: colors.pink[shadePrimaryMain],
        // light: colors.pink[shadePrimaryLight],
    },
    purple: {
        title: 'purple',
        // dark: colors.purple[shadePrimaryDark],
        // main: colors.purple[shadePrimaryMain],
        // light: colors.purple[shadePrimaryLight],
    },
    deepPurple: {
        title: 'deepPurple',
        // dark: colors.deepPurple[shadePrimaryDark],
        // main: colors.deepPurple[shadePrimaryMain],
        // light: colors.deepPurple[shadePrimaryLight],
    },
    indigo: {
        title: 'indigo',
        // dark: colors.indigo[shadePrimaryDark],
        // main: colors.indigo[shadePrimaryMain],
        // light: colors.indigo[shadePrimaryLight],
    },
    blue: {
        title: 'blue',
        // dark: colors.blue[shadePrimaryDark],
        // main: colors.blue[shadePrimaryMain],
        // light: colors.blue[shadePrimaryLight],
    },
    lightBlue: {
        title: 'lightBlue',
        // dark: colors.lightBlue[shadePrimaryDark],
        // main: colors.lightBlue[shadePrimaryMain],
        // light: colors.lightBlue[shadePrimaryLight],
    },
    cyan: {
        title: 'cyan',
        // dark: colors.cyan[shadePrimaryDark],
        // main: colors.cyan[shadePrimaryMain],
        // light: colors.cyan[shadePrimaryLight],
    },
    teal: {
        title: 'teal',
        // dark: colors.teal[shadePrimaryDark],
        // main: colors.teal[shadePrimaryMain],
        // light: colors.teal[shadePrimaryLight],
    },
    green: {
        title: 'green',
        // dark: colors.green[shadePrimaryDark],
        // main: colors.green[shadePrimaryMain],
        // light: colors.green[shadePrimaryLight],
    },
    lightGreen: {
        title: 'lightGreen',
        // dark: colors.lightGreen[shadePrimaryDark],
        // main: colors.lightGreen[shadePrimaryMain],
        // light: colors.lightGreen[shadePrimaryLight],
    },
    lime: {
        title: 'lime',
        // dark: colors.lime[shadePrimaryDark],
        // main: colors.lime[shadePrimaryMain],
        // light: colors.lime[shadePrimaryLight],
    },
    yellow: {
        title: 'yellow',
        // dark: colors.yellow[shadePrimaryDark],
        // main: colors.yellow[shadePrimaryMain],
        // light: colors.yellow[shadePrimaryLight],
    },
    amber: {
        title: 'amber',
        // dark: colors.amber[shadePrimaryDark],
        // main: colors.amber[shadePrimaryMain],
        // light: colors.amber[shadePrimaryLight],
    },
    orange: {
        title: 'orange',
        // dark: colors.orange[shadePrimaryDark],
        // main: colors.orange[shadePrimaryMain],
        // light: colors.orange[shadePrimaryLight],
    },
    deepOrange: {
        title: 'deepOrange',
        // dark: colors.deepOrange[shadePrimaryDark],
        // main: colors.deepOrange[shadePrimaryMain],
        // light: colors.deepOrange[shadePrimaryLight],
    },
};

export const themes: {
    [key: string]: {
        title: string,
        icon: IconFormat
    }
} = {
    light: {
        title: __('Light'),
        icon: { custom: '<path d="M12 9c1.65 0 3 1.35 3 3s-1.35 3-3 3-3-1.35-3-3 1.35-3 3-3m0-2c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0 .39-.39.39-1.03 0-1.41l-1.06-1.06zm1.06-10.96c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.36c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06z"></path>' },
    },
    dark: {
        title: __('Dark'),
        icon: 'Brightness2Outlined',
    },
};

function getViewModeLocal(): ThemeMode {
    let viewMode: ThemeMode = {
        theme: 'light',
        color: {
            primary: "indigo",
            secondary: "red",
        }
    };

    try {
        let view_mode = localStorage.getItem("view_mode");

        if (typeof view_mode === 'string') {
            viewMode = JSON.parse(view_mode);
        }
    } catch (error) {

    }

    if (viewMode !== null && !viewMode.theme) {
        viewMode = {
            theme: 'light',
            color: {
                primary: "indigo",
                secondary: "red",
            }
        }
    }

    return viewMode;
}

export function getViewMode() {
    let viewMode = getViewModeLocal();
    return getThemeLocal(viewMode);
}

export function changeViewMode(mode: string) {

    let viewMode = getViewModeLocal();

    //need upgrade after
    if (mode !== 'dark' && mode !== 'light') {
        viewMode.theme = 'light';
    } else {
        viewMode.theme = mode;
    }

    localStorage.setItem("view_mode", JSON.stringify(viewMode));

    return getThemeLocal(viewMode);
}

function getThemeLocal(viewMode: ThemeMode) {
    let theme: Theme = cloneDeep(require('./../theme/' + viewMode.theme).default);
    theme.type = viewMode.theme;
    theme.primaryColor = viewMode.color.primary;
    theme.secondaryColor = viewMode.color.secondary;

    if (theme.primaryColor && colors[theme.primaryColor]) {
        theme.palette.primary = {
            ...theme.palette.primary,
            // @ts-ignore: Property does not exist on type
            dark: colors[theme.primaryColor][shadeColor.primary.dark],
            // @ts-ignore: Property does not exist on type
            main: colors[theme.primaryColor][shadeColor.primary.main],
            // @ts-ignore: Property does not exist on type
            light: colors[theme.primaryColor][shadeColor.primary.light],
        };
    } else {
        theme.primaryColor = 'indigo';
    }

    if (theme.secondaryColor && colorsSchema[theme.secondaryColor]) {
        theme.palette.secondary = {
            ...theme.palette.secondary,
            // @ts-ignore: Property does not exist on type
            dark: colors[theme.secondaryColor][shadeColor.secondary.dark],
            // @ts-ignore: Property does not exist on type
            main: colors[theme.secondaryColor][shadeColor.secondary.main],
            // @ts-ignore: Property does not exist on type
            light: colors[theme.secondaryColor][shadeColor.secondary.light],
        };
    } else {
        theme.secondaryColor = 'red';
    }

    return { ...theme };
}

export function changeViewColorPrimary(colorKey: keyof typeof colors) {

    let viewMode = getViewModeLocal();

    if (!colorsSchema[colorKey]) {
        viewMode.color.primary = 'indigo';
    } else {
        viewMode.color.primary = colorKey;
    }

    localStorage.setItem("view_mode", JSON.stringify(viewMode));

    return getThemeLocal(viewMode);
}

export function changeViewColorSecondary(colorKey: keyof typeof colors) {

    let viewMode = getViewModeLocal();

    if (!colorsSchema[colorKey]) {
        viewMode.color.secondary = 'indigo';
    } else {
        viewMode.color.secondary = colorKey;
    }

    localStorage.setItem("view_mode", JSON.stringify(viewMode));

    return getThemeLocal(viewMode);
}

