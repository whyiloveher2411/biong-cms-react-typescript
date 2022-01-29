import { Theme } from '@mui/material'
import Box from 'components/atoms/Box'
import Icon from 'components/atoms/Icon'
import IconButton from 'components/atoms/IconButton'
import makeCSS from 'components/atoms/makeCSS'
import Tooltip from 'components/atoms/Tooltip'
import Typography from 'components/atoms/Typography'
import { addClasses } from 'helpers/dom'
import { __ } from 'helpers/i18n'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ShowDataResultApiProps } from '.'


const useStyles = makeCSS((theme: Theme) => ({
    root: {
        marginBottom: theme.spacing(3)
    },
}))

const Header = ({ data, className, ...rest }: { [key: string]: any, data: false | ShowDataResultApiProps }) => {

    const classes = useStyles();

    const navigate = useNavigate();

    if (data !== false) {
        return (
            <div
                {...rest}
                className={addClasses({
                    [classes.root]: true,
                    [className]: true
                })}>

                {
                    Boolean(data.config.admin?.back_link) ?
                        <Typography variant="h2" style={{ fontWeight: 'normal' }} color="initial">
                            <Box display="flex" alignItems="center">
                                <Tooltip title={__('Back')} aria-label="back">
                                    <IconButton onClick={() => navigate(data.config.admin?.back_link)} >
                                        <Icon icon="ArrowBackOutlined" />
                                    </IconButton>
                                </Tooltip>
                                &nbsp;  {data.config.label.name}
                            </Box>
                        </Typography>
                        :
                        <>
                            <Typography component="h2" gutterBottom variant="overline">
                                {__('Content')}
                            </Typography>
                            <Typography component="h1" variant="h3">
                                {data.config.label.name ?? '...'}
                            </Typography>
                        </>
                }
            </div >
        )
    }

    return null;
}

export default Header
