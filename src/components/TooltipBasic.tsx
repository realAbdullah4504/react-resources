import React, { useState } from 'react';
import { Tooltip } from 'reactstrap';

const TooltipBasic = ({
    children,
    id = "DisabledAutoHideExample"

}) => {
    const [tooltipOpen, setTooltipOpen] = useState(false);

    const toggle = () => setTooltipOpen(!tooltipOpen);

    return (
        <div>
            <span
                id={id}
            >

                {children}
            </span>
            <Tooltip
                placement="top"
                isOpen={tooltipOpen}
                autohide={false}
                target={id}
                toggle={toggle}
            >
                {children}
            </Tooltip>
        </div>
    );
}

export default TooltipBasic;