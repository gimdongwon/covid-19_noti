const express = require("express");
const router = express.Router();
const convert = require("xml-js");
const request = require("request");
require("dotenv").config();

router.get("/covid19", getCovidNums);
router.post("/covid19", getCovidNums);

router.timeout = 5000;

function getCovidNums(req, res) {
  // 날짜 관련 코드 :: 2021-03-30 dongwon
  const parse_string = (date) =>
    date.toLocaleDateString().replaceAll(".", "").replaceAll(" ", "");

  let today = parse_string(new Date());

  let yesterDay = new Date();
  yesterDay.setTime(new Date().getTime() - 1 * 24 * 60 * 60 * 1000 * 5); // 몇일 전으로 돌리고 싶으면 * 일수를 해주면 됨.
  yesterDay = parse_string(yesterDay);

  const date_parse = (date) => date.slice(0, 4) + "0" + date.slice(4, 8);

  today = today.length !== 8 ? date_parse(today) : today;
  yesterDay = yesterDay.length !== 8 ? date_parse(yesterDay) : yesterDay;

  var serviceKey = process.env.SERVICE_KEY;

  var url =
    "http://openapi.data.go.kr/openapi/service/rest/Covid19/getCovid19InfStateJson";
  var queryParams =
    "?" +
    encodeURIComponent("serviceKey") +
    "=" +
    encodeURIComponent(serviceKey); /* Service Key*/
  queryParams +=
    "&" + encodeURIComponent("pageNo") + "=" + encodeURIComponent("1"); /* */
  queryParams +=
    "&" +
    encodeURIComponent("numOfRows") +
    "=" +
    encodeURIComponent("10"); /* */
  queryParams +=
    "&" +
    encodeURIComponent("startCreateDt") +
    "=" +
    encodeURIComponent(yesterDay); /* */
  queryParams +=
    "&" +
    encodeURIComponent("endCreateDt") +
    "=" +
    encodeURIComponent(today); /* */
  //   function ApiCall() {
  request(
    {
      url: url + queryParams,
      method: "GET",
    },
    function (error, response, body) {
      try {
        // console.log('Status', response.statusCode);
        // console.log('Headers', JSON.stringify(response.headers));
        // console.log('Reponse received');

        // json parse :: 2021-03-30 dongwon
        let result = body;
        var xmlToJson = convert.xml2json(result, {
          compact: true,
          spaces: 4,
        });
        let arr = JSON.parse(xmlToJson).response.body.items.item;
        // console.log(arr[0], "@@@@@@", arr[1], " @@@@ ", arr);

        // // 여러 날의 확진자수가 궁금할 때. :: 2021-03-30 dongwon
        for (let i = 0; i < arr.length - 1; i++) {
          // console.log(arr[i].stateDt._text)
          console.log(
            arr[i].stateDt._text,
            "일 확진자 : ",
            arr[i].decideCnt._text - arr[i + 1].decideCnt._text
          );
        }

        // 당일 확진자 수만 궁금할 때 :: 2021-03-30 dongwon
        console.log(
          arr[0].stateDt._text,
          "일 확진자 : ",
          arr[0].decideCnt._text - arr[1].decideCnt._text
        );
        today = arr[0].stateDt._text;
        res.status(200).send({
          data: {
            today,
            nums: arr[0].decideCnt._text - arr[1].decideCnt._text,
          },
        });
        console.log("-------------------");
      } catch (error) {
        console.log(error);
      }
    }
  );
  //   }
  //   res.send({ msg: arr });
}

module.exports = router;
