// mail 관련 코드 :: 2021-07-30
const nodemailer = require("nodemailer");

require("dotenv").config();

const mailSender = async (todayCnt) => {
  console.log(todayCnt);
  //   console.log(process.env.NODEMAILER_USER, process.env.NODEMAILER_PASS);
  let transporter = nodemailer.createTransport({
    // 사용하고자 하는 서비스, gmail계정으로 전송할 예정이기에 'gmail'
    service: "gmail",
    // host를 gmail로 설정
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      // Gmail 주소 입력, 'testmail@gmail.com'
      user: process.env.NODEMAILER_USER,
      // Gmail 패스워드 입력
      pass: process.env.NODEMAILER_PASS,
    },
  });
  // 메일 보내는 곳
  let info = await transporter
    .sendMail({
      // 보내는 곳의 이름과, 메일 주소를 입력
      from: `"LikeLion Team" <${process.env.NODEMAILER_USER}>`,
      // 받는 곳의 메일 주소를 입력
      to: "ehddnjs8989@gmail.com",
      // 보내는 메일의 제목을 입력
      subject: "mail test",
      // 보내는 메일의 내용을 입력
      // text: 일반 text로 작성된 내용
      // html: html로 작성된 내용
      text: `오늘의 코로나 확진자는 ${todayCnt}입니다. 코로나 감염에 유의하세요!`,
      html: `<b>오늘의 코로나 확진자는 ${todayCnt} 명 입니다. 코로나 감염에 유의하세요!</b>`,
      messageId: "dongwon",
    })
    .catch(console.error);
};

module.exports = mailSender;
