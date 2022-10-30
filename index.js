const mongoConnect = require("./dbConf/db");
const express = require("express");
const Agency = require("./models/Agency");
const Client = require("./models/Client");
const { body, validationResult } = require("express-validator");
// var jwt = require("jsonwebtoken");

// const JWT_SECRET = "ZerozillaNodeJSTaskByRakesh";

mongoConnect();
const app = express();
app.use(express.json());
const port = process.env.PORT || 2111;

app.use((req, res, next) => {
  require("./middleware/tokenize")(req, res, next);
});

app.listen(port, () => {
  console.log("Server running on port ", port);
  // const authtoken = jwt.sign('1234567890', JWT_SECRET);
  // console.log(authtoken)
});

app.post(
  "/create",
  [
    body("agencyDetails.Name", "Name must be atleast 2 chracters").isLength({
      min: 2,
    }),
    body("clientDetails.Name", "Name must be atleast 2 chracters").isLength({
      min: 2,
    }),
    body("clientDetails.Email", "Enter Valid Email Address").isEmail(),
  ],
  async (req, res) => {
    let agencyDetails = req.body.agencyDetails;
    let clientDetails = req.body.clientDetails;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    let client = await Client.findOne({ ClientId: clientDetails.ClientId });
    if (!client) {
      Client.create({
        ClientId: clientDetails.ClientId,
        AgencyId: agencyDetails.AgencyId,
        Name: clientDetails.Name,
        Email: clientDetails.Email,
        PhoneNumber: clientDetails.PhoneNumber,
        TotalBill: clientDetails.TotalBill,
      })
        .then(async () => {
          let agency = await Agency.findOne({
            AgencyId: agencyDetails.AgencyId,
          });
          if (!agency) {
            Agency.create({
              AgencyId: agencyDetails.AgencyId,
              Name: agencyDetails.Name,
              Address1: agencyDetails.Address1,
              Address2: agencyDetails.Address2,
              State: agencyDetails.State,
              City: agencyDetails.City,
              PhoneNumber: agencyDetails.PhoneNumber,
            })
              .then(() => {
                res.json({ message: "Success" });
              })
              .catch((err) => {
                console.log(err);
                return res.status(400).json({ error: err.message });
              });
          } else {
            res.json({ message: "Success" });
          }
        })
        .catch((err) => {
          console.log(err);
          return res.status(400).json({ error: err.message });
        });
    } else {
      res.json({ error: "Client with this Id is already present" });
    }
  }
);

app.post("/update", (req, res) => {
  Client.findOneAndUpdate({ ClientId: req.body.ClientId }, req.body, {
    runValidators: true,
  })
    .then((client) => {
      console.log(client);
      res.json({ message: "Updated Successfully" });
    })
    .catch((err) => {
      return res.status(400).json({ error: err });
    });
});

app.get("/getTopClient", async (req, res) => {
  let amount = await Client.find({}).sort({ TotalBill: -1 }).limit(1);
  if (amount.length != 0) {
    Client.aggregate([
      { $match: { TotalBill: amount[0].TotalBill } },
      {
        $lookup: {
          from: "agencies",
          localField: "AgencyId",
          foreignField: "AgencyId",
          as: "agencyDetails",
        },
      },
      { $unwind: "$agencyDetails" },
      {
        $project: {
          _id: 0,
          AgencyName: "$Name",
          ClientName: "$agencyDetails.Name",
          TotalBill: "$TotalBill",
        },
      },
    ]).then((topClient) => {
      res.json(topClient);
    });
  }
  else{
    res.json({message:'No Clients Present in Database'})
  }
});
