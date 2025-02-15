import * as env from "../.env/env";
import * as frontHtml from "../.env/fronthtml";
import { debug } from "../tools/debug";

//디버그 버튼
export function debug_btn(){
    var debug_Interval = setInterval(()=>{
        if (document.URL == "https://wrtn.ai/character"){
            //프로필 누르면 나오는거
            var debug_modal = document.getElementsByClassName(env.profileBoxClass).item(0);
            //태그 검열 넣을 부분
            var tag_modal = document.getElementsByClassName(env.profileBoxMenuClass).item(0);
            if (debug_modal != null){
                if (debug_modal.childNodes.length == 3){
                    //디버그 버튼
                    var debug_modal_btn = debug_modal.childNodes[2].childNodes.item(0).cloneNode(true);
                    debug_modal_btn.textContent = `debug:${JSON.parse(String(localStorage.getItem(env.local_IsDebug))).IsDebug}`;
                    debug_modal_btn.addEventListener('click',()=>{
                        if (JSON.parse(String(localStorage.getItem(env.local_IsDebug))).IsDebug){
                            localStorage.setItem(env.local_IsDebug,JSON.stringify({
                                IsDebug: false
                            }))
                            debug("debug OFF");
                            debug_modal_btn.textContent = `debug:false`;
                        }
                        else {
                            localStorage.setItem(env.local_IsDebug,JSON.stringify({
                                IsDebug: true
                            }))
                            debug("debug ON");
                            debug_modal_btn.textContent = `debug:true`;
                        }
                        debug("debug_modal_btn",3);
                    })
                    debug_modal.insertBefore(debug_modal_btn,debug_modal.childNodes.item(2));
                    debug("web-modal founded");
                }
            }
            if (tag_modal != null){
                if (tag_modal.childNodes.length == 9){
                    //태그 버튼
                    var tag_button = tag_modal.childNodes.item(0).cloneNode(true);
                    tag_button.childNodes.item(1).textContent = "태그 검열";
                    tag_button.addEventListener('click',()=>{
                        document.getElementById("web-modal").remove();
                        const tag_modal = document.createElement("modal");
                        tag_modal.innerHTML = frontHtml.tag_modal_front_html;
                        tag_modal.setAttribute("style","position: relative !important;\n" +
                            "    z-index: 11 !important;");
                        var tag_modal_tabs: any = tag_modal.childNodes[0].childNodes[0].childNodes[0].childNodes.item(0);
                        var tag_modal_x: any = tag_modal_tabs.childNodes[0].childNodes.item(1);
                        var tag_modal_cancel: any = tag_modal_tabs.childNodes[2].childNodes.item(0);
                        var tag_modal_btn: any = tag_modal_tabs.childNodes[2].childNodes.item(1);
                        var tag_modal_textarea: any = tag_modal_tabs.childNodes[1].childNodes.item(1);

                        if (JSON.parse(localStorage.getItem(env.local_tag)).tags.length != 0){
                            var tags = JSON.parse(localStorage.getItem(env.local_tag)).tags;
                            console.log(tags);
                            var s = 1
                            for (const element of tags) {
                                if (s == tags.length){
                                    tag_modal_textarea.value = tag_modal_textarea.value + element;
                                }
                                else{
                                    tag_modal_textarea.value = tag_modal_textarea.value + element + ",";
                                }
                                s++
                            }
                        }
                        tag_modal_x.addEventListener('click',()=>{
                            tag_modal.remove();
                        })
                        tag_modal_cancel.addEventListener('click',()=>{
                            tag_modal.remove();
                        })
                        tag_modal_btn.addEventListener('click',()=>{
                            localStorage.setItem(env.local_tag,JSON.stringify({
                                tags : tag_modal_textarea.value.replace(" ","").split(",")
                            }))
                            alert("등록 성공!");
                            tag_modal.remove();
                            window.location.reload();
                        })
                        document.body.appendChild(tag_modal);
                    })
                    tag_modal.appendChild(tag_button);
                }
            }
        }
        else{
            clearInterval(debug_Interval);
        }
    },100)
    debug("debug_btn",0)
}