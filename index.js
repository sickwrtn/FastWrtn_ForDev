/*
제작자 : 뤼튼병자
#설명 및 제작 취지
원래는 이렇게 많은 기능을 추가할생각이 없었는데 만들다보니 기능이 다양해졌네요.
제가 크롬 확장프로그램을 만들어 보는게 처음이고 프론트 엔드, 백엔드 둘다 해보는것도 처음이라 많이 힘들게 개발중이네요...
그래도 생각보다 할만하긴 합니다. 공익적 목적으로 만드는 프로그램이라 뿌듯하기도 하구요.
코딩 시작을 자바로 하긴 했다만 제가 py C# 쪽에만 능해서 코드 세분화랑 함수화를 1도 안했습니다...
정리 해야하긴 하나 엄두가 안나서... (주석 다 다는데 2시간 걸림)
언제 한번 시간 되면 날잡고 코드정리랑 하겠습니다! 코드 기여 하고싶으시면 하셔도 되요 보고 수정하겠습니다.
#마지막으로...
이 코드를 보실분들은 없을거라고 생각하긴 하지만 만약 보시는 분이 계시다면
후원 계좌 : 카카오뱅크 3333-31-5207450 인태호
로 작은 금액이라도 후원해 주시면 감사하겠습니다...
제가 백수기도 하고... 코드 에디터 구독할 돈도 없어서...
파이참 에디터로 코딩하는데 무료체험판 끝나니까 결제하라고 계속 알림 띄워주네요...
저도 후원 받는게 부끄럽고 죄송스럽긴 하지만 부탁드립니다!
*/



//real-time apply
var lastest = "";
setInterval(()=>{
    //character
    if (lastest != document.URL){
        if (document.URL == "https://wrtn.ai/character"){
            main();
        }
    }
    //character/u
    const targetDiv = document.getElementsByClassName("css-d7pngb").item(0);
    if (targetDiv != null) {
        if (targetDiv.childNodes.length < 5) {
            main();
        }
    }
    //character/my
    if (lastest != document.URL){
        if (document.URL.split("/")[4] == "my"){
            main();
        }
    }
    //character/builder
    if (lastest != document.URL){
        if (document.URL.split("/")[4] != undefined){
            if (document.URL.split("/")[4].split("?")[0] == "builder"){
                main();
            }
        }
    }
    lastest = document.URL;
},1000)

function main(){

    //쿠키 가져오는 함수
    function getCookie(name) {
      let matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
      ));
      return matches ? decodeURIComponent(matches[1]) : undefined;
    }

    //채팅방 기능
    if (document.URL.split("/")[4] == "u"){
        const targetDiv = document.getElementsByClassName("css-d7pngb").item(0); //채팅바
        const NS = document.getElementsByClassName("css-13yljkq").item(0); // 파란색 -> 버튼
        const NBS = NS.cloneNode(true); // + 버튼
        const NBS_E = NS.cloneNode(true); // - 버튼
        const Cm = NBS.childNodes.item(0).childNodes.item(0); // + 버튼 svg
        const Cm_E = NBS_E.childNodes.item(0).childNodes.item(0); // - 버튼 svg
        const bar = document.getElementsByClassName("css-1diwz7b").item(0); // 채팅방 메뉴바
        const bar_c = bar.childNodes[1].childNodes[0].childNodes[1]; // 채팅방 메뉴 내부
        const persona = bar.childNodes[1].childNodes[0].childNodes[1].childNodes.item(0).cloneNode(true); // 페르소나
        var l = []
        const persona_p = persona.childNodes.item(1); // 페르소나 내부 text
        persona_p.textContent = "[페르소나]";
        const persona_svg = persona.childNodes.item(0); // 페르소나 svg
        const persona_path = persona_svg.childNodes.item(0); // 페르소나 path
        var personal_modal = document.createElement("div"); //모달팝업
        personal_modal.setAttribute("id","web-modal");
        document.body.appendChild(personal_modal); // body에 모달팝업 추가

        //페스로나 svg.path에 원래는 유저노트 svg.path가 존재해서 제거
        for (let i = 0; i < 4; i++) {
            persona_svg.childNodes[1].remove();
        }

        //페르소나 svg 추가
        persona_path.setAttribute("d","M 12 2 C 7 2 4 4 4 7 V 11 C 4 16 8 20 12 20 C 16 20 20 16 20 11 V 7 C 20 4 17 2 12 2 Z Z Z M 9 14 C 9 13.5 10.5 13 12 13 C 13.5 13 15 13.5 15 14 C 15 14.5 14 15 12 15 C 10 15 9 14.5 9 14 Z M 6 9 L 8 8 C 8 8 9 8 10 9 C 9.3333 9.3333 9 10 8 10 L 8 10 C 7 10 6 10 6 9 C 6 9 6 9 6 9 C 6 9 7 8 8 8 M 14 9 C 15 8 16 8 16 8 C 17 8 18 9 18 9 C 18 10 17 10 16 10 C 15 10 14.6667 9.3333 14 9")
        persona.addEventListener('click',persona_change);
        bar_c.appendChild(persona);
        //+버튼 추가
        Cm.setAttribute("d","M 12 12 L 12 7 L 14 7 L 14 12 L 19 12 L 19 14 L 14 14 L 14 19 L 12 19 L 12 14 L 7 14 L 7 12 L 12 12");
        targetDiv.appendChild(NBS);
        NBS.addEventListener('click',clicked);
        //-버튼 추가
        Cm_E.setAttribute("d","M 12 12 L 7 12 L 7 14 L 19 14 L 19 12 L 12 12");
        targetDiv.appendChild(NBS_E);
        NBS_E.addEventListener('click',E_clicked);
        //파란색 -> 버튼을 맨 끝으로
        targetDiv.appendChild(NS);

        //+버튼 클릭시
        function clicked() {
            if (l.length == 9){
                return alert("9개가 최대 입니다.");
            }
            const vsm = document.getElementsByTagName("textarea").item(0); //채팅바
            if (vsm.value == ''){
                return alert("내용 입력후 추가해주세요");
            }
            const vsmc = document.createElement("div"); // 1~9버튼 추가
            vsmc.setAttribute("display","flex");
            vsmc.setAttribute("class","css-13yljkq");
            vsmc.setAttribute("id",`${l.length}`);
            vsmc.append(`${l.length + 1}`);
            l[l.length] = [l.length,vsm.value]
            // 1~9 버튼 클릭시
            function v_clicked() {
                const vsm2 = document.getElementsByTagName("textarea").item(0);
                vsm2.value = l[vsmc.id][1];
            }
            vsmc.addEventListener("click",v_clicked);
            targetDiv.appendChild(vsmc);
            targetDiv.appendChild(NBS_E);
            targetDiv.appendChild(NS);
        }

        //-버튼 클릭시
        function E_clicked() {
            const a = document.getElementById(`${l.length-1}`);
            a.remove();
            l.pop();
        }

        window.addEventListener("keydown", keysPressed, false);
        window.addEventListener("keyup", keysReleased, false);

        var keys = [];

        function keysPressed(e) {
            keys[e.keyCode] = true;

            for (let i = 0; i < 58; i++) {
                 if (keys[17] && keys[49 + i] && l.length > i) {
                    const vsm = document.getElementsByTagName("textarea").item(0);
                    vsm.value = l[i][1];
                    e.preventDefault();	 // prevent default browser behavior
                }
            }
        }
        function keysReleased(e) {
            keys[e.keyCode] = false;
        }
        //페르소나 버튼 누를시
        function persona_change(){
            //유저 wrtnUid가져오기
            fetch('https://api.wrtn.ai/be/user',{
              method: "GET",
              headers: {
                "Authorization": `Bearer ${getCookie("access_token")}`,
              }}).then(res => res.json()).then(data => {
                  //유저 id가져오기
                  fetch(`https://api.wrtn.ai/be/character-profiles/${data.data.wrtnUid}`,{
                      method: "GET",
                      headers: {
                        "Authorization": `Bearer ${getCookie("access_token")}`,
                      }
                }).then(res=>res.json()).then(data=>{
                    const pid = data.data._id;
                    //유저 id를 사용해 페르소나 목록 조회
                    fetch(`https://api.wrtn.ai/be/character-profiles/${data.data._id}/character-chat-profiles`,{
                      method: "GET",
                      headers: {
                        "Authorization": `Bearer ${getCookie("access_token")}`,
                      }
                    }).then(res=>res.json()).then(data=>{
                        if (bar_c.childNodes.length > 1){
                            for (let i = bar_c.childNodes.length - 1; i > 1 ; i--) {
                                bar_c.childNodes[2].remove();
                            }
                        }
                        c = 0;
                        for (const datum of data.data.characterChatProfiles) {
                            const personaL = persona.cloneNode(true); //페르소나 목록 요소
                            const for_personaL = document.createElement("div");//페르소나 한칸 띄우기
                            personaL.insertBefore(for_personaL,personaL.childNodes[0]);
                            const personaL_p = personaL.childNodes.item(2); //페르소나 text
                            //대표 프로필일 경우 '<-' 붙이기 아니면 없음
                            if (datum.isRepresentative){
                             personaL_p.textContent = `${datum.name} <-`;
                            }
                            else {
                                personaL_p.textContent = datum.name;
                            }
                            personaL.setAttribute("id",`${c}`) //페르소나 요소 id 지정
                            //페르소나 목록을 누를시
                            function personaL_change(){
                                var mpid = "";
                                m_i = 0;
                                for (m of data.data.characterChatProfiles) {
                                    if (`${m_i}` == personaL.id) {
                                        var mpid = m._id; //뭔지 모르겠지만 혹시몰라서 안지움
                                        var name = m.name; //페르소나 이름 가져오기
                                        var information = m.information; //페르소나 정보 가져오기
                                    }
                                    m_i++;
                                }
                                var personaL_change_modal = document.createElement("modal");//페르소나 모달 팝업
                                personaL_change_modal.innerHTML = "<div style=\"position: fixed; inset: 0px; z-index: -1; background-color: var(--color_bg_dimmed); cursor: default;\"><div style=\"align-items: flex-end; width: 100%; height: 100%; display: flex; -webkit-box-align: center; align-items: center; -webkit-box-pack: center; justify-content: center; position: relative;\"><div width=\"100%\" display=\"flex\" style=\"    width: 600px;\n" +
                                    "    max-width: calc(100% - 40px);\n" +
                                    "    background-color: var(--color_surface_elevated);\n" +
                                    "    max-height: 90dvh;\n" +
                                    "    overflow-y: auto;\n" +
                                    "    z-index: 15;\n" +
                                    "    border-width: initial;\n" +
                                    "    border-style: none;\n" +
                                    "    border-image: initial;\n" +
                                    "    border-color: var(--color_outline_secondary);\n" +
                                    "    border-radius: 12px;\n" +
                                    "    box-shadow: none;\n" +
                                    "    display: flex;\n" +
                                    "    flex-direction: column;\"><div display=\"flex\" style=\"    display: flex;\n" +
                                    "    flex-direction: column;\n" +
                                    "    -webkit-box-align: center;\n" +
                                    "    align-items: center;\n" +
                                    "    text-align: center;\"><div display=\"flex\" width=\"100%\" style=\"    display: flex;\n" +
                                    "    flex-direction: row;\n" +
                                    "    padding: 20px 24px;\n" +
                                    "    -webkit-box-align: center;\n" +
                                    "    align-items: center;\n" +
                                    "    -webkit-box-pack: justify;\n" +
                                    "    justify-content: space-between;\n" +
                                    "    width: 100%;\n" +
                                    "    border-bottom: 1px solid rgb(97, 96, 90);\"><p color=\"$color_text_primary\" style=\"    color: var(--color_text_primary);\n" +
                                    "    font-size: 20px;\n" +
                                    "    line-height: 100%;\n" +
                                    "    font-weight: 600;\">페르소나 수정</p><svg width=\"26\" height=\"26\" viewBox=\"0 0 24 25\" fill=\"currentColor\" xmlns=\"http://www.w3.org/2000/svg\" color=\"#a8a69dff\" cursor=\"pointer\" id=\"W_x\"><path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M12 11.0228L7.05026 6.07305L5.63604 7.48726L10.5858 12.437L5.63604 17.3868L7.05026 18.801L12 13.8512L16.9498 18.801L18.364 17.3868L13.4142 12.437L18.364 7.48726L16.9498 6.07305L12 11.0228Z\" fill=\"currentColor\"></path></svg></div><div display=\"flex\" width=\"100%\" style=\"    display: flex;\n" +
                                    "    flex-direction: column;\n" +
                                    "    padding: 20px;\n" +
                                    "    width: 100%;\n" +
                                    "    gap: 12px;\"><div display=\"flex\" style=\"    display: flex;\n" +
                                    "    flex-direction: column;\n" +
                                    "    gap: 8px;\"><p color=\"$color_text_primary\" style=\"    color: var(--color_text_primary);\n" +
                                    "    text-align: left;\n" +
                                    "    font-size: 16px;\n" +
                                    "    line-height: 100%;\n" +
                                    "    font-weight: 600;\">이름</p></div><textarea height=\"26px\" maxlength=\"12\" color=\"$color_text_primary\" placeholder=\"잊으면 안되는 중요한 내용, 추가하고 싶은 설정 등\" rows=\"5\" wrap=\"hard\" style=\"color: var(--color_text_primary);height: 26px; border-radius: 5px; border-width: 1px; border-style: solid; border-image: initial; border-color: var(--color_outline_secondary); background-color: var(--color_surface_ivory); padding: 11px 16px; min-height: 50px; max-height: 386px; font-size: 16px; line-height: 160%; font-weight: 500; resize: none; outline: none; caret-color: var(--color_text_brand);\" class=\"css-wmzh35\" id=\"W_name\"></textarea><div display=\"flex\" style=\"    display: flex;\n" +
                                    "    flex-direction: column;\n" +
                                    "    gap: 8px;\"><p color=\"$color_text_primary\" style=\"    color: var(--color_text_primary);\n" +
                                    "    text-align: left;\n" +
                                    "    font-size: 16px;\n" +
                                    "    line-height: 100%;\n" +
                                    "    font-weight: 600;\">정보</p></div><textarea height=\"26px\" maxlength=\"100\" placeholder=\"잊으면 안되는 중요한 내용, 추가하고 싶은 설정 등\" rows=\"5\" wrap=\"hard\" style=\"color: var(--color_text_primary);height: 26px; border-radius: 5px; border-width: 1px; border-style: solid; border-image: initial; border-color: var(--color_outline_secondary); background-color: var(--color_surface_ivory); padding: 11px 16px; min-height: 100px; max-height: 386px; font-size: 16px; line-height: 160%; font-weight: 500; resize: none; outline: none; caret-color: var(--color_text_brand);\" color=\"$color_text_primary\" class=\"css-wmzh35\" id=\"W_info\"></textarea></div><div display=\"flex\" width=\"100%\" style=\"    display: flex;\n" +
                                    "    flex-direction: row;\n" +
                                    "    width: 100%;\n" +
                                    "    -webkit-box-pack: end;\n" +
                                    "    justify-content: flex-end;\n" +
                                    "    gap: 8px;\n" +
                                    "    padding: 12px 20px 20px;\"><button display=\"flex\" width=\"100%\" height=\"40px\" color=\"$color_text_primary\" id=\"W_close\" style=\"    border-radius: 5px;\n" +
                                    "    -webkit-box-pack: center;\n" +
                                    "    justify-content: center;\n" +
                                    "    -webkit-box-align: center;\n" +
                                    "    align-items: center;\n" +
                                    "    display: flex;\n" +
                                    "    flex-direction: row;\n" +
                                    "    gap: 8px;\n" +
                                    "    width: 100%;\n" +
                                    "    border: 1px solid transparent;\n" +
                                    "    padding: 0px 20px;\n" +
                                    "    height: 40px;\n" +
                                    "    background-color: var(--color_surface_tertiary);\n" +
                                    "    color: var(--color_text_primary);\n" +
                                    "    font-size: 16px;\n" +
                                    "    line-height: 100%;\n" +
                                    "    font-weight: 600;\n" +
                                    "    cursor: pointer;\"><div display=\"flex\" style=\"    display: flex;\n" +
                                    "    flex-direction: row;\n" +
                                    "    gap: 8px;\n" +
                                    "    -webkit-box-align: center;\n" +
                                    "    align-items: center;\">닫기</div></button><button display=\"flex\" width=\"100%\" height=\"40px\" color=\"$color_text_ivory\" id=\"W_sumbit\" style=\"    border-radius: 5px;\n" +
                                    "    -webkit-box-pack: center;\n" +
                                    "    justify-content: center;\n" +
                                    "    -webkit-box-align: center;\n" +
                                    "    align-items: center;\n" +
                                    "    display: flex;\n" +
                                    "    flex-direction: row;\n" +
                                    "    gap: 8px;\n" +
                                    "    width: 100%;\n" +
                                    "    border: 1px solid transparent;\n" +
                                    "    padding: 0px 20px;\n" +
                                    "    height: 40px;\n" +
                                    "    background-color: var(--color_surface_primary);\n" +
                                    "    color: var(--color_text_ivory);\n" +
                                    "    font-size: 16px;\n" +
                                    "    line-height: 100%;\n" +
                                    "    font-weight: 600;\n" +
                                    "    cursor: pointer;\"><div display=\"flex\" style=\"    display: flex;\n" +
                                    "    flex-direction: row;\n" +
                                    "    gap: 8px;\n" +
                                    "    -webkit-box-align: center;\n" +
                                    "    align-items: center;\">등록</div></button></div></div></div></div></div>"
                                personal_modal.setAttribute("style","position: relative !important;\n" +
                                    "    z-index: 11 !important;") //이게 있어야 모달이 작동함
                                personal_modal.appendChild(personaL_change_modal.firstChild);
                                var personal_modal_name = document.getElementById("W_name"); //모달 내부 이름 textarea
                                personal_modal_name.value = name;
                                var personal_modal_info = document.getElementById("W_info"); //모달 내부 정보 textarea
                                personal_modal_info.value = information;
                                var personal_modal_Sbtn = document.getElementById("W_sumbit"); //모달 내부 등록 버튼
                                var personal_modal_Cbtn = document.getElementById("W_close"); //모달 내부 닫기 버튼
                                var personal_modal_x = document.getElementById("W_x"); //모달 내부 x버튼
                                //모달 등록버튼을 눌렀을시
                                personal_modal_Sbtn.addEventListener("click",()=>{
                                    //모달의 내용을 조합해 페르소나 등록 및 대표프로필로 설정
                                    fetch(`https://api.wrtn.ai/be/character-profiles/${pid}/character-chat-profiles/${mpid}`,{
                                     method: "PATCH",
                                      headers: {
                                        "Authorization": `Bearer ${getCookie("access_token")}`,
                                          "Content-Type": "application/json",
                                      },
                                      body: JSON.stringify({
                                        isRepresentative: true,
                                          name: personal_modal_name.value,
                                          information: personal_modal_info.value,
                                      })
                                    }).then(res=>res.json()).then(data=>{
                                        if (data.result == "SUCCESS"){
                                            alert("페르소나 등록 성공!");
                                            personal_modal.childNodes.item(0).remove();
                                            persona_change();
                                        }
                                        else{
                                            alert("페르소나 등록 실패!");
                                            personal_modal.childNodes.item(0).remove();
                                        }
                                    })
                                })
                                //모달 내부 닫기버튼 눌렀을시
                                personal_modal_Cbtn.addEventListener("click",()=>{
                                    personal_modal.childNodes.item(0).remove();
                                })
                                //모달 내부 x버튼 눌렀을시
                                personal_modal_x.addEventListener("click",()=>{
                                    personal_modal.childNodes.item(0).remove();
                                })
                            }
                            personaL.addEventListener('click',personaL_change);
                            personaL.addEventListener('dbclick',personaL_change_double);
                            bar_c.appendChild(personaL);
                            c++;
                        }
                      })
                  })
            });
        }
    }

    // 클립보드의 텍스트를 가져오기
    function getClipboardTextModern() {
        return navigator.clipboard.readText(); // 붙여넣기
    }

    // 텍스트를 클립보드에 복사하기
    function copyToClipboard(text) {
        navigator.clipboard.writeText(text) // 복사하기
            .then(() => {
                console.log('클립보드에 복사되었습니다.');
            })
            .catch(err => {
                console.error('클립보드 복사에 실패했습니다:', err);
            });
    }

    //캐릭터 관리
    if (document.URL.split("/")[4] == "my"){
        /*
        여러번 수정 끝에 만들어 낸거임
        계속 copy to json,copy to paste 버튼을 누르면 selected가 요소 인덱스 범위보다 1더 커지는
        개애미뒤진 병신같은 쓰레기 조자년 버그가 발생함
        진짜 눈물 질질 새면서 처만드느라 뒤질뻔 했네 시발
        고친거 라기 보다는 현재도 opend 변수가 없으면 생기는 버그임 시발
        도대체 왜?
         */
        var selected = 0; //점 세개 퍼튼이 어떤 요소의 버튼인지 판별하는 번수
        opend=false; //구원자
        setInterval(()=>{
            var myTdiv = document.getElementsByClassName("css-j7qwjs"); //점 세개 버튼
            var tipbar = document.getElementsByClassName("css-1w2weol"); //dropdown 목록
            //드랍다운이 있는지 없는지
            if (tipbar != null){
                var tipbar_struct = document.getElementsByClassName("css-1wh9bd4").item(0); //드랍다운 내부 요소 (형식용)
                //화이트 테마일시
                if (tipbar_struct == null){
                    tipbar_struct = document.getElementsByClassName("css-zklud").item(0); //화이트 테마용 드랍다운 내부요소 (형식용)
                }
                //드랍다운 내부에 copy to json, copy to paste, publish 추가
                if (tipbar_struct != null){
                    //드랍다운이 일정 개수 이상 늘어나지 않도록 하는 조건문 5 가 아니라 3이여도 작동할듯
                    if (tipbar.item(0).childNodes.length < 5) {
                        var tipbar_copy = tipbar_struct.cloneNode(true); //copy to json 버튼
                        var tipbar_paste = tipbar_struct.cloneNode(true); //copy to paste 버튼
                        var tipbar_clone = tipbar_struct.cloneNode(true); //publish 버튼
                        //copy to json
                        //copy to json가 현재 없다면
                        if (tipbar.item(0).childNodes.item(2) == null){
                            tipbar_copy.childNodes.item(0).textContent = "copy to json";
                            //copy to json 클릭시
                            tipbar_copy.addEventListener('click',()=>{
                                //유저가 제작한 캐챗 목록을 10000개 조회함 (설마 이것보다 많이 만든 사람이 있겠어?)
                                fetch('https://api.wrtn.ai/be/characters/me?limit=10000',{
                                    method: "GET",
                                    headers: {
                                        "Authorization": `Bearer ${getCookie("access_token")}`,
                                    },
                                }).then(res => res.json()).then(data => {
                                    i=0;
                                    for (const datum of data.data.characters) {
                                        //조회한 캐챗을 가져옴
                                        if (i == selected){
                                            //캐챗 id를 사용해서 캐챗의 모든 정보를 가져온후 클립보드에 복사
                                            fetch(`https://api.wrtn.ai/be/characters/me/${datum._id}`,{
                                                method: "GET",
                                                headers: {
                                                    "Authorization": `Bearer ${getCookie("access_token")}`,
                                                },
                                            }).then(res => res.json()).then(data => {
                                                console.log(data);
                                                copyToClipboard(JSON.stringify(data.data));
                                                alert('클립보드에 복사되었습니다!');
                                            })
                                        }
                                        i++;
                                    }
                                })
                            })
                            tipbar.item(0).appendChild(tipbar_copy);
                        }
                        //paste to json
                        //paste to json가 없다면
                        if (tipbar.item(0).childNodes.item(3) == null){
                            tipbar_paste.childNodes.item(0).textContent = "paste to json";
                            //paste to json 클릭시
                            tipbar_paste.addEventListener('click',()=>{
                                //유저가 제작한 캐챗 목록을 10000개 조회함 (설마 이것보다 많이 만든 사람이 있겠어?)
                                fetch('https://api.wrtn.ai/be/characters/me?limit=1000',{
                                    method: "GET",
                                    headers: {
                                        "Authorization": `Bearer ${getCookie("access_token")}`,
                                    },
                                }).then(res => res.json()).then(data => {
                                    i = 0;
                                    for (const datum of data.data.characters) {
                                        //조회한 캐챗을 가져옴
                                        if (i == selected) {
                                            //클립보드를 가져옴
                                            getClipboardTextModern().then(function (clipboardContent) {
                                                json_data = JSON.parse(clipboardContent); //클립보드 내용 json화
                                                //startingSets에 _id 항목이 있는데 이게 있으면 안되서 지우는거
                                                for (const a of json_data.startingSets) {
                                                    delete a._id;
                                                }
                                                //json화 시킨 캐릭터챗 정보를 덮어 씌움
                                                fetch(`https://api.wrtn.ai/be/characters/${datum._id}`, {
                                                    method: "PATCH",
                                                    headers: {
                                                        "Authorization": `Bearer ${getCookie("access_token")}`,
                                                        "Content-Type": "application/json",
                                                    },
                                                    body: JSON.stringify({
                                                        name: json_data.name,
                                                        description: json_data.description,
                                                        profileImageUrl: json_data.profileImage.origin,
                                                        model: json_data.model,
                                                        initialMessages: json_data.initialMessages,
                                                        characterDetails: json_data.characterDetails,
                                                        replySuggestions: json_data.replySuggestions,
                                                        chatExamples: json_data.chatExamples,
                                                        situationImages: json_data.situationImages,
                                                        categoryIds: [json_data.categories[0]._id],
                                                        tags: json_data.tags,
                                                        visibility: json_data.visibility,
                                                        promptTemplate: json_data.promptTemplate.template,
                                                        isCommentBlocked: json_data.isCommentBlocked,
                                                        defaultStartingSetName: json_data.defaultStartingSetName,
                                                        startingSets: json_data.startingSets,
                                                        keywordBook: json_data.keywordBook,
                                                        customPrompt: json_data.customPrompt,
                                                        defaultStartingSetSituationPrompt: json_data.defaultStartingSetSituationPrompt,
                                                    })
                                                }).then(res => res.json).then(data => {
                                                    alert("캐챗 변경 성공! (새로고침 후 적용됩니다.)");
                                                })
                                            })
                                        }
                                        i++
                                    }
                                })
                            })
                            tipbar.item(0).appendChild(tipbar_paste);
                        }
                        //publish
                        //publish가 없다면
                        if (tipbar.item(0).childNodes.item(4) == null){
                            tipbar_clone.childNodes.item(0).textContent = "publish";
                            tipbar_clone.addEventListener("click",()=> {
                                //유저가 제작한 캐챗 목록을 10000개 조회함 (설마 이것보다 많이 만든 사람이 있겠어?)
                                fetch('https://api.wrtn.ai/be/characters/me?limit=10000',{
                                    method: "GET",
                                    headers: {
                                        "Authorization": `Bearer ${getCookie("access_token")}`,
                                    },
                                }).then(res => res.json()).then(data => {
                                    i=0;
                                    for (const datum of data.data.characters) {
                                        //조회한 캐챗을 가져옴
                                        if (i == selected){
                                            //새 캐챗을 만듬
                                            fetch(`https://api.wrtn.ai/be/characters/me/${datum._id}`,{
                                                method: "GET",
                                                headers: {
                                                    "Authorization": `Bearer ${getCookie("access_token")}`,
                                                },
                                            }).then(res => res.json()).then(data => {
                                                json_data = data.data; //기본 캐챗의 json데이터
                                                //startingSets의 _id가 있으면 안되서 지움
                                                for (const a of json_data.startingSets) {
                                                    delete a._id;
                                                }
                                                /*
                                                새로운 캐릭터챗을 만들때랑
                                                기존 캐릭터챗을 수정하는거랑
                                                보내야되는 json 데이터가 다름
                                                거기다 보내야 되는 내용에 startingSets가 []이면 안되더라
                                                startingSets가 없거나 아면 요소가 하나 이상 있어야됨
                                                 */
                                                //위의 내용에 의거하여 startingSets가 []인지 아닌지 판별
                                                if (json_data.startingSets.length == 0){
                                                    json_body = JSON.stringify({
                                                        name: json_data.name,
                                                        description: json_data.description,
                                                        profileImageUrl: json_data.profileImage.origin,
                                                        model: json_data.model,
                                                        initialMessages: json_data.initialMessages,
                                                        characterDetails: json_data.characterDetails,
                                                        replySuggestions: json_data.replySuggestions,
                                                        chatExamples: json_data.chatExamples,
                                                        situationImages: json_data.situationImages,
                                                        categoryIds: [json_data.categories[0]._id],
                                                        tags: json_data.tags,
                                                        visibility: "public",
                                                        promptTemplate: json_data.promptTemplate.template,
                                                        isCommentBlocked: json_data.isCommentBlocked,
                                                        defaultStartingSetName: json_data.defaultStartingSetName,
                                                        keywordBook: json_data.keywordBook,
                                                        customPrompt: json_data.customPrompt,
                                                        defaultStartingSetSituationPrompt: json_data.defaultStartingSetSituationPrompt,
                                                        isAdult: json_data.isAdult,
                                                    })
                                                }
                                                else{
                                                    json_body = JSON.stringify({
                                                        name: json_data.name,
                                                        description: json_data.description,
                                                        profileImageUrl: json_data.profileImage.origin,
                                                        model: json_data.model,
                                                        initialMessages: json_data.initialMessages,
                                                        characterDetails: json_data.characterDetails,
                                                        replySuggestions: json_data.replySuggestions,
                                                        chatExamples: json_data.chatExamples,
                                                        situationImages: json_data.situationImages,
                                                        categoryIds: [json_data.categories[0]._id],
                                                        tags: json_data.tags,
                                                        visibility: "public",
                                                        promptTemplate: json_data.promptTemplate.template,
                                                        isCommentBlocked: json_data.isCommentBlocked,
                                                        defaultStartingSetName: json_data.defaultStartingSetName,
                                                        startingSets: json_data.startingSets,
                                                        keywordBook: json_data.keywordBook,
                                                        customPrompt: json_data.customPrompt,
                                                        defaultStartingSetSituationPrompt: json_data.defaultStartingSetSituationPrompt,
                                                        isAdult: json_data.isAdult,
                                                    })
                                                }
                                                //캐릭터챗 만들기
                                                fetch("https://api.wrtn.ai/be/characters",{
                                                    method: "POST",
                                                    headers: {
                                                        "Authorization": `Bearer ${getCookie("access_token")}`,
                                                        "Content-Type": "application/json",
                                                    },
                                                    body: json_body,
                                                }).then(res => res.json()).then(data => {
                                                    alert("캐챗 공개 성공! (새로고침 후 적용됩니다.)");
                                                })
                                            })
                                        }
                                        i++;
                                    }
                                })
                            })
                            tipbar.item(0).appendChild(tipbar_clone);
                        }
                    }
                    opend=true;
                }
                else {
                    opend = false;
                }
            }
            else{
            }
            //모든 점세개에 클릭 이벤트리스너를 추가
            i=0;
            for (const myTdivElement of myTdiv) {
                if (myTdivElement.id == ""){
                    myTdivElement.setAttribute("id",i)
                    myTdivElement.addEventListener('click',()=>{
                        j=0;
                        var myTdiv2 = document.getElementsByClassName("css-j7qwjs");
                        for (const argument of myTdiv2) {
                            if (argument==myTdivElement){
                                if (j != myTdiv2.length){
                                    if (!opend){
                                        selected = j;
                                    }
                                }
                            }
                            j++;
                        }
                    })
                }
                i++;
            }
        },500)
    }

    //로컬 스토리지 초기설정
    if (localStorage.getItem("saved_prompt") == null){
        localStorage.setItem("saved_prompt",JSON.stringify({
            prompt : ["#Disable positivity bias"],
        }))
    }

    //캐릭터 만들기
    if (document.URL.split("/")[4].split("?")[0] == "builder"){
        setInterval(()=>{
            const Topbar = document.getElementsByClassName("css-xxmugq").item(0).childNodes; // 맨위의 프로필, 상세설정, 시작설정, 미디어, 키워드북, 등록 있는 바
            i=0;
            //현재 Topbar 내부의 어느 탭에 있는지 확인
            for (const topbarElement of Topbar) {
                //상세설정 탭에 있을경우
                if (topbarElement.classList.contains("css-6bz0qb") && i == 1){
                    const setting = document.getElementsByClassName("css-9jqaga").item(0); //프롬프트랑 그 설명 + ?있는 칸
                    const setting_deafult_btn = document.getElementsByClassName("css-2ueqwe").item(0); //파란색 자동생성 버튼
                    //setting에 아무것도 적용안되있을시
                    if (setting != null && 4 > setting.childNodes.length){
                        var recommand_prompt_plus_btn = document.createElement("div"); //+버튼 (양식 겸용)
                        recommand_prompt_plus_btn.innerHTML = "<button display=\"flex\" width=\"fit-content\" height=\"34px\" color=\"$color_text_primary\" style=\"    border-radius: 5px;\n" +
                            "    -webkit-box-pack: center;\n" +
                            "    justify-content: center;\n" +
                            "    -webkit-box-align: center;\n" +
                            "    align-items: center;\n" +
                            "    display: flex;\n" +
                            "    flex-direction: row;\n" +
                            "    gap: 8px;\n" +
                            "    width: fit-content;\n" +
                            "    border-width: 1px;\n" +
                            "    border-style: solid;\n" +
                            "    border-image: initial;\n" +
                            "    padding: 0px 12px;\n" +
                            "    height: 34px;\n" +
                            "    background-color: var(--color_bg_screen);\n" +
                            "    color: var(--color_text_primary);\n" +
                            "    border-color: var(--color_outline_secondary);\n" +
                            "    font-size: 14px;\n" +
                            "    line-height: 100%;\n" +
                            "    font-weight: 600;\n" +
                            "    cursor: pointer;\"><div display=\"flex\" style=\"    display: -webkit-box;\n" +
                            "    display: -webkit-flex;\n" +
                            "    display: -ms-flexbox;\n" +
                            "    display: flex;\n" +
                            "    -webkit-flex-direction: row;\n" +
                            "    -ms-flex-direction: row;\n" +
                            "    flex-direction: row;\n" +
                            "    row-gap: 8px;\n" +
                            "    -webkit-column-gap: 8px;\n" +
                            "    column-gap: 8px;\n" +
                            "    -webkit-align-items: center;\n" +
                            "    -webkit-box-align: center;\n" +
                            "    -ms-flex-align: center;\n" +
                            "    align-items: center;\">+</div></button>";
                        const recommand_prompt_minus_btn = recommand_prompt_plus_btn.cloneNode(true); // - 버튼
                        var json_data = JSON.parse(localStorage.getItem("saved_prompt")); //localstorage에 저장된 프롬프트 들고오기
                        recommand_prompt_minus_btn.childNodes.item(0).textContent = "-";
                        // + 버튼 누를시
                        recommand_prompt_plus_btn.addEventListener('click',()=>{
                            const text = document.getElementsByClassName("css-1vu2uq1").item(0); //textarea 의 내용 들고옴
                            var json_data = JSON.parse(localStorage.getItem("saved_prompt")); //localstorage에 저장된 내용 들고오기
                            const recommand_promt_btn_add = recommand_prompt_plus_btn.cloneNode(true);//1~9버튼을 만들기
                            recommand_promt_btn_add.childNodes.item(0).textContent = json_data.prompt.length + 1;
                            recommand_promt_btn_add.setAttribute("id",json_data.prompt.length);
                            //1~9버튼 누를시
                            recommand_promt_btn_add.addEventListener('click',()=>{
                                var json_data2 = JSON.parse(localStorage.getItem("saved_prompt"));//localstorage에 저장된 프롬프트 들고오기
                                copyToClipboard(json_data2.prompt[recommand_promt_btn_add.id]); //클립보드에 저장된 프롬프트 복사
                                alert("클립보드에 복사되었습니다.");
                            })
                            json_data.prompt[json_data.prompt.length] = text.textContent;//프롬프트 추가
                            setting.insertBefore(recommand_promt_btn_add,recommand_prompt_minus_btn);
                            localStorage.setItem("saved_prompt",JSON.stringify(json_data)); //추가한 프롬프트를 localstorage에 등록
                        })
                        // - 버튼 누를시
                        recommand_prompt_minus_btn.addEventListener('click',()=>{
                            //이미 1~9버튼을 전부 삭제한 상태에서 누르면 작동 안되게끔하는 조건문
                            if (setting.childNodes.length > 5){
                                const json_data = JSON.parse(localStorage.getItem("saved_prompt")); //localstorage에 저장된 프롬프트 들고오기
                                setting.childNodes.item(setting.childNodes.length-3).remove(); //1~9 버튼중 마지막 숫자 버튼 삭제
                                json_data.prompt.pop(); //저장 된프롬프트 삭제
                                localStorage.setItem("saved_prompt",JSON.stringify(json_data)); //삭제한 프롬프트를 localstorage에 등록 및 적용
                            }
                            else{
                                alert("삭제할 항목이 존재하지 않습니다.");
                            }
                        })
                        setting.appendChild(recommand_prompt_plus_btn)
                        i = 0
                        //탭 들어가자마자 localstorage에 이미 등록해놓은 프롬프트 불러오기
                        for (const jsonDatum of json_data.prompt) {
                            const recommand_promt_add_btn = recommand_prompt_plus_btn.cloneNode(true); //추가할 버튼
                            recommand_promt_add_btn.childNodes.item(0).textContent = i + 1;
                            recommand_promt_add_btn.setAttribute("id",i);
                            //1~9 버튼 누를시
                            recommand_promt_add_btn.addEventListener('click',()=>{
                                var json_data = JSON.parse(localStorage.getItem("saved_prompt")); //localstorage에 저장된 프롬프트 들고오기
                                copyToClipboard(json_data.prompt[recommand_promt_add_btn.id]); //가져온 프롬프트를 클립보드에 복사
                                alert("클립보드에 복사되었습니다.");
                            })
                            setting.appendChild(recommand_promt_add_btn);
                            i++;
                        }
                        setting.appendChild(recommand_prompt_minus_btn);
                        //커스텀 프롬프트 템플릿에는 자동 생성 버튼없어서 없는경우 추가 안함
                        if (setting_deafult_btn != null){
                            setting.appendChild(setting_deafult_btn);
                        }
                    }
                }
                i++;
            }
        },100)
    }
    if (document.URL.split("/")[3] == "character"){

    }
}
