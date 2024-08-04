import mongoose from "mongoose";

const Schema = mongoose.Schema;

const FileSchema = new Schema({
    filename: String,
    contentType: String,
    uploadDate: Date,
    metadata: {
        municipality: String,
        mapType: String,
        dataType: String,
    },
});

const FileModel = mongoose.model('File', FileSchema, 'maps.files');

export default FileModel;