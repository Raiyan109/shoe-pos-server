import {
    DeleteObjectCommand,
    ObjectCannedACL,
    PutObjectCommand,
    S3Client,
} from "@aws-sdk/client-s3";
import multer from "multer";
import * as fs from "fs";
import path from "path";
// import uuid from 'uuid'
import { v4 as uuidv4 } from 'uuid';
// const path = require("path");
// const uuid = require("uuid");

// Set up AWS configuration
const region = "ap-south-1";
const endpoint = "https://blr1.digitaloceanspaces.com";
const s3 = new S3Client({
    region,
    endpoint,
    credentials: {
        accessKeyId: "DO003NGNH3Z8U72AGPHW",
        secretAccessKey: "y05jtj5lb1CGu9XxZMCYVggZSTNhaQuukluw+AuCuME",
    },
});

const SpaceName = "cit-node";

const storage = multer.diskStorage({
    destination: "uploads/",
    filename: function (req, file, cb) {
        const uniqueSuffix = uuidv4();
        // const uniqueSuffix = uuid.v4();
        cb(null, uniqueSuffix + "-" + file.originalname);
    },
});

const ImageUpload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        const supportedImage =
            /png|jpg|webp|jpeg|gif|PNG|JPG|WEBP|JPEG|GIF|pdf|PDF/; // Added gif and GIF
        const extension = path.extname(file.originalname);

        if (supportedImage.test(extension)) {
            cb(null, true);
        } else {
            cb(new Error("Must be a png|jpg|webp|jpeg|gif image"));
        }
    },
    limits: {
        fileSize: 10000000, // 10MB limit
    },
});

// Function to determine content type based on file extension
const getContentType = (filename: string) => {
    const extension = path.extname(filename).toLowerCase();
    switch (extension) {
        case ".webp":
            return "image/webp";
        case ".png":
            return "image/png";
        case ".jpg":
            return "image/jpg";
        case ".jpeg":
            return "image/jpeg";
        case ".gif":
            return "image/gif";
        case ".WEBP":
            return "image/WEBP";
        case ".PNG":
            return "image/PNG";
        case ".JPG":
            return "image/JPG";
        case ".JPEG":
            return "image/JPEG";
        case ".GIF":
            return "image/GIF";
        case ".pdf":
            return "application/pdf";
        case ".PDF":
            return "application/PDF";
        default:
            return "application/octet-stream";
    }
};

// Upload image to DigitalOcean Spaces
const uploadToSpaces = async (file: any) => {
    console.log(file, 'file from upload to spaces');

    const fileStream = fs.createReadStream(file.path);
    const contentType = getContentType(file.filename);

    const uploadParams = {
        Bucket: SpaceName,
        Key: `shoe-pos/${file.filename}`,
        Body: fileStream,
        ACL: "public-read" as ObjectCannedACL,
        ContentType: contentType,
    };

    try {
        const data = await s3.send(new PutObjectCommand(uploadParams));
        const httpStatusCode = data?.$metadata?.httpStatusCode;
        const { Bucket, Key } = uploadParams;
        const Location = `https://cit-node.blr1.cdn.digitaloceanspaces.com/${Key}`;
        const sendData = {
            Location,
            Key,
        };
        // Normalize the file path to ensure cross-platform compatibility
        const normalizedPath = path.normalize(file.path);
        fs.unlinkSync(normalizedPath);
        if (httpStatusCode == 200) return sendData;
        else return null;
    } catch (error) {
        throw error;
    }
};

const deleteFromSpaces = async (key: any) => {
    const deleteParams = {
        Bucket: SpaceName,
        Key: key,
    };

    try {
        const data = await s3.send(new DeleteObjectCommand(deleteParams));
        const httpStatusCode = data?.$metadata?.httpStatusCode;
        if (httpStatusCode == 204) return true;
        else return null;
    } catch (error) {
        throw error;
    }
};


export const FileUploadHelper = {
    ImageUpload,
    uploadToSpaces,
    deleteFromSpaces,
};