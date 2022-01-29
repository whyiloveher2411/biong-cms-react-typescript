import DialogTitle from 'components/atoms/DialogTitle'
import DialogContentText from 'components/atoms/DialogContentText'
import DialogContent from 'components/atoms/DialogContent'
import DialogActions from 'components/atoms/DialogActions'
import Dialog from 'components/atoms/Dialog'
import Button from 'components/atoms/Button'
import React from 'react'
import { __ } from 'helpers/i18n'

interface ConfirmDialogProp {
    open: boolean,
    onClose: () => void,
    onConfirm: () => void,
    message?: string
}
function ConfirmDialog({ open, onClose, onConfirm, message = __('Are you sure you want to permanently remove this item?') }: ConfirmDialogProp) {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description">
            <DialogTitle id="alert-dialog-title">{__('Confirm Deletion')}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {message}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="inherit" autoFocus>
                    {__('Cancel')}
                </Button>
                <Button onClick={onConfirm} color="primary">
                    {__('OK')}
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default ConfirmDialog
