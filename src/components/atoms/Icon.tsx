import SvgIcon from 'components/atoms/SvgIcon';
import React from 'react'

export type IconFormat = string | {
    custom: string
}

export interface IconProps {
    [key: string]: any,
    icon: IconFormat,
    type?: 'material',
}
export default React.memo(function Icon({ icon, type = 'material', ...rest }: IconProps) {

    if (!icon) {
        return null;
    }

    if (typeof icon === 'object' && icon.custom) {
        return <SvgIcon {...rest}> <svg dangerouslySetInnerHTML={{ __html: icon.custom }
        } /></SvgIcon>
    }

    // try {
    if (type === 'material' && typeof icon === 'string') {
        let resolved = require(`@mui/icons-material/esm/${icon}`).default;
        return React.createElement(resolved, { ...rest });
    }
    // } catch (error) {
    // }

    return null;
}, (props1, props2) => {
    return props1.icon === props2.icon;
})
