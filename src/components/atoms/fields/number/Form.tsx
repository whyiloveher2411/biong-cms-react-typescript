import OutlinedInput from 'components/atoms/OutlinedInput';
import InputLabel from 'components/atoms/InputLabel';
import FormHelperText from 'components/atoms/FormHelperText';
import FormControl from 'components/atoms/FormControl';
import React from 'react';
import { FieldFormItemProps } from '../type';

export default React.memo(function NumberForm({ config, post, onReview, name, ...rest }: FieldFormItemProps) {

    let valueInital = (post[name] && post[name] !== null && !isNaN(post[name])) ? Number((parseFloat(post[name])).toFixed(6)) : '';

    const [value, setValue] = React.useState(0);

    return (
        <FormControl size={config.size ?? 'medium'} fullWidth variant="outlined">
            {
                Boolean(config.title) ?
                    <>
                        <InputLabel {...config.labelProps}>{config.title}</InputLabel>
                        <OutlinedInput
                            type='number'
                            variant="outlined"
                            name={name}
                            value={valueInital}
                            label={config.title}
                            onBlur={e => { onReview(e.target.value, name) }}
                            onChange={e => { setValue(value + 1); post[name] = e.target.value }}
                            onWheel={(e: React.WheelEvent<HTMLInputElement>) => (e.target as HTMLElement).blur()}
                            {...config.inputProps}
                        />
                    </>
                    :
                    <OutlinedInput
                        type='number'
                        variant="outlined"
                        name={name}
                        value={valueInital}
                        onBlur={e => { onReview(e.target.value, name) }}
                        onChange={e => { setValue(value + 1); post[name] = e.target.value }}
                        onWheel={(e: React.WheelEvent<HTMLInputElement>) => (e.target as HTMLElement).blur()}
                        {...config.inputProps}
                    />
            }
            {
                Boolean(config.note) &&
                <FormHelperText ><span dangerouslySetInnerHTML={{ __html: config.note }}></span></FormHelperText>
            }
        </FormControl>
    )
}, (props1, props2) => {
    return !props1.config.forceRender && props1.post[props1.name] === props2.post[props2.name];
})

