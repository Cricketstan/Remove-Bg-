// Simple background removal using canvas (works best with solid color backgrounds)
export async function removeBackground(imageData) {
    return new Promise((resolve) => {
        const canvas = new OffscreenCanvas(imageData.width, imageData.height);
        const ctx = canvas.getContext('2d');
        
        ctx.putImageData(imageData, 0, 0);
        
        // Get image data
        const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = pixels.data;
        
        // Simple background removal (white background)
        for (let i = 0; i < data.length; i += 4) {
            // If pixel is nearly white (adjust threshold as needed)
            if (data[i] > 200 && data[i+1] > 200 && data[i+2] > 200) {
                data[i+3] = 0; // Set alpha to transparent
            }
        }
        
        ctx.putImageData(pixels, 0, 0);
        canvas.convertToBlob({ type: 'image/png' }).then(resolve);
    });
}
