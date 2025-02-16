//필수 파일 import
import * as env from "./.env/env";
import * as interfaces from "./interface/interfaces";
import { debug } from "./tools/debug";
import { chatroom_menus_class, dropdown_class, feed_class } from "./class/class";
import { wrtn_api_class } from "./tools/sdk";
import { copyToClipboard,getClipboardTextModern } from "./tools/functions";
import { main } from "./main";
import { popup } from "./tools/popup";

//필수 class 선언
const wrtn = new wrtn_api_class();
const feed = new feed_class();
const menus = new chatroom_menus_class();
const dropdown = new dropdown_class();

//실체 기능 코드 넣어야하는부분

//main 함수 실행
main(feed,menus,dropdown);



