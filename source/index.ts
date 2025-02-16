import * as env from "./.env/env";
import * as tools from "./tools/functions";
import * as requests from "./tools/requests";
import { debug } from "./tools/debug";
import { chatroom_menus_class, dropdown_class, feed_class } from "./class/class";
import { wrtn_api_class } from "./tools/sdk";
import { main } from "./main";

const wrtn = new wrtn_api_class();
const feed = new feed_class();
const dropdown = new dropdown_class();
const menus = new chatroom_menus_class();

main(feed,menus,dropdown);







