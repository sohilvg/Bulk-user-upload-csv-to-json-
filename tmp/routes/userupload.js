const express = require("express");
const multer = require("multer");
const Joi = require("joi");
const router = express.Router();
const request = require("request");
const rp = require("request-promise-native");
const csv = require("csvtojson");
const upload = multer({
  storeg: multer.memoryStorage()
});

router.post(
  "/v1/bulk_user_upload",
  upload.single("filename"),
  async (req, res, next) => {
    try {
      const csvuserdata = String(req.file.buffer);

      const data = {
        input: {
          csvuserdata,
          customer_uuid: req.body.customer_uuid,
          location_uuid: req.body.location_uuid,
          access_group_uuid: req.body.access_group_uuid
        },
        derived: {}
      };
      const new_users = await conver_csv_to_json(data);
      data.derived.new_users = new_users;
      // console.log(customer_uuid);
      await is_csv_data_valid(new_users);
      for (i = 0; i < new_users.length; i++) {
        await add_user(
          data.input.customer_uuid,
          data.input.location_uuid,
          data.input.access_group_uuid,
          new_users[i]
        );
      }

      return res.status(200).json(data);
    } catch (error) {
      console.error(error);
      return res.status(200).json(data);
    }
  }
);
conver_csv_to_json = async data => {
  const csvRow = await csv({
    noheader: false,
    output: "json"
  }).fromString(data.input.csvuserdata);
  console.log(csvRow);
  return csvRow;
};

const add_user = async (
  customer_uuid,
  location_uuid,
  access_group_uuid,
  user
) => {
  try {
    console.log(user);
    console.log(customer_uuid);
    await rp({
      method: "POST",
      uri: ``,
      body: {
        email: user.email === "" ? null : user.email,
        name: user.name,
        user_locations: [
          {
            location_uuid: location_uuid,
            role: "USER",
            access_group_uuids: [access_group_uuid]
          }
        ]
      },
      headers: {
        "content-type": "application/json",
        Authorization:
          "****************************************************"
      },
      json: true // Automatically stringifies the body to JSON
    });
    console.log("success");
  } catch (error) {
    console.error(error.message);
    console.log("fail");
  }
};
is_csv_data_valid = new_users => {
  const schema = Joi.object().keys({
    name: Joi.string()
      .alphanum()
      .min(3)
      .max(30)
      .required(),
    // password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/),
    email: Joi.string().email({ minDomainAtoms: 2 })
      //   .email.string()
      .string()
      .empty("")
      .lowercase(),
    //  trim()  
      })
  schema.validate(
    {
      name: "test"
      // password: 'hunter2'
    },
    (err, value) => {
      // value = { username: 'test' }
    }
  );
};

// Joi.validate({name}, schema, function (err, value) { });

//   rp(options)
//     .then(function(parsedBody) {
//       // POST succeeded...
//     })
//     .catch(function(err) {
//       // POST failed...
//     });
// };

module.exports = router;
