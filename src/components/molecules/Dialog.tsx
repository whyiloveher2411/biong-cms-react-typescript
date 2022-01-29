import DialogTitle from 'components/atoms/DialogTitle';
import DialogContentText from 'components/atoms/DialogContentText';
import DialogContent from 'components/atoms/DialogContent';
import { default as AtomsDialog } from 'components/atoms/Dialog';
import DialogActions from 'components/atoms/DialogActions';
import React from 'react';

interface DialogProps {
    [key: string]: any,
    title: string,
    open: boolean,
    onClose: () => void,
    children: React.ReactNode,
    action?: React.ReactNode,
    style?: { [key: string]: any },
}

function Dialog({ title, action, open, onClose, children, style, ...rest }: DialogProps) {

    return (
        <AtomsDialog
            open={open}
            onClose={onClose}
            scroll='paper'
            aria-labelledby="scroll-dialog-title"
            aria-describedby="scroll-dialog-description"
            fullWidth
            {...rest}
        >
            <DialogTitle style={{ fontSize: 22, background: '#455a64', color: 'white' }}>{title}</DialogTitle>
            <DialogContent dividers={true} className="custom_scroll" style={style ?? {}}>
                <DialogContentText
                    component="div"
                    style={{ margin: 0 }}
                >
                    {children}
                </DialogContentText>
            </DialogContent>
            {
                Boolean(action) &&
                <DialogActions>
                    {action}
                </DialogActions>
            }

        </AtomsDialog>
    )
}

export default Dialog
