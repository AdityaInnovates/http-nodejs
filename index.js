// import Axios from "axios";
const {
  Client,
  LegacySessionAuth,
  LocalAuth,
  MessageMedia,
  // RemoteAuth,
} = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const fs = require("fs");
const Axios = require("axios");
var FormData = require("form-data");
// const {
//   Sticker,
//   createSticker,
//   StickerTypes,
// } = require("wa-sticker-formatter-gsf");
// var webp = require("webp-converter-jr");
const { Blob } = require("buffer");
const { URLSearchParams } = require("url");
// const extractFrames = require("ffmpeg-extract-frames");
var express = require("express");
var app = express();
var path = require("path");
// const { MongoStore } = require("wwebjs-mongo");
const mongoose = require("mongoose");
const { setTimeout } = require("timers/promises");

app.use("/public", express.static(path.join(__dirname + "/public")));

// mongoose
//   .connect(
//     "mongodb+srv://aditya:aditya123@cluster0.9vjkq.mongodb.net/SessionData"
//   )
//   .then(() => {
// const store = new MongoStore({ mongoose: mongoose });
const client = new Client({
  userAgent:
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36",
  puppeteer: {
    // executablePath: "/usr/bin/google-chrome-stable",
  },
  // authStrategy: new LocalAuth({
  //   clientId: "client-one",
  // }),
  puppeteer: {
    headless: true,
    // args: ["--no-sandbox", "--disable-setuid-sandbox"],
    // headless: false,
  },
  authStrategy: new LocalAuth({ clientId: "client-one" }),
  // authStrategy: new RemoteAuth({
  //   store: store,
  //   backupSyncMs: 300000,
  // }),
});
const client2 = new Client({
  userAgent:
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36",
  puppeteer: {
    // executablePath: "/usr/bin/google-chrome-stable",
  },
  // authStrategy: new LocalAuth({
  //   clientId: "client-one",
  // }),
  puppeteer: {
    headless: true,
    // args: ["--no-sandbox", "--disable-setuid-sandbox"],
    // headless: false,
  },
  authStrategy: new LocalAuth({ clientId: "client-two" }),
  // authStrategy: new RemoteAuth({
  //   store: store,
  //   backupSyncMs: 300000,
  // }),
});

//Start Of Client.On Codes

client.on("authenticated", (session) => {
  console.log("WHATSAPP WEB => Authenticated");
});

client.on("ready", async () => {
  console.log("WHATSAPP WEB => Ready");
});

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

client2.on("authenticated", (session) => {
  console.log("WHATSAPP WEB => Authenticated");
});

client2.on("ready", async () => {
  console.log("WHATSAPP WEB => Ready");
});

client2.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on("message", async (msg) => {
  if (msg.body.toUpperCase() == "HEY BOOGY") {
    msg.reply("hey " + msg._data.notifyName + " How It's Going .. Bro😎");
    var msgtosend = MessageMedia.fromFilePath("./public/Boogy.webp");
    msg.reply(msgtosend, "", { sendMediaAsSticker: true });
  }
  if (msg._data.type == "sticker") {
    // console.log(msg);
    // msg.downloadMedia().then((e) => {
    //   console.log(JSON.stringify(e));
    //   fs.writeFile(
    //     "./public/BoogyLazyJSON.json",
    //     JSON.stringify(e),
    //     (d) => {
    //       console.log(d);
    //     }
    //   );
    // });
    // client.sendMessage(msg._data.id._serialized.split("_")[1], e, {
    //   sendMediaAsSticker: true,
    //   stickerName: "Boogy Bot!",
    //   stickerAuthor: "By Aditya Kumar!!",
    // });
    // });
  }
  // console.log(msg);
});
var reg = new RegExp("^[0-9]*$");
client.on("message_create", async (m) => {
  console.log(m);
  if (m._data.id.fromMe) {
    // console.log(m);
    if (m._data.body?.length >= 10) {
      if (m._data.body.substring(0, 8).toUpperCase() == "SPAMHERE") {
        const tosenddat = m._data.body.substring(9, m._data.body.length);
        // console.log(tosenddat);
        const tosendCount = m._data.body.substring(9, 12);
        if (m.hasQuotedMsg) {
          if (reg.test(tosendCount)) {
            if (m._data.quotedMsg.type == "chat") {
              m.delete(true);
              for (let index = 0; index < tosendCount; index++) {
                await client.sendMessage(m._data.to, m._data.quotedMsg.body);
              }
            } else if (m._data.quotedMsg.type == "sticker") {
              if (reg.test(tosendCount)) {
                var msgtosend = MessageMedia.fromFilePath(
                  "./public/BoogyLazy.webp"
                );
                var delidsnd = await client.sendMessage(
                  m._data.id._serialized.split("_")[1],
                  msgtosend,
                  { sendMediaAsSticker: true }
                );
                var delid = await client.sendMessage(
                  m._data.id._serialized.split("_")[1],
                  "Wait Bro Feeling Lazy...",
                  { sendMediaAsSticker: true }
                );

                // console.log("hmm");
                // console.log(m._data.to);
                m.getQuotedMessage().then(async (dat) => {
                  m.delete(true);
                  if (dat.hasMedia) {
                    var dd = await dat.downloadMedia();
                    var doneOnce = false;

                    var chatdat = await client.sendMessage(
                      dat._data.id._serialized.split("_")[1],
                      dd,
                      {
                        sendMediaAsSticker: true,
                        stickerName: "Boogy Bot!",
                        stickerAuthor: "By Aditya Kumar!!",
                      }
                    );
                    for (let index = 0; index < tosendCount; index++) {
                      chatdat.forward(dat._data.id._serialized.split("_")[1]);
                      if (index == tosendCount - 1) {
                        await client.sendMessage(
                          dat._data.id._serialized.split("_")[1],
                          `Done ${tosendCount} Sent!`
                        );
                        delidsnd.delete(true);
                        // setTimeout(() => {}, 1000);
                      }
                    }
                    delid.delete(true);
                    // if (!doneOnce) {
                    //   setTimeout(() => {
                    //     setTimeout(() => {}, 100);
                    //   }, 1000);
                    //   doneOnce = true;
                    // }
                  }
                });
              }
            } else if (m._data.quotedMsg.isGif) {
              m.getQuotedMessage().then(async (dat) => {
                m.delete(true);
                if (dat.hasMedia) {
                  // var dd = await dat.downloadMedia();
                  // console.log(dd);
                  // await fs.writeFileSync(
                  //   "stickerName.mp4",
                  //   new Buffer.from(dd.data, "base64")
                  // );
                  // // var datbuf = await new Buffer.from(dd.data, "base64");
                  // var msgofbuf = MessageMedia.fromFilePath("stickerName.mp4");
                  // client.sendMessage(
                  //   dat._data.id._serialized.split("_")[1],
                  //   dd,
                  //   {
                  //     sendVideoAsGif: true,
                  //   }
                  // );
                  // await extractFrames({
                  //   input: "stickerName.mp4",
                  //   output: `./temp/for${
                  //     dat._data.id._serialized.split("_")[2]
                  //   }/frame-%d.png`,
                  // });
                  // fs.readdir(
                  //   `./temp/for${dat._data.id._serialized.split("_")[2]}`,
                  //   {},
                  //   (f) => console.log(f)
                  // );
                  //To Do-------------|
                  // Take All Frames of Video
                  // SAVE All
                  // Make All JPG TO WEBP(Web Pictures)
                  // Make Animation From All Given WEBP Images
                  // Take Animated WEBP FILE MAKE Message Media
                  // Sent It ......🙌🙌🙌💕👍⭐⭐⭐⭐⭐⭐⭐⭐⭐
                  // var formData = new FormData();
                  // formData.append("class", "image");
                  // formData.append("from", "video");
                  // formData.append("to", "webp");
                  // formData.append("source", "upload");
                  // formData.append("file", datbuf, "stickerName.mp4");
                  // fs.writeFile(
                  //   "stickerName.mp4",
                  //   new Buffer.from(dd.data, "base64")
                  // );
                  // console.log(dat);
                  // console.log(formData);
                  // var dt = await Axios.request({
                  //   method: "POST",
                  //   url: "https://hostspeedy.onlineconverter.com/file/send",
                  //   data: formData,
                  //   headers: {
                  //     ...formData.getHeaders()
                  //   },
                  // });
                  // console.log(dt);
                  // var readdat = await fs.readFile();
                  // Axios.post()
                  // Axios.post(
                  //   "https://hostspeedy.onlineconverter.com/file/send",
                  //   formData,
                  //   {}
                  // ).then((dat) => {
                  //   console.log(dat.data);
                  // });
                  // var buff = new Buffer.from(dd.data, "base64");
                  // fs.writeFile(
                  //   "stickerName.mp4",
                  //   new Buffer.from(dd.data, "base64"),
                  //   async () => {
                  //     fs.readFile("stickerName.mp4", (d) => {
                  //       var formData = new FormData();
                  //       formData.append("class", "image");
                  //       formData.append("from", "video");
                  //       formData.append("to", "webp");
                  //       formData.append("source", "upload");
                  //       formData.append(
                  //         "file",
                  //         new Buffer.from(dd.data, "base64"),
                  //         {
                  //           filename: "stickerName.mp4",
                  //           contentType: "video/mp4",
                  //         }
                  //       );
                  //       axios
                  //         .post(
                  //           "https://hostspeedy.onlineconverter.com/file/send",
                  //           formData,
                  //           {
                  //             headers: {
                  //               "Content-Type": "multipart/form-data",
                  //             },
                  //           }
                  //         )
                  //         .then((dat) => {
                  //           console.log(dat);
                  //         });
                  //     });
                  //   }
                  // );
                  // const buffer = await createSticker(
                  //   new Buffer.from(dd.data, "base64"),
                  //   {
                  //     pack: "Boggy Bot!",
                  //     author: "Aditya",
                  //     type: StickerTypes.FULL,
                  //     categories: ["🤩", "🎉"],
                  //     id: "12345",
                  //     quality: 50,
                  //     background: "#000000",
                  //   }
                  // );
                  // console.log(buffer);
                  // for (let index = 0; index < tosendCount; index++) {
                  //   client.sendMessage(
                  //     dat._data.id._serialized.split("_")[1],
                  //     dd,
                  //     {
                  //       sendVideoAsGif: true,
                  //     }
                  //   );
                  // }
                }
              });
            } else if (m._data.quotedMsg.type == "image") {
              if (reg.test(tosendCount)) {
                var msgtosend = MessageMedia.fromFilePath(
                  "./public/BoogyLazy.webp"
                );
                var delidsnd = await client.sendMessage(
                  m._data.id._serialized.split("_")[1],
                  msgtosend,
                  { sendMediaAsSticker: true }
                );
                var delid = await client.sendMessage(
                  m._data.id._serialized.split("_")[1],
                  "Wait Bro Feeling Lazy...",
                  { sendMediaAsSticker: true }
                );
                m.getQuotedMessage().then(async (dat) => {
                  m.delete(true);
                  if (dat.hasMedia) {
                    var dd = await dat.downloadMedia();

                    var doneOnce = false;
                    var datmsg = await client.sendMessage(
                      dat._data.id._serialized.split("_")[1],
                      dd,
                      {
                        sendMediaAsSticker: true,
                        stickerName: "Boogy Bot!",
                        stickerAuthor: "By Aditya Kumar!!",
                      }
                    );
                    for (let index = 0; index < tosendCount; index++) {
                      datmsg.forward(dat._data.id._serialized.split("_")[1]);
                      // if (!doneOnce) {
                      //   setTimeout(() => {
                      //     setTimeout(() => {}, 100);
                      //   }, 1000);
                      //   doneOnce = true;
                      // }
                      if (index == tosendCount - 1) {
                        await client.sendMessage(
                          dat._data.id._serialized.split("_")[1],
                          `Done ${tosendCount} Sent!`
                        );
                        delidsnd.delete(true);
                        setTimeout(() => {}, 1000);
                      }
                    }
                    delid.delete(true);
                  }
                });
              }
            }
          }
        }
        if (tosenddat.includes("dp")) {
          m.delete(true);
          var msgtosend = MessageMedia.fromFilePath("./public/BoogyLazy.webp");
          var delidsnd = await client.sendMessage(
            m._data.id._serialized.split("_")[1],
            msgtosend,
            { sendMediaAsSticker: true }
          );
          var delid = await client.sendMessage(
            m._data.id._serialized.split("_")[1],
            "Wait Bro Feeling Lazy...",
            { sendMediaAsSticker: true }
          );
          const sdt = tosenddat.substring(3, 6);
          var pic = await client.getProfilePicUrl(
            m._data.id._serialized.split("_")[1]
          );
          const makemsg = await MessageMedia.fromUrl(pic);

          var doneOnce = false;

          var darsmgc = await client.sendMessage(m._data.to, makemsg, {
            sendMediaAsSticker: true,
            stickerName: "Boggy Bot!",
            stickerAuthor: "By Aditya!!",
          });
          for (let index = 0; index < sdt; index++) {
            darsmgc.forward(m._data.id._serialized.split("_")[1]);
            // if (!doneOnce) {
            //   setTimeout(() => {}, 1000);
            //   doneOnce = true;
            // }
            if (index == sdt - 1) {
              await client.sendMessage(
                dat._data.id._serialized.split("_")[1],
                `Done ${tosendCount} Sent!`
              );
              delidsnd.delete(true);
              // setTimeout(() => {}, 1000);
            }
          }
          delid.delete(true);
        }
      }
    }
  }
});

//end Of Client.On Codes
(async () => {
  await client.initialize();
  // await client.destroy();
  await client2.initialize();
  // await client2.destroy();
})();
// });

app.use(express.static(__dirname + "/"));
app.get("/", (req, res) => {
  res.sendFile(path.resolve(__dirname, "./index.html"));
});
app.post("/forwardmsg", (req, res) => {
  (async () => {
    console.log("working");
    await client2.sendMessage("919473487106@c.us", `HI its boogy Bot!`);
    await client2.sendMessage("919473487106@c.us", req.body.for);
    client2.on("message_create", (msg) => {
      if (msg._data.id.fromMe) {
        console.log(msg._data.id._serialized.split("_")[1]);
      }
    });
  })();
});
app.listen(process.env.PORT || 8080, () => {
  console.log(
    `listen started on http://localhost:${
      process.env.PORT ? process.env.PORT : "8080"
    }`
  );
});
function delay(time) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time);
  });
}

// const client = new Client();

// const client = new Client({
//   puppeteer: {
//     executablePath: "/usr/bin/brave-browser-stable",
//   },
//   authStrategy: new LocalAuth({
//     clientId: "client-one",
//   }),
//   puppeteer: {
//     headless: true,
//     args: ["--no-sandbox", "--disable-setuid-sandbox"],
//     // headless: false,
//   },
// });

// client.initialize();
