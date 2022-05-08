// import twilio from "twilio";
// import client from "@libs/server/client";
// import withHandler, { ResponseType } from "@libs/server/withHandler";
// import { NextApiRequest, NextApiResponse } from "next";

// const twilioClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);

// async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse<ResponseType>
// ) {
//   const { phone, email } = req.body;
//   const user = phone ? { phone: +phone } : { email };
//   if (!user) return res.status(400).json({ ok: false });
//   const payload = Math.floor(100000 + Math.random() * 900000) + "";

//   const token = await client.token.create({
//     data: {
//       payload,
//       user: {
//         connectOrCreate: {
//           where: {
//             ...user,
//           },
//           create: {
//             name: "Anonymous",
//             ...user,
//           },
//         },
//       },
//     },
//   });
//   if (phone) {
//     const message = await twilioClient.messages.create({
//       messagingServiceSid: process.env.TWILIO_MSID,
//       to: process.env.TWILIO_MY_PHONE!,
//       body: `Your login token is ${payload} hi ioi jongi`,
//     });
//     console.log(message)
//   }
//   return res.json({
//     ok: true,
//   });
// }

// export default withHandler("POST", handler);

import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/client";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import twilio from "twilio";

// npm install nodemailer (nodemailer설치)
// nodemailer 기초 설정
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_ID,
    pass: process.env.GMAIL_PWD,
  },
});

// twilio 기초 설정
const twilioClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const { phone, email } = req.body;

  const user = phone ? { phone } : email ? { email } : null; //...payload

  if (!user) return res.status(400).json({ ok: false });

  //token 생성
  const randomToken = Math.floor(100000 + Math.random() * 900000) + "";
  const token = await client.token.create({
    data: {
      //Model - token.payload 레코드생성
      payload: randomToken,
      //Model - token.user == User 레코드생성
      user: {
        connectOrCreate: {
          where: {
            ...user,
          },
          create: {
            // 존재하지 않을떄 만든다.
            name: "익명의 사용자",
            ...user,
          },
        },
      },
    },
  });
  console.log(token);

  // ## twilio mms 보내기
  if (phone) {
    // const message = await twilioClient.messages.create({
    //   messagingServiceSid: process.env.TWILIO_MSID,
    //   to: process.env.TWILIO_MY_PHONE!, //phone , 원래는 전화번호 req 받은값
    //   body: `your login token is ${randomToken}`,
    // });
    // console.log(message);
    // ## nodemailer Email 보내기
  } else if (email) {
    // const sendEmail = await transporter
    //   .sendMail({
    //     from: `ABC <pjh15237213@gmail.com>`,
    //     to: email,
    //     subject: "token",
    //     text: `your login token is ${randomToken}`,
    //     html: `
    //       <div style="text-align: center;">
    //         <h3 style="color: #FA5882">ABC</h3>
    //         <br />
    //         <p>your login token is ${randomToken}</p>
    //       </div>
    //   `,
    //   })
    //   .then((result: any) => console.log(result))
    //   .catch((err: any) => console.log(err));
  }

  return res.status(200).json({ ok: true });
}

// POST, GET 을 확인 하는 함수.. (일종의 미들웨어..)
export default withHandler({
  method: "POST",
  handler,
  isPrivate: false,
});
