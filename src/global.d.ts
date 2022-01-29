import { colors } from "@mui/material";

export { };

declare global {
    interface Window {
        [key: string]: any,
        __plugins: object,
        __afterLogin: {
            [key: string]: any
        }
    }
}

declare global {
    interface JsonFormat {
        [key: string]: string | number | boolean | null | JsonFormat | any
    }
}

declare module "@mui/material/styles/createTheme" {
    interface Theme {
        type: string,
        primaryColor: keyof typeof colors,
        secondaryColor: keyof typeof colors,
    }

    interface ThemeOptions {
        type?: string
        primaryColor?: keyof typeof colors,
        secondaryColor?: keyof typeof colors,
    }
}
declare module "@mui/material/styles/createPalette" {
    interface Palette {
        header: {
            background: string
        };
        body: {
            background: string
        },
        menu: {
            background: string
        },
        backgroundSelected: string,
        fileSelected: string,
        fileDropSelected: stirng,
        link: string,
        dividerDark: string,
        icon: string,
    }

    interface PaletteOptions {
        header?: {
            background: string
        };
        body?: {
            background: string
        },
        menu?: {
            background: string
        },
        backgroundSelected?: string,
        fileSelected?: string,
        fileDropSelected?: stirng,
        link?: string,
        dividerDark?: string,
        icon?: string,
    }
}