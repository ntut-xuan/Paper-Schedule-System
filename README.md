# Paper Schedule System'

## Installation

### Python Environment

You need a Python environments first.

```
python3 -m pip install -r requirements.txt
```

### Firebase Credential

You need a Firebase Credential and place it under `api/` folder.

### Run Application

Run the commands. (Only back-end currently)

```
cd api
flask --run -h 0.0.0.0 -p 8080
```

## Progress

| **工作類別** | **工作項目**                                                 | **天數** | **累積進度** | **完成** |
| ------------ | ------------------------------------------------------------ | :------: | :----------: | :--: |
| 後端         | 能夠使用北科入口網站進行登入。                               |    1     |    2.70%     |  V   |
| 後端         | 能夠從 firebase  取得目前的實驗室成員資料。                  |    2     |    8.11%     |  V   |
| 後端         | 能夠針對目前的實驗室成員配給身份（成員、管理員、教授…）。    |    2     |    13.51%    |  V   |
| 後端         | 能夠從 firebase取得下一次報告之時間、標題、DOI與負責人。     |    2     |    18.92%    |  V   |
| 後端         | 能夠使用排程在特定時間進行會議時間提醒。                     |    4     |    29.73%    |      |
| 後端         | 能夠新增、取得、修訂與刪除自己的報告時程。該資料將在firebase上進行刪除、修訂等操作。 |    4     |    40.54%    |      |
| 前端         | 能夠呈現首頁、具有navbar用於呈現目前具有的功能，並且具有登入功能。 |    2     |    45.95%    |      |
| 前端         | 首頁能夠呈現目前的公告。                                     |    2     |    51.35%    |      |
| 前端         | 登入能夠撰寫帳號與密碼，並且發送登入請求至後端。             |    2     |    56.76%    |      |
| 前端         | 具有行事曆頁面，用於呈現當前的報告行程。                     |    4     |    67.57%    |      |
| 前端         | 具有事件詳細Modal，用於呈現當前的報告人、報告標題、報告內容與報告論文檔案。 |    2     |    72.97%    |      |
| 前端         | 具有實驗室成員列表，用於呈現當前的實驗室成員們。             |    2     |    78.38%    |      |
| 前端         | 具有提交論文請求之頁面，用於提交論文報告請求，內容必須包含：標題、內容、DOI、論文報告檔案、時間。 |    4     |    89.19%    |      |
| 前端         | 具有查看自己提交的論文請求之頁面，具有進行刪除、修訂等相關操作。 |    4     |   100.00%    |      |
|              |                                                              |    37    |    |      |

