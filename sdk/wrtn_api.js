var wrtn_api = "https://api.wrtn.ai/be"; //api
var wrtn_api2 = "https://api2.wrtn.ai/terry"; //api1
var wrtn_william = "https://william.wow.wrtn.ai"; //william
var token_key = "access_token"; //쿠키중 가져올 토큰값 (조회 및 수정용 토큰 정보를 수집하지 않음)

//log on developer console
//debug
var IsDebug = true;
//debug function
function debug(content,code = null){
    if (IsDebug){
        if (code == 0){
            console.log(`[FAST WRTN][DEBUG](function) ${content} loaded`);
        }
        else if(code == 1){
            console.log(`[FAST WRTN][DEBUG](body value) ${content} loaded`);
        }
        else if(code == 2){
            console.log(`[FAST WRTN][DEBUG](request) ${content} loaded`);
        }
        else if(code == 3){
            console.log(`[FAST WRTN][DEBUG](event) ${content} evented`)
        }
        else if(code == 4){
            console.log(`[FAST WRTN][DEBUG](for) ${content} completed`)
        }
        else if(code == 5){
            console.log(`[FAST WRTN][DEBUG](add) ${content} added`)
        }
        else{
            console.log(`[FAST WRTN][DEBUG] ${content}`);
        }
    }
}
//url 리퀘스트 동기처리
//GET
function getAfetch (url){
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url, false); // 동기(false) ,비동기(true)
    //헤더 정보가 필요한 경우에만 추가
    xhr.setRequestHeader("Authorization", `Bearer ${getCookie(token_key)}`);
    xhr.send();
    if (xhr.status == 200) { //GET 요청에 대해 성공적인경우
        debug(`GET ${url}`,2);
        return xhr.responseText // 서버로부터 받은 데이터를 출력
    }
    else{
        alert(`api get 요청 실패 ${url}`);
    }
}
function deleteAfetch (url){
    const xhr = new XMLHttpRequest();
    xhr.open("DELETE", url, false); // 동기(false) ,비동기(true)
    //헤더 정보가 필요한 경우에만 추가
    xhr.setRequestHeader("Authorization", `Bearer ${getCookie(token_key)}`);
    xhr.send();
    if (xhr.status == 200) { //GET 요청에 대해 성공적인경우
        debug(`DELETE ${url}`,2);
        return true;
    }
    else{
        alert(`api delete 요청 실패 ${url}`);
    }
}
//POST
function postAfetch (url,data){
    //******* AJAX Sync POST 요청 *******
    const xhr = new XMLHttpRequest();
    xhr.open("POST", url, false); // 동기(false) ,비동기(true)
    xhr.setRequestHeader("Authorization", `Bearer ${getCookie(token_key)}`);
    //POST 요청 시 일반적으로 Content-Type은 세팅
    xhr.setRequestHeader("Content-Type", "application/json");
    //POST 요청에 보낼 데이터 작성
    xhr.send(JSON.stringify(data)); //JSON 형태로 변환하여 서버에 전송
    if (xhr.status == 201){
        debug(`POST ${url}`,2);
        return xhr.responseText;
    }
    else{
        alert(`api post 요청 실패 ${url} | ${JSON.stringify(data)}`);
    }
}
//POST
function out_postAfetch (url,data){
    //******* AJAX Sync POST 요청 *******
    const xhr = new XMLHttpRequest();
    xhr.open("POST", url, false); // 동기(false) ,비동기(true)
    //POST 요청 시 일반적으로 Content-Type은 세팅
    xhr.setRequestHeader("Content-Type", "application/json");
    //POST 요청에 보낼 데이터 작성
    xhr.send(JSON.stringify(data)); //JSON 형태로 변환하여 서버에 전송
    if (xhr.status == 200){
        debug(`POST ${url}`,2);
        return xhr.responseText;
    }
    else{
        alert(`api post 요청 실패 ${url} | ${JSON.stringify(data)}`);
    }
}
//PUT
function putAfetch (url,data){
    //******* AJAX Sync PUT 요청 *******
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", url, false); // 동기(false) ,비동기(true)
    xhr.setRequestHeader("Authorization", `Bearer ${getCookie(token_key)}`);
    //PUT 요청 시 일반적으로 Content-Type은 세팅
    xhr.setRequestHeader("Content-Type", "application/json");
    //PUT 요청에 보낼 데이터 작성
    xhr.send(JSON.stringify(data)); //JSON 형태로 변환하여 서버에 전송
    if (xhr.status == 200){
        debug(`PUT ${url}`,2);
        return xhr.responseText;
    }
    else{
        alert(`api put 요청 실패 ${url} | ${JSON.stringify(data)}`);
    }
}

//PUT
function patchAfetch (url,data){
    //******* AJAX Sync PUT 요청 *******
    const xhr = new XMLHttpRequest();
    xhr.open("PATCH", url, false); // 동기(false) ,비동기(true)
    xhr.setRequestHeader("Authorization", `Bearer ${getCookie(token_key)}`);
    //PUT 요청 시 일반적으로 Content-Type은 세팅
    xhr.setRequestHeader("Content-Type", "application/json");
    //PUT 요청에 보낼 데이터 작성
    xhr.send(JSON.stringify(data)); //JSON 형태로 변환하여 서버에 전송
    if (xhr.status == 200){
        debug(`PATCH ${url}`,2);
        return xhr.responseText;
    }
    else{
        alert(`api patch 요청 실패 ${url} | ${JSON.stringify(data)}`);
    }
}

//쿠키 가져오는 함수
function getCookie(name) {
    let matches = document.cookie.match(new RegExp(
      "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}

//Wrtn Api Control Class
//캐챗
class my_struct {
    constructor(data){
        this.json = data;
    }
    get(){
        var request = JSON.parse(getAfetch(wrtn_api + `/characters/me/${this.json._id}`));
        return request.data;
    }
    set(json_data){
        for (const a of json_data.startingSets) {
            delete a._id;
        }
        var request = JSON.parse(patchAfetch(wrtn_api + `/characters/${this.json._id}`,{
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
        }));
        return request;
    }
    remove(){
        var request = JSON.parse(deleteAfetch(wrtn_api + `/characters/${this.json._id}`));
        return request;
    }
    publish(){
        var json_data = this.get(); //기본 캐챗의 json데이터
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
            var json_body = {
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
            }
        }
        else{
            var json_body = {
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
            }
        }
        var request = JSON.parse(postAfetch(wrtn_api + "/characters",json_body));
        return request;
    }
}

//메세지
class message_struct {
    constructor(data){
        this.json = data;
    }
    get(){
        var request = JSON.parse(putAfetch(wrtn_api + `/message/${this.json._id}`,{}));
        return request.data.content;
    }
    set(content){
        var request = JSON.parse(patchAfetch(wrtn_api2 + `/characters/chat/${this.json.chatId}/message/${this.json._id}`,{
            message:content
        }));
        return request;
    }
    remove(){
        var request = JSON.parse(deleteAfetch(wrtn_api2 + `/characters/chat/${this.json.chatId}/message/${this.json._id}`));
        return request;
    }
}

//채팅방
class chatroom_struct {
    constructor(data){
        this.getHeader = {method : "GET", headers : {"Authorization": `Bearer ${getCookie(token_key)}`}};
        this.postHeader = {method : "POST",headers : {"Authorization": `Bearer ${getCookie(token_key)}`,"Content-Type": "application/json"},body:null};
        this.json = data;
    }
    remove(){
        var request = JSON.parse(putAfetch(wrtn_api + '/api/v2/chat/delete',{chatIds:[this.json._id]}));
        return request;
    }
    async getMessages(cursor="",load_limit = 40){
        if (cursor != "") {
            var request = await fetch(wrtn_api2 + `/api/v2/chat-room/${this.json._id}/messages?limit=${load_limit}&cursor=${cursor}`, this.getHeader);
            debug(`GET ${wrtn_api2 + `/api/v2/chat-room/${this.json._id}/messages?limit=${load_limit}&cursor=${cursor}`}`,2);
        }
        if (cursor == null){
            return null;
        }
        else {
            var request = await fetch(wrtn_api2 + `/api/v2/chat-room/${this.json._id}/messages?limit=${load_limit}`, this.getHeader);
            debug(`GET ${wrtn_api + `/api/v2/chat-room/${this.json._id}/messages?limit=${load_limit}`}`,2);
        }
        var messages = await request.json();
        return messages;
    }
    send(content,IsSuperMode = false){
        var created_msg = JSON.parse(postAfetch(wrtn_api2 + `/characters/chat/${this.json._id}/message`, {
            message: content,
            reroll: false,
            images: [],
            isSuperMode: IsSuperMode
        })).data;
        getAfetch(wrtn_api2 + `/characters/chat/${this.json._id}/message/${created_msg}`);
        var recontent = JSON.parse(getAfetch(wrtn_api2 + `/characters/chat/${this.json._id}/message/${created_msg}/result`));
        return new message_struct(recontent.data);
    }
    getUsernote(){
        var request = JSON.parse(getAfetch(wrtn_api2 + `/api/v2/chat-room/${this.json._id}`));
        return request.data.character.userNote.content
    }
    setUsernote(content){
        var request = JSON.parse(putAfetch(wrtn_william + `/chat-room/${this.json._id}`,{userNote: {"content":content}}));
        return request;
    }
}

//메인 api class
class wrtn_api_class {
    constructor(){
        this.getHeader = {method : "GET", headers : {"Authorization": `Bearer ${getCookie(token_key)}`}};
        this.postHeader = {method : "POST",headers : {"Authorization": `Bearer ${getCookie(token_key)}`,"Content-Type": "application/json"},data:null};
    }
    //유저 정보 조회
    getUser() {
        var request = JSON.parse(getAfetch(wrtn_api + '/user'));
        return request;
    }
    //슈퍼챗 관련 조회
    getSuperchat() {
        var request = JSON.parse(getAfetch(wrtn_api + '/character-super-mode'));
        return request;
    }
    //페르소나 조회
    getPersona() {
        var wrtn_uid = JSON.parse(getAfetch(wrtn_api + '/user')).data.wrtnUid;
        var user_pid = JSON.parse(getAfetch(wrtn_api + `/character-profiles/${wrtn_uid}`)).data._id;
        var character_profiles = JSON.parse(getAfetch(wrtn_api + `/character-profiles/${user_pid}/character-chat-profiles`)).data.characterChatProfiles;
        return character_profiles;
    }
    //대표프로필 조회
    getRepresentativePersona(){
        var wrtn_uid = JSON.parse(getAfetch(wrtn_api + '/user')).data.wrtnUid;
        var user_pid = JSON.parse(getAfetch(wrtn_api + `/character-profiles/${wrtn_uid}`)).data._id;
        var character_profiles = JSON.parse(getAfetch(wrtn_api + `/character-profiles/${user_pid}/character-chat-profiles`)).data.characterChatProfiles;
        //대표 프로필 가져오기
        for (const dpi of character_profiles) {
            if (dpi.isRepresentative == true){
                return dpi;
            }
        }
    }
    //채팅방 목록
    async getChatrooms(cursor="",load_limit=40,type="character") {
        if (cursor != "") {
            var request = await fetch(wrtn_api + `/api/v2/chat?type=${type}&limit=${load_limit}&cursor=${cursor}`, this.getHeader);
            debug(`GET ${wrtn_api + `/api/v2/chat?type=${type}&limit=${load_limit}&cursor=${cursor}`}`,2);
        }
        if (cursor == null){
            return null;
        }
        else {
            var request = await fetch(wrtn_api + `/api/v2/chat?type=${type}&limit=${load_limit}`,this.getHeader);
            debug(`GET ${wrtn_api + `/api/v2/chat?type=${type}&limit=${load_limit}`}`,2);
        }
        var chatrooms = await request.json();
        return chatrooms;
    }
    //제작한 캐릭터 목록
    async getMycharacters(cursor="",load_limit=40) {
        if (cursor != ""){
            var request = await fetch(wrtn_api + `/characters/me?limit=${load_limit}&cursor=${cursor}`, this.getHeader);
        }
        else if (cursor == null){
            return null;
        }
        else{
            var request = await fetch(wrtn_api + `/characters/me?limit=${load_limit}`, this.getHeader);
        }
        var characters = await request.json();
        return characters;
    }
    async character_search(query,cursor="",sort="score",load_limit=40){
        if (cursor != ""){
            var request = await fetch(wrtn_api + `/characters/search?limit=${load_limit}&query=${query}&sort=${sort}&cursor=${cursor}`);
        }
        else if (cursor == null){
            return null;
        }
        else{
            var request = await fetch(wrtn_api + `/characters/search?limit=${load_limit}&query=${query}&sort=${sort}`);
        }
        var result = await request.json();
        return result;
    }
    async user_search(query,cursor="",load_limit=40){
        if (cursor != ""){
            var request = await fetch(wrtn_api + `/character-profiles/search?limit=${load_limit}&query=${query}&cursor=${cursor}`);
        }
        else if (cursor == null){
            return null;
        }
        else{
            var request = await fetch(wrtn_api + `/character-profiles/search?limit=${load_limit}&query=${query}`);
        }
        var result = await request.json();
        return result;
    }
    //제작한 캐릭터 불러오기
    getMycharacter(charId){
        var request = JSON.parse(getAfetch(wrtn_api + `/characters/me/${charId}`));
        return new my_struct(request.data);
    }
    //메시지 불러오기
    getMessage(msgId){
        var request = JSON.parse(putAfetch(wrtn_api + `/message/${msgId}`,{}));
        return new message_struct(request.data);
    }
    //채팅방 불러오기
    getChatroom(chatId){
        var request = JSON.parse(getAfetch(wrtn_api2 + `/api/v2/chat-room/${chatId}`));
        return new chatroom_struct(request.data,this.token);
    }
}

