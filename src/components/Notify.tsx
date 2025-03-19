import React from 'react';
import { Button } from 'reactstrap';
import { Toaster, toast } from 'react-hot-toast';

const Notify = ({
    message = 'Success! This is a success message.',
    type = 'success'
}) => {
    const handleSuccessToast = () => {
        toast.success(message);
    };

    const handleErrorToast = () => {
        toast.error(message);
    };

    // const handleAsyncOperation = async () => {
    //     try {
    //         toast.promise(
    //             simulateAsyncOperation(),
    //             {
    //                 loading: 'Loading...',
    //                 success: 'Async operation completed successfully!',
    //                 error: 'Oops, something went wrong.',
    //             },
    //             {
    //                 style: {
    //                     minWidth: '250px',
    //                 },
    //             }
    //         );
    //     } catch (error) {
    //         console.error('Async operation error:', error);
    //     }
    // }

    // const simulateAsyncOperation = () => {
    //     return new Promise((resolve, reject) => {
    //         setTimeout(() => {
    //             const randomValue = Math.random();
    //             if (randomValue < 0.7) {
    //                 resolve(); // Simulate a successful async operation
    //             } else {
    //                 reject(); // Simulate an error in async operation
    //             }
    //         }, 2000);
    //     });
    // };












    return (
        <div>
            <Toaster position="top-right" />
            {/* <Button color="primary" 
            // onClick={handleAsyncOperation}
            >
                Perform Async Operation
            </Button>
            <Button onClick={type === 'success' ? handleSuccessToast : handleErrorToast}>
                Show Error Toast
            </Button> */}
        </div>
    );
};

export default Notify;