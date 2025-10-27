import React, { useEffect, useState } from 'react';
import { Box, Snackbar, IconButton, Typography } from '@mui/material';
import { CheckCircle, Error, Warning, Close } from '@mui/icons-material';


const AlertMessage = ({ message, type, timeout = 2, onClose }) => {
    console.log("AlertMessage")
    const [open, setOpen] = useState(false);
    const timeoutInMilliseconds = timeout * 1000;

    useEffect(() => {
        if (message) setOpen(true);
    }, [message]);

    const handleClose = () => {
        setOpen(false);
        if (onClose) onClose(); // Inform the context to clear the alert
    };

    const icons = {
        success: <CheckCircle color="success" />,
        error: <Error color="error" />,
        warning: <Warning color="warning" />,
    };


    return (
        <Snackbar
            open={open}
            autoHideDuration={timeoutInMilliseconds}
            onClose={handleClose}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            sx={{
                '& .MuiSnackbarContent-root': {
                    color:
                        type === 'success' ? '#1B5E20' : type === 'warning' ? '#E65100' : '#B71C1C',
                    backgroundColor:
                        type === 'success' ? '#C8E6C9' : type === 'warning' ? '#FFE0B2' : '#FFCDD2',
                    borderRadius: '8px',
                    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.2)',
                    padding: '10px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    minWidth: '300px',
                    maxWidth: '600px',
                    fontSize: '16px',
                },
            }}
            message={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {icons[type]} <Typography sx={{ ml: 1, fontSize: '14px' }}>{message}</Typography>
                </Box>
            }
            action={
                <IconButton onClick={handleClose} color="inherit" size="small">
                    <Close fontSize="small" />
                </IconButton>
            }
        />
    );
};


export default AlertMessage;
