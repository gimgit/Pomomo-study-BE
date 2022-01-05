const { StudyTime, Room, PersonInRoom } = require("../models");

let a = 1400 / 60;
let b = 1400 % 60;
console.log(`${a}:${b}`);

//ㅅㅐ로고침, 중간 입장한 유저 시간 동기화
async function syncTimer(req, res) {
  const { roomId } = req.params;
  console.log(req.params);
  const timer = await Room.findOne({
    where: { roomId },
    exclude: ["roomPassword"],
    raw: true,
  });
  let [now, openAt] = [
    new Date(Date.now() + 9 * 60 * 60 * 1000),
    new Date(new Date(timer.openAt)),
  ];

  //공부 시작시간, 휴식 시작시간 계산
  let startPoints = [openAt.getTime() + 9 * 60 * 60 * 1000];
  for (let i = 1; i <= timer.round; i++) {
    startPoints.push(
      openAt.getTime() +
        9 * 60 * 60 * 1000 +
        timer.studyTime * i * 60 * 1000 +
        timer.recessTime * i * 60 * 1000
    );
  }
  let endPoints = [
    openAt.getTime() + 9 * 60 * 60 * 1000 + timer.studyTime * 60 * 1000,
  ];
  for (let i = 1; i <= timer.round; i++) {
    endPoints.push(startPoints[i] + timer.studyTime * 60 * 1000);
  }

  // startPoints.forEach((e) => {
  //   console.log(new Date(e));
  // });
  // endPoints.forEach((e) => {
  //   console.log(new Date(e));
  // });

  //라운드 시작까지 얼마나 남았는지 표시
  // let [startPoint, endPoint] = [
  //   // Date.now() + 9 * 60 * 60 * 1000,
  //   startPoints,
  //   // openAt.getTime() + 9 * 60 * 60 * 1000,
  //   openAt.getTime() + 9 * 60 * 60 * 1000 + timer.studyTime * 60 * 1000,
  // ];
  // console.log(new Date(Date.now()));

  // let [currentTime, startPoint, endPoint] = [
  //   Date.now(),
  //   new Date(new Date(openAt) + 0),
  //   new Date(openAt).getTime() + minutePerRound * 60 * 1000,
  // ];

  // 핵심
  // let i = 0;
  // let stage =
  //   (startPoints[0] - now) / 60 / 1000 / (timer.studyTime + timer.recessTime);
  // console.log(stage);
  // do {
  //   switch ((startPoints[i] - now) / 60 / 1000 < 0) {
  //     case true:
  //       console.log(
  //         `다음라운드는 ${(startPoints[i + 1] - now) / 60 / 1000}후에 시작`
  //       );
  //       break;
  //     case false:
  //       console.log(`시작 전${(startPoints[i] - now) / 60 / 1000}분 후 시작`);
  //       break;
  //   }
  //   i++;
  //   console.log(i);
  // } while (i > parseInt(timer.round));

  // let i = 0;
  let stage =
    (startPoints[0] - now) / 60 / 1000 / (timer.studyTime + timer.recessTime);
  // console.log(stage);
  let i = 0;
  let n = false;
  // do {
  //   // for (let i = 0; i < timer.round; i++) {
  if ((startPoints[i] - now) / 60 / 1000 < 0) {
    console.log(
      `시작함, 다음라운드는 ${
        ((startPoints[i] - now) / 60 / 1000) %
        (timer.studyTime + timer.recessTime)
      }후에 시작`
    );
  } else console.log(`시작 전 ${(startPoints[i] - now) / 60 / 1000}분 후 시작`);

  //   n == true;
  //   // }
  //   i++;
  // } while (n == true);

  // switch ((startPoints[i] - now) / 60 / 1000 < 0) {
  //   case true:
  //     console.log(
  //       `다음라운드는 ${(startPoints[i + 1] - now) / 60 / 1000}후에 시작`
  //     );
  //     break;
  //   case false:
  //     console.log(`시작 전${(startPoints[i] - now) / 60 / 1000}분 후 시작`);
  //     break;
  // }

  // for (i = 0; i <= timer.round; i++) {
  //   switch ((startPoint[i] - now) / 60 / 1000 < 0) {
  //     case true:
  //       console.log("시작함");
  //       console.log(`${(startPoint[i] - now) / 60 / 1000}분 후 시작`);
  //       break;
  //     case false:
  //       console.log("시작전");
  //       console.log(`${(startPoint[i] - now) / 60 / 1000}분 후 시작`);
  //       break;
  //   }
  // }
  // if ((startPoint[0] - now) / 60 / 1000 < 0) {
  // }
  // console.log((startPoints[0] - now) / 60 / 1000);
  // console.log((startPoints[1] - now) / 60 / 1000);

  // console.log(new Date(now));
  // console.log(new Date(startPoint));
  // console.log(new Date(endPoints));
}

async function addTime(req, res) {
  console.log("addTime");
  const { userId, roomId } = req.params;
  // const { userId, roomId } = req.body;

  const studyRoom = await Room.findOne({ where: { roomId: roomId } });
  const [studyTime, roomPurpose] = [studyRoom.studyTime, studyRoom.purpose];
  try {
    await StudyTime.create({
      userId: userId,
      studyTime: studyTime,
      purpose: roomPurpose,
    });
    res.status(201).send({ msg: "작성완료" });
  } catch (err) {
    console.log(err);
  }
}

module.exports = {
  syncTimer,
  addTime,
};
