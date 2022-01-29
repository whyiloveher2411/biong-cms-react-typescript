import { colors } from "@mui/material";

export default {
    styleOverrides: {
        root: {
            backgroundColor: '#616161',
        },
        deletable: {
            '&:focus': {
                backgroundColor: colors.blueGrey[300],
            },
        },
        deleteIcon: {
            color: 'inherit',
            '&:hover': {
                color: 'initial'
            }
        }
    }
}
