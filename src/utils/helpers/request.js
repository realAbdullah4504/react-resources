export const simulateAsyncOperation = () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const randomValue = Math.random();
            if (randomValue < 0.7) {
                resolve('Success! This is a success message.'); // Simulate a successful async operation
            } else {
                reject('Error! This is a error message.'); // Simulate an error in async operation
            }
        }, 2000);
    });
};