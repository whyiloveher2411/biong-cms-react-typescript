import React from 'react'
import OutlinedInput from 'components/atoms/OutlinedInput';
import InputLabel from 'components/atoms/InputLabel';
import FormHelperText from 'components/atoms/FormHelperText';
import FormControl from 'components/atoms/FormControl';
import { FieldFormItemProps } from '../type';
import { makeStyles } from '@mui/styles';
import { TextareaAutosize } from '@mui/material';


const useStyles = makeStyles({
    editor: {
        '&>.MuiInputLabel-outlined.MuiInputLabel-shrink': {
            transform: 'translate(14px, -11px) scale(0.75)'
        },
        '&>.MuiInputBase-root>textarea, &>label': {
            lineHeight: 2.2
        },
        lineHeight: '24px',
    },
})


export default React.memo(function TextareaForm(props: FieldFormItemProps) {

    const { config, post, name, onReview } = props;
    const classes = useStyles()

    const valueInital = post && post[name] ? post[name] : '';
    const [, setRender] = React.useState(0);

    console.log('render TEXTAREA');

    return (

        <FormControl fullWidth variant="outlined">
            {
                Boolean(config.title) ?
                    <>
                        <InputLabel {...config.labelProps}>{config.title}</InputLabel>
                        <OutlinedInput
                            type='textarea'
                            name={name}
                            rows={config.rows ?? 1}
                            multiline
                            value={valueInital}
                            className={classes.editor}
                            label={config.title}
                            onBlur={e => { onReview(e.target.value, name); setRender(prev => prev + 1); }}
                            onChange={e => { setRender(prev => prev + 1); post[name] = e.target.value }}
                            inputComponent={TextareaAutosize}
                            {...config.inputProps}
                        />
                    </>
                    :
                    <OutlinedInput
                        type='textarea'
                        name={name}
                        rows={config.rows ?? 1}
                        multiline
                        value={valueInital}
                        className={classes.editor}
                        onBlur={e => { onReview(e.target.value, name); setRender(prev => prev + 1); }}
                        onChange={e => { setRender(prev => prev + 1); post[name] = e.target.value }}
                        inputComponent={TextareaAutosize}
                        {...config.inputProps}
                    />
            }

            {

                config.maxLength ?
                    <FormHelperText style={{ display: 'flex', justifyContent: 'space-between' }} >
                        {Boolean(config.note) && <span dangerouslySetInnerHTML={{ __html: config.note }}></span>}
                        <span style={{ marginLeft: 24, whiteSpace: 'nowrap' }}>{valueInital.length + '/' + config.maxLength}</span>
                    </FormHelperText>
                    :
                    config.note ?
                        <FormHelperText><span dangerouslySetInnerHTML={{ __html: config.note }}></span></FormHelperText>
                        : null
            }
        </FormControl>
    )
}, (props1, props2) => {

    if (props1.forceUpdate) {
        return false;
    }

    return props1.post[props1.name] === props2.post[props2.name];
})


