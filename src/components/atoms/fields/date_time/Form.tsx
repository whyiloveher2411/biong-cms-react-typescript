import AdapterMoment from '@mui/lab/AdapterMoment';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import MobileDateTimePicker from '@mui/lab/MobileDateTimePicker';
import FormControl from 'components/atoms/FormControl';
import FormHelperText from 'components/atoms/FormHelperText';
import TextField from 'components/atoms/TextField';
import { dateTimeFormat } from 'helpers/date';
import React from 'react';
import { FieldFormItemProps } from '../type';

export default React.memo(function DateTimeForm({ config, post, onReview, name, ...rest }: FieldFormItemProps) {

    let valueInital = (post && post[name]) ? (post[name] instanceof Date ? post[name] : new Date(post[name])) : new Date;

    const [openDataPicker, setOpenDataPicker] = React.useState(rest.open);
    const [render, setRender] = React.useState(0);

    const onChange = (value: any) => {
        let valueTemp = dateTimeFormat(value);
        post[name] = valueTemp;
        onReview(valueTemp, name);
        setRender(prev => prev + 1);
    };

    console.log('render DATETIME');

    return (
        <FormControl fullWidth variant="outlined">
            <LocalizationProvider dateAdapter={AdapterMoment}>
                <MobileDateTimePicker
                    clearable
                    ampm={true}
                    value={valueInital}
                    label={config.title}
                    renderInput={(params) => <TextField onClick={() => setOpenDataPicker(true)} variant="outlined" {...params} />}
                    open={openDataPicker}
                    InputAdornmentProps={{ position: "end" }}
                    onAccept={onChange}
                    onChange={d => { }}
                    onClose={() => { setOpenDataPicker(true) }}
                    {...rest}
                />
            </LocalizationProvider>
            <FormHelperText><span dangerouslySetInnerHTML={{ __html: config.note }}></span></FormHelperText>
        </FormControl>
    )

}, (props1, props2) => {

    if (props1.post[props1.name] === props2.post[props2.name]) {

        if (props1.open === props2.open) {
            return true;
        }

    }

    return false;
})

