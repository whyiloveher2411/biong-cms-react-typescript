import palette from '../palette'

export default {
    styleOverrides: {
        root: {
            color: palette.icon,
            '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.03)',
            },
            '&.Mui-disabled': {
                color: 'rgba(255, 255, 255, 0.3)',
                backgroundColor: 'transparent',
            }
        },

    }
}
