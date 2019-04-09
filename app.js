'use strict';

const http = require('http');
const fs = require('fs');

const express = require('express');
// const multer = require('multer');
const csv = require('fast-csv');
const routes = require('./tmp/routes/userupload');


// const upload = multer({ storeg: multer.memoryStorage });
const app = express();
app.use(routes);
// const router = new Router();
const server = http.createServer(app);
const port = 7000
// console.log("hello");

// router.post('/v1/bulk_user_upload', upload.single('filename'), async (req, res,next)=> {
//   const csvuserdata = String(req.file.buffer);

//   const data={
//       input: {
//         csvuserdata,
//         customer_uuid:req.body.customer_uuid,
//         location_uuid: req.body.location_uuid,
//         access_group_uuid:req.body.access_group_uuid
//       },
//       derived:{}
//   };
//   data.derived.new_users = await conver_csv_to_json(data);
//   try{
//       const csvRow = await csv({noheader: true, output:"json"}).fromString(data.input.csvuserdata)
//       console.log(csvRow);
//   }catch (error){
//       console.error(error);
//   }
//   res 
//     .status(200)
//     .json(data);
// });


/*
  // open uploaded file
  csv.fromPath(req.filename.path)
    .on("data", function (data) {
      fileRows.push(data); // push each row
    })
    .on("end", function () {
      console.log(fileRows)
      fs.unlinkSync(req.filename.path);   // remove temp file
      //process "fileRows" and respond
    })
});

app.use('/upload-csv', router);
*/
// Start server
function startServer() {
    server.listen(port, function () {
        console.log('Express server listening on ', port);
    });
}

setImmediate(startServer);