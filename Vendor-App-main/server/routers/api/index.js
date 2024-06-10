const api = require("express").Router();
const authApiRequest = require("./middleware/authApiRequest");
const Shop = require("../../models/shop");
const User = require("../../models/user");
const Product = require("../../models/products")
const cron = require("node-cron");
const request = require("request-promise")
const fetch = require('node-fetch');
const jwt = require('jsonwebtoken');
const axios = require("axios");
const multer = require('multer')
const upload = multer({ dest: 'uploads/' })

const nodemailer = require("nodemailer");
const { google } = require('googleapis');

const Client_ID = '846669341254-uvrvqfum4oa432e1vkpn5qugkb43gpks.apps.googleusercontent.com'
const Client_secret = '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'
const Redirect_URI = 'https://developers.google.com/oauthplayground'
const Refresh_token = '1//04BtL5jIgHp4ACgYIARAAGAQSNwF-L9IrnM_Y1_Qo3bzcd6AkDZfxHj-Mailp49jusw_Vl0D39Uo034oUz6fuohq9pfKnRBHyFnw'

const oAuth2client = new google.auth.OAuth2(Client_ID, Client_secret, Redirect_URI)
oAuth2client.setCredentials({ refresh_token: Refresh_token })


async function sendMail(email, text) {
  try {
    const accessToken = await oAuth2client.getAccessToken()

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: 'OAuth2',
        user: "bhargav.raju.p@gmail.com", //process.env.EMAIL,
        // pass: "jwtPassword" //process.env.PASSWORD
        clientId: Client_ID,
        clientSecret: Client_secret,
        refreshToken: Refresh_token,
        accessToken: accessToken
      }
    })
    const mailOptions = {
      from: 'bhargav.raju.p@gmail.com',
      to: email,
      subject: 'forget password',
      // text: text,
      html: `<h1>${text}</h1>`
      // html: '<h1>you can reset the password now</h1>',
    };
    const result = await transporter.sendMail(mailOptions)
    return result
  }
  catch (error) {
    return error
  }
}

// send email Link For reset Password
api.post("/sendpasswordlink", async (req, res) => {
  // console.log("userrrrrrrrrr", req.body)

  const { email } = req.body;
  // console.log("emailllllllll", email)
  if (!email) {
    res.status(401).json({ status: 401, message: "Enter Your Email" })
  }

  try {
    const userfind = await User.findOne({ email: email });
    // console.log("userfindddddddd", userfind)
    // token generate for reset password
    const token = jwt.sign({ _id: userfind._id }, "jwtPassword", {
      expiresIn: "120s"
    });
    // console.log("tokenmmmmmm", token)
    // const setusertoken = await User.findByIdAndUpdate({ _id: userfind._id }, { verifytoken: token }, { new: true }).exec();

    const text = `This Link Valid For 2 MINUTES https://ddcf-49-207-207-177.in.ngrok.io/Forget_Password?shop=bhargav123456.myshopify.com/${userfind.id}/${token}`
    // console.log("setusertokennnnnnn", setusertoken, text)
    sendMail(email, text).then(result => console.log('email sent....', result))
      .catch((error) => console.log(error.message));
  } catch (error) {
    res.status(401).json({ status: 401, message: "invalid user" })
  }
});


api.get("/checkShop", async (req, res) => {
  // const SHOP = req.query.shop;
  // console.log("SHOP", SHOP);
  const shopOrigin = req.query.shop;
  console.log("SO", shopOrigin);
  const newShop = shopOrigin.split(".");
  const newShop12 = newShop[0];
  console.log("newShop12", newShop12);

  Shop.findOne({ shop: newShop12 }, function (err, docs) {
    if (err) {
      console.log(err);
    } else {
      // console.log("Result : ", docs);
      return res.send(docs);
    }
  });

});

//vendor signin API
api.post("/register", async (req, res) => {
  console.log("rrrrrrrrrrrrr");
  console.log("user", req.body)
  try {
    const user = await User.create(req.body);
    // res.redirect('/')
    if (!user) {
      res.status(400).json({ "code": 'User not created' })
    }
    res.status(200).json({ success: 'user is created' })
  } catch (error) {
    console.log("error", error.message)
    res.status(400).json({ status: 'Not able to create a new user.' })
  }
})

//vendor login API
api.post("/login", async (req, res) => {
  try {
    const { email, password, shopname } = req.body

    const result = await User.findOne({ email: email, password: password, vendorshop: req.headers.shopname, });
    console.log("Loggeddddddddddddd", result);

    // return res.status(200).send(result)
    if (!result) {
      res.status(400).send("email is not exist or Password is wrong.please register")
    }
    else {
      let payload = {
        user: {
          id: result.id
        }
      }
      jwt.sign(payload, "jwtPassword", { expiresIn: 360000000 }, (err, token) => {
        if (err) throw err
        return res.json({ token, vendor_name: result.vendor_name })
      })
    }
  } catch (error) {
    return res.status(500).send({ message: "User name or password wrong" })
  }
});

// update profile api for vendor
api.post("updateprofile", async (req, res) => {
  try {

  } catch (error) {
    return res.status(500).send({ message: "profile not updated" })
  }

});

// All API's are ADMIN PANEL

//All Product Listing admin Pannel
api.get("/all_productlist", async (req, res) => {
  // console.log("vendor_productlist", req.headers)
  try {
    if (!req.query.shop) {
      return res.status(404).send({ message: "Shop not found!" });
    }
    const url =
      `https://` + req.query.shop + `/admin/api/2022-10/products.json`;
    // console.log("--->?", url)
    // console.log("------>", req.query)
    const newShopArr = req.query.shop.split(".");
    const newShop = newShopArr[0];
    //  console.log("newShop12", newShop);
    const shopdata = await Shop.findOne({ shop: newShop });

    if (!shopdata.accessToken) {
      return res.status(404).send({ message: "access token not found!" });
    }
    let options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": shopdata.accessToken,
      },
    };

    const response = await fetch(url, options);
    const data = await response.json();
    // console.log("data>>>",data)   //To display all products list
    return res.status(200).send(data);
  } catch (error) {
    console.log(error);
    return res.status(404).send(error);
  }
});

//collection listing of product in admin panel
api.get("/products", async (req, res) => {
  try {
    if (!req.query.shop) {
      return res.status(404).send({ "message": "Shop not found!" })
    }
    const url = `https://` + req.query.shop + `/admin/api/2022-10/collections/${id}/products.json`;
    console.log("==>", req.query)
    const newShopArr = req.query.shop.split(".");
    const newShop = newShopArr[0];
    console.log("newShop12", newShop);
    const shopdata = await Shop.findOne({ shop: newShop });

    if (!shopdata.accessToken) {
      return res.status(404).send({ "message": "access token not found!" })
    }
    let options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': shopdata.accessToken
      }
    }

    const response = await fetch(url, options);
    // console.log("----====", response)
    const data = await response.json();
    // console.log("--->>>", data)   //To display all collections list
    return res.status(200).send(data)
  } catch (error) {
    // console.log("error------->", error);
    return res.status(404).send(error)
  }
})

// all order listing in admin panel
api.get("/allorders", async (req, res) => {
  try {
    if (!req.query.shop) {
      return res.status(404).send({ message: "Shop not found!" });
    }
    const url = `https://` + req.query.shop + `/admin/api/2022-10/orders.json`;
    // console.log("------>", url)
    // console.log("------>", req.query);
    const newShopArr = req.query.shop.split(".");
    const newShop = newShopArr[0];
    // console.log("newShop126", newShop);
    const shopdata = await Shop.findOne({ shop: newShop });
    if (!shopdata.accessToken) {
      return res.status(404).send({ message: "access token not found!" });
    }
    let options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": shopdata.accessToken,
      },
    };
    const response = await fetch(url, options);
    const data = await response.json();
    return res.status(200).send(data);
  } catch (error) {
    console.log(error);
    return res.status(404).send(error);
  }
});


//admin vendor delete vendor
api.post("/vendordelete", async (req, res) => {
  const SHOP = req.query.shop;
  //console.log("email", req.query.email);
  //console.log("SHOP", SHOP);
  try {
    const email = req.query.email;
    const result = await User.deleteOne({
      email: email,
      vendorshop: SHOP,
    });
    //console.log("Loggeddddddddddddd", result);
    if (!result) {
      //console.log(res);
      return res.status(304).send({ message: "Vendor can not be deleted" });
    } else {
      return res.status(200).send({ message: "Vendor removed" });
    }
    // User.remove({ _id: ObjectId(result._id) });
  } catch (error) {
    return res
      .status(500)
      .send({ message: "Vendor does not exist REfresh the page" });
  }
});

// admin vendor list details API
api.get("/vendorlistdata", async (req, res) => {
  const SHOP = req.query.shop;
  //console.log("SHOP", SHOP);

  // User.findOne({ vendorshop: SHOP }, function (err, vendor) {
  User.find({ vendorshop: SHOP }, function (err, vendor) {
    if (err) {
      console.log(err);
    } else {
      // console.log("Result : ", vendor);
      return res.send(vendor);
    }
  });
});

//  All  API are below VENDER PANEL
//create product api for shopify store in vendor panel
api.post("/createproducts", upload.single('image1'), async (req, res) => {
  console.log("craeteeeeee", req.body.title)
  console.log("image1", req.file)

  // const base64data = Buffer.from("bbbbbbbbb", req.file).toString('base64');
  // console.log("base64data", base64data);

  if (!req.headers.shopname) {
    return res.status(404).send({ message: "Shop not found!" });
  }
  //console.log("------>", req.headers.shopname);
  const newShopArr = req.headers.shopname.split(".");
  const newShop = newShopArr[0];
  const shopdata = await Shop.findOne({ shop: newShop });
  // console.log("shopdata", shopdata);
  if (!shopdata.accessToken) {
    return res.status(404).send({ message: "access token not found!" });
  }
  let payload = {};
  payload.product = {
    "title": req.body.title,
    "body_html": req.body.body_html,
    "vendor": req.body.vendor,
    "product_type": req.body.product_type,
    "status": "draft",
    "variants": req.body.allPlayers,
    "options": req.body.allOptions,
    "tags": req.body.tags,
    "images": {

      "attachment": "R0lGODlhAQABAIAAAAAAAAAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==\n",

    }
  }
  console.log("payloaddddd", payload)
  const url = `https://${newShop}.myshopify.com/admin/api/2022-10/products.json`

  // console.log(newPayload, url);
  let createProductRes = await axios.post(url, payload, {
    headers: {
      "X-Shopify-Access-Token": shopdata.accessToken,
      "Content-Type": "application/json",
    }
  });
  // console.log("responseeeeee", createProductRes);
  if (createProductRes.status == 201) {
    console.log("product 1111", createProductRes.data)

  } else {
    console.log("product 222", createProductRes.data)
  }
  if (!createProductRes.data) {
    res.status(400).json({ code: "product not added" });
  }
  res.status(200).json(createProductRes.data);
});

//product listing in Vendor panel
api.get("/vendor_productlist", async (req, res) => {
  // console.log("vendor_productlist", req.headers)
  try {
    if (!req.query.shop) {
      return res.status(404).send({ "message": "Shop not found!" })
    }
    const vendorname = req.headers.vendor_name
    const url = `https://` + req.query.shop + `/admin/api/2022-10/products.json?vendor=${vendorname}`;//?vendor=${vendor_name}
    // console.log("--->?", url)
    // console.log("------>", req.query)
    const newShopArr = req.query.shop.split(".");
    const newShop = newShopArr[0];
    //  console.log("newShop12", newShop);
    const shopdata = await Shop.findOne({ shop: newShop });

    if (!shopdata.accessToken) {
      return res.status(404).send({ "message": "access token not found!" })
    }
    let options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': shopdata.accessToken
      }
    }

    const response = await fetch(url, options);
    const data = await response.json();
    // console.log("data>>>",data)   //To display all products list
    return res.status(200).send(data)
  } catch (error) {
    console.log(error);
    return res.status(404).send(error)
  }
})

// update product in vendor panel
api.put("/updateproduct", async (req, res) => {
  console.log("updateproductttt", req.headers.shopname)
  // console.log("------>", req.body)
  const product = req.body.product
  const id = req.body.product.id
  // console.log("product", product)
  try {
    if (!req.headers.shopname) {
      return res.status(404).send({ "message": "Product Not Updated!" })
    }
    // console.log("updateproduct--->", req.headers.shopname)
    const newShopArr = req.headers.shopname.split(".");
    const newShop = newShopArr[0];
    const shopdata = await Shop.findOne({ shop: newShop });
    if (!shopdata.accessToken) {
      return res.status(404).send({ "message": "access token not found!" })
    }
    const updateproducturl = `https://${newShop}.myshopify.com/admin/api/2022-10/products/${id}.json`
    // console.log("update--->?", updateproducturl)
    var options = {
      url: updateproducturl,
      // console.log("update--->?", url)
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': shopdata.accessToken
      },
      body: {
        product
      },
      json: true,
    }
    request(options, function (error, response, product) {
      // console.log('updatedddddddd', response);
      if (!error && response.statusCode == 200) {
        console.log("update-product1", product)
      } else {
        console.log("update-product2", product)
      }
    })
    // const product = await Product.create(req.body);
    // console.log("bbbbbb", product)
    // res.redirect('/')
    if (!product) {
      res.status(400).json({ "code": 'product not updated' })
    }
    res.status(200).json({ success: 'product is updated' })
  }
  catch (error) {
    console.log(error);
    return res.status(404).send(error)
  }
})


//Delete Product
api.post("/vendorproductdelete", async (req, res) => {
  try {
    if (!req.query.shop) {
      return res.status(404).send({ message: "Shop not found!" });
    }
    console.log(req.query);
    const url =
      `https://` +
      req.query.shop +
      `/admin/api/2022-10/products/` +
      req.query.productId +
      `.json`;
    const newShopArr = req.query.shop.split(".");
    const newShop = newShopArr[0];
    console.log("newShop126", newShop);
    const shopdata = await Shop.findOne({ shop: newShop });

    if (!shopdata.accessToken) {
      return res.status(404).send({ message: "access token not found!" });
    }
    let options = {
      method: "delete",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": shopdata.accessToken,
      },
    };

    const response = await fetch(url, options);
    const data = await response.json();
    return res.status(200).send(data);
  } catch (error) {
    console.log(error);
    return res.status(404).send(error);
  }
});

//order listing in vendor panel
api.get("/vendororders", async (req, res) => {
  try {
    if (!req.query.shop) {
      return res.status(404).send({ message: "Shop not found!" });
    }
    const url = `https://` + req.query.shop + `/admin/api/2022-10/orders.json?vendor=Bhargav`;
    // console.log("------>", url)
    // console.log("------>", req.query);
    const newShopArr = req.query.shop.split(".");
    const newShop = newShopArr[0];
    // console.log("newShop126", newShop);
    const shopdata = await Shop.findOne({ shop: newShop });

    if (!shopdata.accessToken) {
      return res.status(404).send({ message: "access token not found!" });
    }
    let options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": shopdata.accessToken,
      },
    };

    const response = await fetch(url, options);
    const data = await response.json();
    return res.status(200).send(data);
  } catch (error) {
    console.log(error);
    return res.status(404).send(error);
  }
});

//Vendor order fullfilment api in vendor panel
api.post("/vendorfulfulment", async (req, res) => {
  const newShopArr = req.headers.shopname.split(".");
  const newShop = newShopArr[0];
  // console.log("newShop127", newShop);
  const shopdata = await Shop.findOne({ shop: newShop });
  console.log("shopdata", shopdata);
  if (!shopdata.accessToken) {
    return res.status(404).send({ message: "access token not found!" });
  }
  try {
    let fulfillment = await req.body.fulfillment;
    var options = {
      url: `https://${newShop}.myshopify.com/admin/api/2022-10/fulfillments.json`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": shopdata.accessToken,
      },
      body: {
        fulfillment,
      },
      json: true,
    };
    await request(options, function (error, response, fulfillment) {
      console.log("vupdate", response);
      if (!error && response.statusCode == 200) {
        console.log("update-vreq-body", fulfillment);
      } else {
        console.log("update-vreq-body2", fulfillment);
      }
    });
    if (!fulfillment) {
      res.status(400).json({ code: "fulfillment failed" });
    }
    res.status(200).json({ success: "fulfillment sucess" });
  } catch (error) {
    console.log("error", error.message);
    res.status(400).json({ status: "Not able to make fulfillment." });
  }
});

//order fulfillment reading in vendor panel
api.get("/vendorordersfulfilment", async (req, res) => {
  try {
    if (!req.query.shop) {
      return res.status(404).send({ message: "Shop not found!" });
    }
    const url = `https://` + req.query.shop + `/admin/api/2022-10/orders/` + req.query.orderId + `/fulfillment_orders.json`;
    // console.log("------>", url)
    //console.log("------>", req.query);
    const newShopArr = req.query.shop.split(".");
    const newShop = newShopArr[0];
    // console.log("newShop126", newShop);
    const shopdata = await Shop.findOne({ shop: newShop });

    if (!shopdata.accessToken) {
      return res.status(404).send({ message: "access token not found!" });
    }
    let options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": shopdata.accessToken,
      },
    };
    const response = await fetch(url, options);
    const data = await response.json();
    return res.status(200).send(data);
  } catch (error) {
    console.log(error);
    return res.status(404).send(error);
  }
});

// Vendor total products count
api.get("/vendorproductscount", async (req, res) => {
  try {
    if (!req.query.shop) {
      return res.status(404).send({ message: "Shop not found!" });
    }
    const vendorname = req.headers.vendor_name;
    const url =
      `https://` +
      req.query.shop +
      `/admin/api/2022-10/products/count.json?vendor=${vendorname}`;
    // console.log("------>", url)
    // console.log("------>", req.query);
    const newShopArr = req.query.shop.split(".");
    const newShop = newShopArr[0];
    // console.log("newShop126", newShop);
    const shopdata = await Shop.findOne({ shop: newShop });

    if (!shopdata.accessToken) {
      return res.status(404).send({ message: "access token not found!" });
    }
    let options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": shopdata.accessToken,
      },
    };

    const response = await fetch(url, options);
    const data = await response.json();
    return res.status(200).send(data);
  } catch (error) {
    console.log(error);
    return res.status(404).send(error);
  }
});
// Vendor active products count
api.get("/vendorproductsactivecount", async (req, res) => {
  try {
    if (!req.query.shop) {
      return res.status(404).send({ message: "Shop not found!" });
    }
    const vendorname = req.headers.vendor_name;
    const url =
      `https://` +
      req.query.shop +
      `/admin/api/2022-10/products/count.json?vendor=${vendorname}&status=active`;
    // console.log("------>", url)
    // console.log("------>", req.query);
    const newShopArr = req.query.shop.split(".");
    const newShop = newShopArr[0];
    // console.log("newShop126", newShop);
    const shopdata = await Shop.findOne({ shop: newShop });

    if (!shopdata.accessToken) {
      return res.status(404).send({ message: "access token not found!" });
    }
    let options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": shopdata.accessToken,
      },
    };

    const response = await fetch(url, options);
    const data = await response.json();
    return res.status(200).send(data);
  } catch (error) {
    console.log(error);
    return res.status(404).send(error);
  }
});
// Vendor products pending count
api.get("/vendorproductspendingcount", async (req, res) => {
  try {
    if (!req.query.shop) {
      return res.status(404).send({ message: "Shop not found!" });
    }
    const vendorname = req.headers.vendor_name;
    const url =
      `https://` +
      req.query.shop +
      `/admin/api/2022-10/products/count.json?vendor=${vendorname}&status=draft`;
    // console.log("------>", url)
    // console.log("------>", req.query);
    const newShopArr = req.query.shop.split(".");
    const newShop = newShopArr[0];
    // console.log("newShop126", newShop);
    const shopdata = await Shop.findOne({ shop: newShop });

    if (!shopdata.accessToken) {
      return res.status(404).send({ message: "access token not found!" });
    }
    let options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": shopdata.accessToken,
      },
    };

    const response = await fetch(url, options);
    const data = await response.json();
    return res.status(200).send(data);
  } catch (error) {
    console.log(error);
    return res.status(404).send(error);
  }
});
// Vendor order count
api.get("/vendororderscount", async (req, res) => {
  try {
    if (!req.query.shop) {
      return res.status(404).send({ message: "Shop not found!" });
    }
    const vendorname = req.headers.vendor_name;
    const url =
      `https://` +
      req.query.shop +
      `/admin/api/2022-10/orders/count.json?vendor=${vendorname}`;
    // console.log("------>", url)
    // console.log("------>", req.query);
    const newShopArr = req.query.shop.split(".");
    const newShop = newShopArr[0];
    // console.log("newShop126", newShop);
    const shopdata = await Shop.findOne({ shop: newShop });

    if (!shopdata.accessToken) {
      return res.status(404).send({ message: "access token not found!" });
    }
    let options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": shopdata.accessToken,
      },
    };

    const response = await fetch(url, options);
    const data = await response.json();
    return res.status(200).send(data);
  } catch (error) {
    console.log(error);
    return res.status(404).send(error);
  }
});
// Vendor unfulfilled order count
api.get("/vendorunfulfilledorderscount", async (req, res) => {
  try {
    if (!req.query.shop) {
      return res.status(404).send({ message: "Shop not found!" });
    }
    const vendorname = req.headers.vendor_name;
    const url =
      `https://` +
      req.query.shop +
      `/admin/api/2022-10/orders/count.json?vendor=${vendorname}&fulfillment_status=Unfulfilled`;
    // console.log("------>", url)
    // console.log("------>", req.query);
    const newShopArr = req.query.shop.split(".");
    const newShop = newShopArr[0];
    // console.log("newShop126", newShop);
    const shopdata = await Shop.findOne({ shop: newShop });

    if (!shopdata.accessToken) {
      return res.status(404).send({ message: "access token not found!" });
    }
    let options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": shopdata.accessToken,
      },
    };

    const response = await fetch(url, options);
    const data = await response.json();
    return res.status(200).send(data);
  } catch (error) {
    console.log(error);
    return res.status(404).send(error);
  }
});



// var options = {
//   url: `https://bhargav123456.myshopify.com/admin/api/2022-10/products.json`,
//   method: 'POST',
//   headers: {
//     'Content-Type': 'application/json',
//     'X-Shopify-Access-Token': 'shpua_e1c4bae4b7ab090439edb55358565fc0',
//   },
//   body:
//   {
//     "product": {
//       "title": "Burton Custom Freestyle 151",
//       "body_html": "<strong>Good snowboard!</strong>",
//       "vendor": "Burton",
//       "product_type": "Snowboard",
//       "tags": [
//         "Barnes & Noble",
//         "John's Fav",
//         "Big Air"
//       ]
//     },
//   },
//   json: true,
// }

// request(options, function (error, response, body) {
//   // console.log('update', response);
//   if (!error && response.statusCode == 200) {
//     console.log("update-req-body", body)
//   } else {
//     console.log("update-req-body2", body)
//   }
// })


module.exports = api;
