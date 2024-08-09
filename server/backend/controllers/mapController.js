import Grid from 'gridfs-stream';
import asyncHandler from 'express-async-handler';
import mongoose from 'mongoose';

const conn = mongoose.connection;

let gfsb, gfs;

conn.once('open', () => {
  gfsb = new mongoose.mongo.GridFSBucket(conn.db, { bucketName: "maps" });
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection("maps");
  console.log('Grid connected get maps')
  // app.listen(port, () => console.log(`Server started on port ${port}, MongoDB: ${conn.host}`));
})

const getMaps = asyncHandler ( async (req, res) => {
  const { municipality, mapType, dataType} = req.params;
  const query = {
      'metadata.municipality': municipality,
      'metadata.mapType': mapType,
      'metadata.dataType': dataType,
  };

  try {
    const file = await gfs.files.findOne(query);
    // const file = await gfs.files.findOne({ filename: req.params.filename });

    if (!file || file.length === 0) {
      return res.status(404).json({
        err: 'No file exists'
      });
    }

    if (file.contentType === 'image/jpeg' || file.contentType === 'image/png') {
      const readstream = gfsb.openDownloadStreamByName(file.filename);
      readstream.pipe(res);
    } else {
      res.status(404).json({
        err: 'Not an image'
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({
      err: 'Internal Server Error'
    });
  }
});

const getMetadata = asyncHandler ( async (req, res) => {
  const { municipality, mapType, dataType} = req.params;
  const query = {
      'metadata.municipality': municipality,
      'metadata.mapType': mapType,
      'metadata.dataType': dataType,
  };

  try {
    const file = await gfs.files.findOne(query);

    if (!file || file.length === 0) {
      return res.status(404).json({
        err: 'No file exists'
      });
    }

    const metadata = file.metadata || {};
    res.json(metadata);

  } catch (err) {
    console.error(err);
    res.status(500).json({
      err: 'Internal Server Error'
    });
  }
});

export { getMaps, getMetadata };