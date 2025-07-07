import { removeBackground } from './remove-bg';

export default {
    async fetch(request) {
        if (request.method !== 'POST') {
            return new Response('Method not allowed', { status: 405 });
        }

        try {
            const formData = await request.formData();
            const imageFile = formData.get('image');
            
            if (!imageFile || !imageFile.type.startsWith('image/')) {
                return new Response('Invalid image file', { status: 400 });
            }

            // Convert to ImageData
            const imageBitmap = await createImageBitmap(imageFile);
            const canvas = new OffscreenCanvas(imageBitmap.width, imageBitmap.height);
            const ctx = canvas.getContext('2d');
            ctx.drawImage(imageBitmap, 0, 0);
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

            // Process image
            const processedBlob = await removeBackground(imageData);

            return new Response(processedBlob, {
                headers: {
                    'Content-Type': 'image/png',
                    'Content-Disposition': 'attachment; filename="no-bg.png"'
                }
            });
        } catch (error) {
            return new Response(`Error: ${error.message}`, { status: 500 });
        }
    }
};
