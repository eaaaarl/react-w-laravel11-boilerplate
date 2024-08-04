export const getImageURL = (image: any) => {
    if (!image) return "";
    if (typeof image === "string") {
        return `http://127.0.0.1:8000/storage/images/${image}`;
    } else if (image instanceof File) {
        return URL.createObjectURL(image);
    }
};
