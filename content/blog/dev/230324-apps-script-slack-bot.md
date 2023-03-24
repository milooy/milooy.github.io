---
title: Google Apps Script를 활용한 슬랙봇 만들기
description: 타입스크립트 챌린지를 슬랙에 쏴보자
date: "2023-03-24"
category: dev
---


## 개발 방법

1. [https://api.slack.com/apps](https://api.slack.com/apps) 에서 Create an app 버튼을 누릅니다.

![image](https://user-images.githubusercontent.com/3839771/227446510-06cec9d8-f3f1-471b-82dd-28262b690cfa.png)


2. From scratch를 누르고 원하는 App name, workspace를 적어줍니다.

![image](https://user-images.githubusercontent.com/3839771/227446600-45ffc371-97af-4170-a3bd-6c216214a809.png)


![image](https://user-images.githubusercontent.com/3839771/227446644-5a481dfd-94d7-4351-9177-f93ccb5d910e.png)


1. 좌측 메뉴에서 Incoming webhook을 누르고, Activate해줍니다. 관리자 권한이 필요한 슬랙이라면 관리자의 승인을 받아주세요.

![image](https://user-images.githubusercontent.com/3839771/227446718-7dc0f1e7-84f7-47bd-b62f-781a06424e66.png)


![image](https://user-images.githubusercontent.com/3839771/227446836-c6c3f62c-2e56-4de3-917d-b193a311eeef.png)


4. Incoming Webhooks 페이지에서 [Add new webhook to Workspace] 버튼을 누릅니다

![image](https://user-images.githubusercontent.com/3839771/227446921-458dc3d9-5d9c-4f53-8dec-fe586919bd41.png)


5. 메세지 전송을 원하는 채널을 선택합니다.

![image](https://user-images.githubusercontent.com/3839771/227447103-4bcb6a67-0eb0-41ac-904e-9d5c4730884a.png)


6. 웹훅 URL이 나왔어요. 이 URL을 이따 사용할거예요.

![image](https://user-images.githubusercontent.com/3839771/227447206-40d52dc9-dcc4-49ec-b864-a0e81f2bb959.png)


7. 푸시를 원하는 메세지 디비를 구글닥스로 만들어줍니다. 그리고 메뉴에서 확장 프로그램 > Apps Scripts를 눌러줍니다.

![image](https://user-images.githubusercontent.com/3839771/227447287-35caddf2-1a9a-4114-b6ee-50968f3f3501.png)


8. 스프레드시트를 읽어 원하는 슬랙 채널에 메세지를 보내는 코드를 작성합니다. url에는 아까 만든 웹훅 URL을 적어주고, 원하는 채널명도 바꿔서 적어줍니다. 아래 코드를 참고해주세요.

![image](https://user-images.githubusercontent.com/3839771/227447338-c03b7a74-d896-4f35-87f7-16439bbe986d.png)


멋진 코드를 작성해주신 토스증권의 나소인 님 감사해요!
```jsx
function sendtoslack() {
  var today = new Date();
  
  Logger.log(today);

  var url = "https://hooks.slack.com/services/T03FE7QJV/당신의웹훅URL"; 

  var sheet = SpreadsheetApp.getActive().getSheetByName('list');
  var dataRange = sheet.getDataRange();
  var values = dataRange.getValues();
  
  var searchValue = "0";
  var updateValue = "1";
  var updateColumn = 1; // the column number to update
  
  var updateRow = -1; // initialize to -1 to indicate value not found

  var totalCount = values.length;
  var currentCount = 0;
  
  for (var i = 0; i < values.length; i++) {
    currentCount++;
    if (values[i][0] == searchValue) {
      updateRow = i + 1; // add 1 to convert from 0-indexed to 1-indexed
      break;
    }
  }
  
  if (updateRow != -1) {
    var rangeToUpdate = sheet.getRange(updateRow, updateColumn, 1, 1);
    rangeToUpdate.setValue(updateValue);
  }

  var values = sheet.getRange(updateRow, updateColumn, 1, 5).getValues();
  var value = values[0];

  var payload = {
    "channel": "#원하는채널명",
    "blocks": [
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": "> _점심을 꽤나 둔둔하게 드신 모양이로군._\n> _후식으로 간단한 타입챌린지 하나 풀고가시게._\n"
        }
      },
      {
        "type": "divider"
      },
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": `:ts-boom: *[${value[1]}] ${value[2]}* (${currentCount - 2}/${totalCount - 2}) <${value[4]}|🔗>`
        },
        "accessory": {
          "type": "button",
          "style": "primary",
          "text": {
            "type": "plain_text",
            "text": "문제풀러가기🧩",
            "emoji": true
          },
          "url": `https://tsch.js.org/${value[3]}/play/ko`,
        }
      },
      {
        "type": "divider"
      }
    ]
  };

  Logger.log(payload);

  var options = {
    "method": "post",
    "contentType": "application/json",
    "payload": JSON.stringify(payload)
  };
  
  return UrlFetchApp.fetch(url,options);
  }
```
    

9. [실행]을 누르면 테스트해보실 수 있어요.

![image](https://user-images.githubusercontent.com/3839771/227447391-8b29d4da-84be-475d-9e56-47c4f4f97103.png)


10. 시계 모양 아이콘을 눌러 트리거 페이지에 들어가고, [트리거 추가]버튼을 눌러 원하는 트리거 기준을 설정해줍니다.

![image](https://user-images.githubusercontent.com/3839771/227447469-6a9f5205-82dd-4729-acfd-b567c1b5b10d.png)


11. 완료! 고생하셨어요.

![image](https://user-images.githubusercontent.com/3839771/227447522-cdf58e8f-1973-488e-ac08-79c498313d9b.png)


# 참고

- [https://www.august.com.au/blog/how-to-send-slack-alerts-from-google-sheets-apps-script/](https://www.august.com.au/blog/how-to-send-slack-alerts-from-google-sheets-apps-script/)