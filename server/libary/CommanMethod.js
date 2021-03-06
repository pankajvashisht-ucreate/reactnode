/*
 * v1
 * auth pankaj vashisht @sharmapankaj688@gmail.com
 * helper can used in the whole app for sending mail , push  , payment etc work.
 * function with anysc , await or without anysc awit .
 */

/**
 * first import the configration file after get the all configration
 * send mail , push , file upload etc .
 * when function cal then that file import at moment.
 */
const config = require("../config/config");
const fs = require("fs");
const crypto = require("crypto");
const os = require("os");

module.exports = {
  send_mail: function(object) {
    const MailConfig = require("../config/mails");
    const nodemailer = require("nodemailer");
    try {
      var transporter = nodemailer.createTransport(
        MailConfig[MailConfig.default]
      );
      var mailOptions = object;
      transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
          console.log("i am check error ", error);
        } else {
          console.log("Email sent: " + info.response);
        }
      });
    } catch (err) {
      console.log(err);
      return;
    }
  },

  upload_pic_with_await: function(
    file,
    folder_name = "uploads/",
    unlink = null
  ) {
    try {
      if (!file) {
        return false; // if not getting the image
      } else {
        if (unlink) {
        }

        let upload_path = appRoot + "/public/" + folder_name;
        let image = file;
        let image_array = image.mimetype.split("/");
        let extension = image_array[image_array.length - 1];
        var timestamp = parseInt(new Date().getTime());
        image.mv(upload_path + "/" + timestamp + "." + extension, function(
          err
        ) {
          if (err) {
            console.log(err);
          } else {
            console.log("file_uploaded");
          }
        });
        return timestamp + "." + extension;
      }
    } catch (err) {
      throw { code: 415, message: err };
    }
  },

  upload_pic: async function() {
    const fileUpload = require("express-fileupload");
    if (!file) {
      return false; // if not getting the image
    } else {
      if (unlink) {
      }
      let upload_path = config.root_path;
      if (folder_name.length) {
        upload_path + folder_name;
      }
      let image = file;
      let image_array = image.mimetype.split("/");
      let extension = image_array[image_array.length - 1];
      var timestamp = parseInt(new Date().getTime());
      image.mv(upload_path + "/" + timestamp + "." + extension, function(err) {
        if (err) {
          console.log(err);
        } else {
          console.log("file_uploaded");
        }
      });
      return timestamp + "." + extension;
    }
  },
  send_push: function(data) {
    const FCM = require("fcm-node");
    const serverKey = config.GOOGLE_KEY; //put your server key here
    const fcm = new FCM(serverKey);
    delete data.data.message_type;
    let message = {
      //this may vary according to the message type (single recipient, multicast, topic, et cetera)
      to: data.token,
      collapse_key: "your_collapse_key",

      notification: {
        title: config.App_name,
        body: data.message
      },

      data: data.data
    };
    console.log("push testing", message);
    try {
      fcm.send(message, function(err, response) {
        if (err) {
          console.log(err);
          return false;
        } else {
          console.log("Successfully sent with response: ", response);
          return true;
        }
      });
    } catch (err) {
      throw err;
    }
  },
  send_push_apn: function() {},
  paypal: async function() {},
  stripe: async function() {},
  brain_tree: async function() {},

  error: function(res, err) {
    try {
      let code =
        typeof err === "object"
          ? err.hasOwnProperty("code")
            ? err.code
            : 500
          : 403;
      let message =
        typeof err === "object"
          ? err.hasOwnProperty("message")
            ? err.message
            : err
          : err;
      res.status(code).json({
        success: false,
        error_message: message,
        code: code,
        data: []
      });
    } catch (error) {
      return res.status(500).json(error);
    }
  },

  success: function(res, data) {
    res.json({
      success: true,
      message: data.message,
      code: 200,
      data: data.data
    });
  },
  loadModel: function(file_name = null) {
    try {
      if (fs.existsSync(config.root_path + "model/" + file_name + ".js")) {
        let models = require("../model/" + file_name);
        return new models();
      } else {
        let message =
          "Model " +
          file_name +
          " Not Found on the server.Please create the " +
          file_name +
          " in model folder.";
        throw { code: 404, message };
      }
    } catch (err) {
      throw err;
    }
  },
  modelvalidation: function(model_data, user_data) {
    try {
    } catch (err) {
      throw err;
    }
  },
  createToken() {
    let key = "abc" + new Date().getTime();
    return crypto
      .createHash("sha1")
      .update(key)
      .digest("hex");
  },
  createHash(key, hash = "sha1") {
    return crypto
      .createHash("sha1")
      .update(key)
      .digest("hex");
  },
  UserToken: function(id, req) {
    const clientIp = req.connection.remoteAddress;
    const {
      isMobile,
      isDesktop,
      browser,
      version,
      os,
      platform,
      source
    } = req.useragent;
    let token =
      id +
      clientIp +
      isMobile +
      isDesktop +
      os +
      version +
      platform +
      source +
      browser;
    return this.createHash(token);
  },
  ImageUrl(name, folder = "uploads") {
    const networkInterfaces = os.networkInterfaces();
    let ip = "localhost";
    // Object.keys(networkInterfaces).forEach(function (ifname) {
    //   var alias = 0;
    //   networkInterfaces[ifname].forEach(function (iface) {
    //     if ('IPv4' !== iface.family || iface.internal !== false) {
    //       ip = iface.address;
    //     }
    //     if (alias >= 1) {
    //       ip = iface.address;
    //     } else {
    //       ip = iface.address;
    //     }
    //     ++alias;
    //   });
    // });
    return "http://" + ip + ":" + config.port + "/" + folder + "/" + name;
  },
  randomNumber() {
    return Math.floor(1000 + Math.random() * 9000);
  }
};
