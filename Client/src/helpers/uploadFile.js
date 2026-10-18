const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

const url = `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`;

const uploadFile = async (file) => {
    if (!file) {
        throw new Error("Please select a file to upload.");
    }

    if (!cloudName) {
        throw new Error("Cloudinary cloud name is missing. Check your .env file.");
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "chat-app-file");

    const response = await fetch(url, {
        method: "POST",
        body: formData
    });

    const responseData = await response.json();

    if (!response.ok) {
        throw new Error(
            responseData.error?.message || "Cloudinary upload failed."
        );
    }

    return responseData;
};

export default uploadFile;
