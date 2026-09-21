const express = require('express');
const database = require('./database');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();


const uploadFolder = path.join(__dirname, 'Project files', 'uploads');

if (!fs.existsSync(uploadFolder)) {
  fs.mkdirSync(uploadFolder, { recursive: true });
}


const storage = multer.diskStorage({

  destination: (req, file, cb) => {
    cb(null, uploadFolder);
  },

  filename: (req, file, cb) => {

    const uniqueName =
      Date.now() + '-' + Math.round(Math.random() * 1E9);

    cb(
      null,
      uniqueName + path.extname(file.originalname)
    );

  }

});


const upload = multer({
  storage: storage
});


app.use(express.json());

app.use(express.urlencoded({
  extended: true
}));

app.use(express.static(__dirname));


app.get('/api/guest-houses', (req, res) => {

  const sql = 'SELECT * FROM guest_houses';

  database.query(sql, (error, results) => {

    if (error) {

      console.log('GET DATABASE ERROR:');
      console.log(error);

      return res.status(500).json({
        message: 'Database error'
      });

    }

    res.json(results);

  });

});


app.post(
  '/api/guest-houses',
  upload.single('image'),
  (req, res) => {

    try {

      if (!req.file) {

        return res.status(400).json({
          message: 'Please upload a property image'
        });

      }


      const {
        name,
        location,
        price,
        parking,
        wifi,
        kitchen,
        aircon,
        tv,
        pets,
        bathrooms,
        pool,
        close_to_mall,
        close_to_cbd
      } = req.body;


      if (!name || !location || !price) {

        return res.status(400).json({
          message: 'Name, location and price are required'
        });

      }


      const image =
        `Project files/uploads/${req.file.filename}`;


      const sql = `
        INSERT INTO guest_houses (
          name,
          location,
          price,
          image,
          parking,
          wifi,
          kitchen,
          aircon,
          tv,
          pets,
          bathrooms,
          pool,
          close_to_mall,
          close_to_cbd
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;


      const values = [
  name,
  location,
  Number(price),
  image,
  parking === 'true' ? 1 : 0,
  wifi === 'true' ? 1 : 0,
  kitchen === 'true' ? 1 : 0,
  aircon === 'true' ? 1 : 0,
  tv === 'true' ? 1 : 0,
  pets === 'true' ? 1 : 0,
  Number(bathrooms),
  pool === 'true' ? 1 : 0,
  close_to_mall === 'true' ? 1 : 0,
  close_to_cbd === 'true' ? 1 : 0
];

console.log('VALUES BEING SENT TO MYSQL:');
console.log(values);


      database.query(sql, values, (error, result) => {

        if (error) {

          console.log('POST DATABASE ERROR:');
          console.log(error);

          return res.status(500).json({
            message: 'Database error'
          });

        }


        res.status(201).json({

          message: 'Guest house added successfully',

          id: result.insertId,

          image: image

        });

      });


    } catch (error) {

      console.log('SERVER ERROR:');
      console.log(error);

      res.status(500).json({
        message: 'Server error'
      });

    }

  }
);


app.use((error, req, res, next) => {

  console.log('UPLOAD ERROR:');
  console.log(error);

  res.status(500).json({
    message: 'Image upload failed'
  });

});


app.listen(3000, () => {

  console.log('Hostess server running on port 3000');

});