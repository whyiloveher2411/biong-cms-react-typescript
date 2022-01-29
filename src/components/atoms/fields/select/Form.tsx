import Typography from 'components/atoms/Typography';
import TextField from 'components/atoms/TextField';
import FormHelperText from 'components/atoms/FormHelperText';
import FormControl from 'components/atoms/FormControl';
import Alert from 'components/atoms/Alert';
import Autocomplete from 'components/atoms/Autocomplete';
import React from 'react';
import { FieldFormItemProps } from '../type';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
    selectItem: {
        whiteSpace: 'unset'
    },
    pointSelect: {
        display: 'inline-block',
        width: 8,
        height: 8,
        borderRadius: '50%',
        backgroundColor: 'var(--bg)',
        marginRight: 8,
    }
})

interface Option {
    title: string,
    _key: string,
    color?: string,
    description?: string,
}

export default React.memo(function SelectForm({ config, post, onReview, name, ...rest }: FieldFormItemProps) {

    const [, setRender] = React.useState(0);

    const [listOption, setListOption] = React.useState<{

    }[]>([]);

    React.useEffect(() => {

        if (config.list_option) {
            setListOption(config.list_option ?
                Object.keys(config.list_option).map((key) => ({ ...config.list_option[key], _key: key }))
                :
                []);
        }

    }, [config.list_option]);

    const classes = useStyles();

    let valueInital: { [key: string]: string } = { _key: '__', title: '' };

    if (post && post[name] && config.list_option && config.list_option[post[name]]) {
        valueInital = { ...config.list_option[post[name]], _key: post[name] };
    } else if (config.defaultValue) {
        valueInital = { ...config.list_option[config.defaultValue], _key: config.defaultValue };
        post[name] = config.defaultValue;
    } else {
        valueInital = { _key: '__', title: '' };
    }

    const onChange = (_e: React.ChangeEvent, value: Option) => {

        if (value) {
            post[name] = value._key;
        } else {
            post[name] = config.defaultValue ? config.defaultValue : '';
        }

        onReview(post[name], name);
        setRender(prev => prev + 1);

    }

    return (
        <FormControl fullWidth variant="outlined">
            <Autocomplete
                options={listOption}
                getOptionLabel={(option: Option) => option.title ? option.title : ''}
                disableClearable={config.disableClearable ? Boolean(config.disableClearable) : false}
                size={config.size ?? 'medium'}
                renderInput={(params) => {
                    if (typeof valueInital.color === 'string') {
                        params.InputProps.startAdornment = <span
                            className={classes.pointSelect}
                            style={{ ['--bg' as string]: valueInital.color, marginLeft: 8 }}
                        >

                        </span>;
                    }
                    return <>
                        <TextField
                            {...params}
                            label={config.title}
                            variant="outlined"
                        />
                        {
                            Boolean(config.note) &&
                            <FormHelperText ><span dangerouslySetInnerHTML={{ __html: config.note }}></span></FormHelperText>
                        }
                        {
                            Boolean(valueInital && valueInital.description && !config.disableAlert) &&
                            <Alert icon={false} severity="info">
                                <Typography variant="body2">{valueInital.description}</Typography>
                            </Alert>
                        }
                    </>
                }}
                onChange={onChange}
                value={valueInital}
                isOptionEqualToValue={(option: Option, value: Option) => option._key === value._key}
                renderOption={(props, option: Option) => (
                    <li {...props} key={option._key}>
                        <div className={classes.selectItem}>
                            {
                                Boolean(option.color) &&
                                <Typography style={{ ['--bg' as string]: option.color }} component="span" className={classes.pointSelect} ></Typography>
                            }
                            {option.title}
                            {
                                Boolean(option.description) &&
                                <Typography variant="body2">{option.description}</Typography>
                            }
                        </div>
                    </li>
                )}
                {...config.inputProps}
            />
        </FormControl>

    );

}, (props1, props2) => {

    if (props1.forceUpdate) {
        return false;
    }

    return props1.post[props1.name] === props2.post[props2.name] && JSON.stringify(props1.config.list_option) === JSON.stringify(props2.config.list_option);
})

