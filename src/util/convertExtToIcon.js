const icons = {
    "pdf": "mdi-file-pdf-box",
    "doc": "mdi-file-word",
    "docx": "mdi-file-word",
    "xls": "mdi-file-excel",
    "xlsx": "mdi-file-excel",
    "png": "mdi-file-image-outline",
    "gif": "mdi-file-image-outline",
    "jpg": "mdi-file-image-outline",
    "jpeg": "mdi-file-image-outline",
    "bmp": "mdi-file-image-outline",
    "ppt": "mdi-file-powerpoint",
    "pptx": "mdi-file-powerpoint",
    "zip": "mdi-folder-zip-outline",
};

const convertExtToIcon = (path) => {
    const parts = path.split(".");
    const lastPart = parts[ parts.length - 1 ].toLowerCase();
    console.log(lastPart);
    return icons[lastPart] ? icons[lastPart] : "mdi-file";
}

export default convertExtToIcon;
