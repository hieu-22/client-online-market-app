export const copyToClipboard = (copiedText) => {
    navigator.clipboard.writeText(copiedText)
    //   .then(() => {
    //     console.log('URL copied to clipboard:', url);
    //   })
    //   .catch((error) => {
    //     console.error('Failed to copy URL to clipboard:', error);
    //   });
}
