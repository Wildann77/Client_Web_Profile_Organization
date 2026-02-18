import imageCompression from 'browser-image-compression';

export const compressImage = async (file: File): Promise<File> => {
    const options = {
        maxSizeMB: 1, // Max size 1MB
        maxWidthOrHeight: 1920, // Max dimensions 1920px
        useWebWorker: true,
    };

    try {
        const compressedFile = await imageCompression(file, options);
        // Return the compressed file as a File object (preserving the original name)
        return new File([compressedFile], file.name, {
            type: file.type,
            lastModified: Date.now(),
        });
    } catch (error) {
        console.error('Image compression failed:', error);
        // If compression fails, return the original file as fallback
        return file;
    }
};
