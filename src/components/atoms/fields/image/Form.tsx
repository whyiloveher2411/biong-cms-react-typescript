import React from 'react';
import { FieldFormItemProps } from '../type';
import MultiChoose from './MultiChoose';
import OnlyOneChoose from './OnlyOneChoose';

export default function ImageForm(props: FieldFormItemProps) {

    const { config } = props;

    const [times, setTimes] = React.useState(0);

    const onReview = (value: JsonFormat) => {
        if (times > 0) {
            props.onReview(value);
        }
        setTimes(prev => prev + 1);
    }

    if (config.multiple) {
        if (times % 2 === 0) {
            return <div><MultiChoose {...props} onReview={onReview} times={times} /></div>
        } else {
            return <MultiChoose {...props} onReview={onReview} times={times} />
        }
    }

    return <OnlyOneChoose {...props} />
}