import React from 'react';
import { default as MuiTooltip } from "@mui/material/Tooltip";
import { TooltipProps as MuiTooltipProps } from "@mui/material/Tooltip"

interface TooltipProps extends MuiTooltipProps {

}

function Tooltip({ disableInteractive = true, arrow = true, ...rest }: TooltipProps) {
    return <MuiTooltip disableInteractive={disableInteractive} arrow={arrow} {...rest} />;
}

export default Tooltip;
