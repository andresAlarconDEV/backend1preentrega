import multer from "multer";
import path from "path";


const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        const folderPath = path.join(__dirname, '../public/img');

        callback(null, folderPath);
    },
    filename: (req, file, callback) => {
        callback(null, file.originalname);
    },
});

const upload1 = multer({ storage: storage });

export const upload = upload1.single('thumbnail');


