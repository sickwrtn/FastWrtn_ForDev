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
/* TODO
코드 가독성 개선 (시급)

대화 내역 검색 기능 및 순서 변경 기능

랭킹 플러스 검색 필터링기능 추가

팝업 기능 다채롭게 만들기

*/

//environment variables
var wrtn_api = "https://api.wrtn.ai/be"; //api
var wrtn_api2 = "https://api2.wrtn.ai/terry"; //api1
var wrtn_william = "https://william.wow.wrtn.ai"; //william
var scroll_all_amount = 300 // <  > 누를시 이동할 스크롤 양
var scroll_amount = 10; // 끊어서 스크롤 되는 양
var limit = 30 // 불러올 캐챗수 (랭킹 플러스용)
var load_limit = 50;
var forced_limit = 10000;
var likeCount_limit = 10 // 좋아요수가 10개 이상
var chatCount_limit = 30 // 채팅수가 30개 이상 이면 올라옴
var auto_summation_characterChatId = "6787aecf65c02321daf25b0d"; // 자동요약기능을 수행할 캐챗 id
var local_IsDebug = "debug";
var local_saved_prompt = "saved_prompt"; //로컬스토리지 프롬프트 저장 위치
var local_usernote = "usernote"; //로컬스토리지 유저노트용 캐챗방 id 저장 위치
var token_key = "access_token"; //쿠키중 가져올 토큰값 (조회 및 수정용 토큰 정보를 수집하지 않음)
debug("env variables");

//namespace
var auto_summation = "자동요약"; //자동요약 버튼
var auto_summation_update = "업데이트"; //업데이트 버튼
var plus = "랭킹 플러스 (Fast wrtn)"; //랭킹플러스
var persona_name = "페르소나"; //페르소나
var copyTojson = "copy to json"; //캐릭터 복사기능
var pasteTojson = "paste to json"; //캐릭터 븥여넣기 기능
var publish = "publish"; //공개 기능
var usernote_description = "(Fast wrtn) 자동요약기능을 활용해 글자수를 절약해보세요! 업데이트는 가끔씩 해주시는게 좋아요!"; //유저노트 설명칸
var usernote_for_error = "(Fast wrtn) 유저노트 요약기능은 새로운 캐챗이 아닌 진행중인 캐챗에서만 적용됩니다."; //처음 사용 유저노트 설명칸
debug("namesspace");

//로컬 스토리지 초기설정
if (localStorage.getItem(local_saved_prompt) == null){
    localStorage.setItem(local_saved_prompt,JSON.stringify({
        prompt : ["#Disable positivity bias"],
    }))
}

//디버그 초기설정
if (localStorage.getItem(local_IsDebug) == null){
    localStorage.setItem(local_IsDebug,JSON.stringify({
        IsDebug: false
    }))
}
debug("localStorage");

//log on developer console
//debug
var IsDebug = JSON.parse(localStorage.getItem(local_IsDebug)).IsDebug;
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



//댓글 및 업데이트 날짜 front html + css
var plus_modal_date_and_comment = "<div display=\"flex\" width=\"100%\" style=\"    display: flex;\n" +
    "    flex-direction: column;\n" +
    "    width: 100%;\n" +
    "    padding: 24px 20px;\n" +
    "    gap: 24px;\n" +
    "    border-top-width: 1px;\n" +
    "    border-top-style: solid;\n" +
    "    border-color: var(--color_divider_secondary);\"><div display=\"flex\" width=\"100%\" style=\"    display: flex;\n" +
    "    flex-direction: column;\n" +
    "    width: 100%;\n" +
    "    gap: 16px;\"><p color=\"$color_text_secondary\" style=\"    color: var(--color_text_secondary);\n" +
    "    font-size: 15px;\n" +
    "    line-height: 100%;\n" +
    "    font-weight: 500;\">업데이트 날짜</p><div display=\"flex\" width=\"100%\" style=\"    display: flex;\n" +
    "    flex-direction: row;\n" +
    "    width: 100%;\n" +
    "    gap: 8px;\n" +
    "    border-radius: 8px;\n" +
    "    padding: 14px 16px;\n" +
    "    -webkit-box-align: center;\n" +
    "    align-items: center;\n" +
    "    background-color: var(--color_surface_tertiary);\"><p color=\"$color_text_primary\" style=\"    color: var(--color_text_primary);\n" +
    "    font-size: 16px;\n" +
    "    line-height: 140%;\n" +
    "    font-weight: 500;\">2025.01.10</p></div></div><div display=\"flex\" width=\"100%\" style=\"    display: flex;\n" +
    "    flex-direction: column;\n" +
    "    width: 100%;\n" +
    "    gap: 16px;\"><div display=\"flex\" width=\"100%\" style=\"    display: flex;\n" +
    "    flex-direction: row;\n" +
    "    width: 100%;\n" +
    "    gap: 8px;\"><p color=\"$color_text_secondary\" style=\"    color: var(--color_text_secondary);\n" +
    "    font-size: 15px;\n" +
    "    line-height: 100%;\n" +
    "    font-weight: 500;\">댓글</p><p color=\"$color_text_quaternary\" style=\"    color: var(--color_text_quaternary);\n" +
    "    font-size: 15px;\n" +
    "    line-height: 100%;\n" +
    "    font-weight: 500;\">108건</p><div display=\"flex\" style=\"    display: -webkit-box;\n" +
    "    display: -webkit-flex;\n" +
    "    display: -ms-flexbox;\n" +
    "    display: flex;\n" +
    "    -webkit-flex: 1;\n" +
    "    -ms-flex: 1;\n" +
    "    flex: 1;\"></div><a href=\"/character/detail/677fc8eebdc024d390c9f1ef\"><p color=\"$color_action_blue_primary\" style=\"    color: var(--color_action_blue_primary);\n" +
    "    font-size: 15px;\n" +
    "    list-spacing: 0;\n" +
    "    line-height: 100%;\n" +
    "    font-weight: 500;\">전체보기</p></a></div><div display=\"flex\" width=\"100%\" style=\"    display: flex;\n" +
    "    flex-direction: row;\n" +
    "    width: 100%;\n" +
    "    gap: 8px;\n" +
    "    border-radius: 8px;\n" +
    "    padding: 14px 16px;\n" +
    "    background-color: var(--color_surface_tertiary);\"><div overflow=\"hidden\" display=\"flex\" width=\"24px\" height=\"24px\" style=\"    position: relative;\n" +
    "    overflow: hidden;\n" +
    "    display: flex;\n" +
    "    -webkit-box-align: center;\n" +
    "    align-items: center;\n" +
    "    -webkit-box-pack: center;\n" +
    "    justify-content: center;\n" +
    "    width: 24px;\n" +
    "    min-width: 24px;\n" +
    "    height: 24px;\n" +
    "    min-height: 24px;\n" +
    "    border-radius: 50%;\n" +
    "    border-width: 1px;\n" +
    "    border-style: solid;\n" +
    "    border-image: initial;\n" +
    "    border-color: var(--color_outline_tertiary);\n" +
    "    cursor: pointer;\"><img src=\"https://d394jeh9729epj.cloudfront.net/8D0KCSRmolG-GGKOMkpaOVZS/51f2210c-436d-4f3c-b771-2bc7c65e173a_w600_w600_w600_w600_w200.jpeg\" alt=\"character_thumbnail\" style=\"width: 100%; height: 100%; object-fit: cover; position: absolute; top: 0px; left: 0px; border-radius: inherit;\" data-clarity-loaded=\"j6k9we\"></div><p color=\"$color_text_primary\" style=\"    color: var(--color_text_primary);\n" +
    "    font-size: 16px;\n" +
    "    line-height: 160%;\n" +
    "    font-weight: 500;\n" +
    "    white-space: pre-line;\n" +
    "    word-break: break-all;\">넘 귀엽다</p></div></div></div>";

//프롬프트 front html + css
var recommand_prompt_html = "<button display=\"flex\" width=\"fit-content\" height=\"34px\" color=\"$color_text_primary\" style=\"    border-radius: 5px;\n" +
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
//페르소나 front html + css
var persona_modal_html = "<div style=\"position: fixed; inset: 0px; z-index: -1; background-color: var(--color_bg_dimmed); cursor: default;\"><div style=\"align-items: flex-end; width: 100%; height: 100%; display: flex; -webkit-box-align: center; align-items: center; -webkit-box-pack: center; justify-content: center; position: relative;\"><div width=\"100%\" display=\"flex\" style=\"    width: 600px;\n" +
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
                                        "    align-items: center;\">등록</div></button></div></div></div></div></div>";
//피드(랭킹플러스) front html + css
var feed_front_html_scroll = "<button width=\"36px\" height=\"36px\" display=\"flex\" style=\"    position: absolute;\n" +
                "    left: 0px;\n" +
                "    top: 60px;\n" +
                "    border-radius: 50%;\n" +
                "    border-width: 1px;\n" +
                "    border-style: solid;\n" +
                "    border-image: initial;\n" +
                "    border-color: var(--color_outline_secondary);\n" +
                "    width: 36px;\n" +
                "    height: 36px;\n" +
                "    display: flex;\n" +
                "    -webkit-box-pack: center;\n" +
                "    justify-content: center;\n" +
                "    -webkit-box-align: center;\n" +
                "    align-items: center;\n" +
                "    background-color: var(--color_surface_tertiary);\n" +
                "    z-index: 3;\"><svg width=\"24\" height=\"24\" viewBox=\"0 0 25 25\" fill=\"currentColor\" xmlns=\"http://www.w3.org/2000/svg\" color=\"#a8a69dff\"><path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M14.5 18.801L9.55026 13.8512L9.19671 13.4977C8.61092 12.9119 8.61092 11.9621 9.19671 11.3764L9.55026 11.0228L14.5 6.07305L15.9142 7.48726L10.9645 12.437L15.9142 17.3868L14.5 18.801Z\" fill=\"currentColor\"></path></svg></button>";
//랭킹 플러스 모달 IsAudult front html + css
var plus_modal_front_html_IsAudlt = "<div display=\"flex\" style=\"    display: flex;\n" +
    "    flex-direction: row;\n" +
    "    padding: 4px 6px;\n" +
    "    gap: 4px;\n" +
    "    -webkit-box-align: center;\n" +
    "    align-items: center;\n" +
    "    border-width: 1px;\n" +
    "    border-style: solid;\n" +
    "    border-image: initial;\n" +
    "    border-color: var(--color_outline_secondary);\n" +
    "    border-radius: 4px;\n" +
    "    background-color: var(--color_surface_elevated);\"><svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\"><mask id=\"mask0_8669_146020\" maskUnits=\"userSpaceOnUse\" x=\"0\" y=\"0\" width=\"16\" height=\"16\" style=\"mask-type: alpha;\"><rect width=\"16\" height=\"16\" fill=\"#D9D9D9\"></rect></mask><g mask=\"url(#mask0_8669_146020)\"><path d=\"M7.9974 8.66732C8.64184 8.66732 9.19184 8.43954 9.6474 7.98398C10.103 7.52843 10.3307 6.97843 10.3307 6.33398C10.3307 5.68954 10.103 5.13954 9.6474 4.68398C9.19184 4.22843 8.64184 4.00065 7.9974 4.00065C7.35295 4.00065 6.80295 4.22843 6.3474 4.68398C5.89184 5.13954 5.66406 5.68954 5.66406 6.33398C5.66406 6.97843 5.89184 7.52843 6.3474 7.98398C6.80295 8.43954 7.35295 8.66732 7.9974 8.66732ZM7.9974 14.6673C6.37517 14.2562 5.08073 13.3673 4.11406 12.0007C3.1474 10.634 2.66406 9.10065 2.66406 7.40065V3.33398L7.9974 1.33398L13.3307 3.33398V7.40065C13.3307 9.10065 12.8474 10.634 11.8807 12.0007C10.9141 13.3673 9.61962 14.2562 7.9974 14.6673ZM7.9974 13.2673C8.65295 13.0562 9.23351 12.7257 9.73906 12.2757C10.2446 11.8257 10.6863 11.3173 11.0641 10.7507C10.5863 10.5062 10.0891 10.3201 9.5724 10.1923C9.05573 10.0645 8.53073 10.0007 7.9974 10.0007C7.46406 10.0007 6.93906 10.0645 6.4224 10.1923C5.90573 10.3201 5.40851 10.5062 4.93073 10.7507C5.30851 11.3173 5.75017 11.8257 6.25573 12.2757C6.76129 12.7257 7.34184 13.0562 7.9974 13.2673Z\" fill=\"#FA816B\"></path></g></svg><p color=\"$color_text_secondary\" style=\"    color: var(--color_text_secondary);\n" +
    "    font-size: 14px;\n" +
    "    line-height: 100%;\n" +
    "    font-weight: 500;\">언세이프티</p></div>";
//제작자의 다른 캐릭터챗 보기 front html + css
var plus_modal_recommand_creator_front_html = "<div display=\"flex\" width=\"100%\" style=\"    display: flex;\n" +
    "    flex-direction: column;\n" +
    "    width: 100%;\n" +
    "    padding: 24px 20px;\n" +
    "    gap: 16px;\n" +
    "    border-top-width: 1px;\n" +
    "    border-top-style: solid;\n" +
    "    border-color: var(--color_divider_secondary);\"><p color=\"$color_text_primary\" style=\"    color: var(--color_text_primary);\n" +
    "    font-size: 18px;\n" +
    "    list-spacing: 0;\n" +
    "    line-height: 100%;\n" +
    "    font-weight: 600;\">제작자의 다른 캐릭터 보기 (Fast wrtn)</p><div width=\"100%\" style=\"    width: 100%;\n" +
    "    position: relative;\"><div display=\"flex\" width=\"100%\" style=\"    display: -webkit-box;\n" +
    "    display: -webkit-flex;\n" +
    "    display: -ms-flexbox;\n" +
    "    display: flex;\n" +
    "    -webkit-flex-direction: row;\n" +
    "    -ms-flex-direction: row;\n" +
    "    flex-direction: row;\n" +
    "    width: 100%;\n" +
    "    overflow-x: scroll;\n" +
    "    overflow-y: hidden;\n" +
    "    -ms-overflow-style: none;\n" +
    "    scrollbar-width: none;\"><div display=\"flex\" width=\"fit-content\" style=\"    display: -webkit-box;\n" +
    "    display: -webkit-flex;\n" +
    "    display: -ms-flexbox;\n" +
    "    display: flex;\n" +
    "    -webkit-flex-direction: row;\n" +
    "    -ms-flex-direction: row;\n" +
    "    flex-direction: row;\n" +
    "    width: -webkit-fit-content;\n" +
    "    width: -moz-fit-content;\n" +
    "    width: fit-content;\n" +
    "    row-gap: 12px;\n" +
    "    -webkit-column-gap: 12px;\n" +
    "    column-gap: 12px;\"><div display=\"flex\" width=\"148px,156px\" overflow=\"hidden\" style=\"    display: -webkit-box;\n" +
    "    display: -webkit-flex;\n" +
    "    width: 156px;\n" +
    "    height: 280px;\n" +
    "    display: -ms-flexbox;\n" +
    "    display: flex;\n" +
    "    -webkit-flex-direction: column;\n" +
    "    -ms-flex-direction: column;\n" +
    "    flex-direction: column;\n" +
    "    width: 148px;\n" +
    "    min-width: 148px;\n" +
    "    max-height: 250px;\n" +
    "    min-height: 250px;\n" +
    "    overflow: hidden;\n" +
    "    row-gap: 8px;\n" +
    "    -webkit-column-gap: 8px;\n" +
    "    column-gap: 8px;\"><div display=\"flex\" style=\"    display: -webkit-box;\n" +
    "    display: -webkit-flex;\n" +
    "    display: -ms-flexbox;\n" +
    "    display: flex;\n" +
    "    -webkit-flex-direction: column;\n" +
    "    -ms-flex-direction: column;\n" +
    "    flex-direction: column;\n" +
    "    row-gap: 12px;\n" +
    "    -webkit-column-gap: 12px;\n" +
    "    column-gap: 12px;\"><div width=\"100%\" height=\"148px,156px\" style=\"    width: 100%;\n" +
    "    height: 148px;\n" +
    "    border-radius: 8px;\n" +
    "    margin-bottom: unset;\n" +
    "    position: relative;\n" +
    "    aspect-ratio: 1/1;\"><div overflow=\"hidden\" display=\"flex\" width=\"100%\" height=\"100%\" style=\"    position: relative;\n" +
    "    overflow: hidden;\n" +
    "    display: -webkit-box;\n" +
    "    display: -webkit-flex;\n" +
    "    display: -ms-flexbox;\n" +
    "    display: flex;\n" +
    "    -webkit-align-items: center;\n" +
    "    -webkit-box-align: center;\n" +
    "    -ms-flex-align: center;\n" +
    "    align-items: center;\n" +
    "    -webkit-box-pack: center;\n" +
    "    -ms-flex-pack: center;\n" +
    "    -webkit-justify-content: center;\n" +
    "    justify-content: center;\n" +
    "    width: 100%;\n" +
    "    height: 100%;\n" +
    "    border-radius: 8px;\n" +
    "    border: 1px solid;\n" +
    "    border-color: var(--color_outline_tertiary);\"><img src=\"https://d394jeh9729epj.cloudfront.net/8DJAFaDh5Fm-GGKOTTBVVkI3/7978f657-0e6b-4819-972d-8f7a4d0de312_w600.webp\" alt=\"character_thumbnail\" style=\"width: 100%; height: 100%; object-fit: cover; position: absolute; top: 0px; left: 0px; border-radius: inherit;\"></div><div width=\"100%\" height=\"100%\" display=\"none\" style=\"    width: 100%;\n" +
    "    height: 100%;\n" +
    "    border-radius: 8px;\n" +
    "    position: absolute;\n" +
    "    top: 0px;\n" +
    "    left: 0px;\n" +
    "    background-color: rgba(0, 0, 0, 0.20);\n" +
    "    display: none;\"></div><div display=\"flex\" style=\"    display: -webkit-box;\n" +
    "    display: -webkit-flex;\n" +
    "    display: -ms-flexbox;\n" +
    "    display: flex;\n" +
    "    -webkit-flex-direction: row;\n" +
    "    -ms-flex-direction: row;\n" +
    "    flex-direction: row;\n" +
    "    position: absolute;\n" +
    "    bottom: 8px;\n" +
    "    right: 8px;\n" +
    "    row-gap: 4px;\n" +
    "    -webkit-column-gap: 4px;\n" +
    "    column-gap: 4px;\n" +
    "    -webkit-align-items: center;\n" +
    "    -webkit-box-align: center;\n" +
    "    -ms-flex-align: center;\n" +
    "    align-items: center;\"><div width=\"28px\" height=\"28px\" display=\"flex\" style=\"    width: 28px;\n" +
    "    height: 28px;\n" +
    "    border: 0.8px solid;\n" +
    "    border-radius: 50%;\n" +
    "    border-color: var(--palette_gray_gray_600);\n" +
    "    background-color: var(--color_bg_dimmed);\n" +
    "    display: -webkit-box;\n" +
    "    display: -webkit-flex;\n" +
    "    display: -ms-flexbox;\n" +
    "    display: flex;\n" +
    "    -webkit-box-pack: center;\n" +
    "    -ms-flex-pack: center;\n" +
    "    -webkit-justify-content: center;\n" +
    "    justify-content: center;\n" +
    "    -webkit-align-items: center;\n" +
    "    -webkit-box-align: center;\n" +
    "    -ms-flex-align: center;\n" +
    "    align-items: center;\"><svg xmlns=\"http://www.w3.org/2000/svg\" width=\"20\" height=\"20\" viewBox=\"0 0 16 16\" fill=\"none\"><mask id=\"mask0_8669_146020\" maskUnits=\"userSpaceOnUse\" x=\"0\" y=\"0\" width=\"16\" height=\"16\" style=\"mask-type: alpha;\"><rect width=\"16\" height=\"16\" fill=\"#D9D9D9\"></rect></mask><g mask=\"url(#mask0_8669_146020)\"><path d=\"M7.9974 8.66732C8.64184 8.66732 9.19184 8.43954 9.6474 7.98398C10.103 7.52843 10.3307 6.97843 10.3307 6.33398C10.3307 5.68954 10.103 5.13954 9.6474 4.68398C9.19184 4.22843 8.64184 4.00065 7.9974 4.00065C7.35295 4.00065 6.80295 4.22843 6.3474 4.68398C5.89184 5.13954 5.66406 5.68954 5.66406 6.33398C5.66406 6.97843 5.89184 7.52843 6.3474 7.98398C6.80295 8.43954 7.35295 8.66732 7.9974 8.66732ZM7.9974 14.6673C6.37517 14.2562 5.08073 13.3673 4.11406 12.0007C3.1474 10.634 2.66406 9.10065 2.66406 7.40065V3.33398L7.9974 1.33398L13.3307 3.33398V7.40065C13.3307 9.10065 12.8474 10.634 11.8807 12.0007C10.9141 13.3673 9.61962 14.2562 7.9974 14.6673ZM7.9974 13.2673C8.65295 13.0562 9.23351 12.7257 9.73906 12.2757C10.2446 11.8257 10.6863 11.3173 11.0641 10.7507C10.5863 10.5062 10.0891 10.3201 9.5724 10.1923C9.05573 10.0645 8.53073 10.0007 7.9974 10.0007C7.46406 10.0007 6.93906 10.0645 6.4224 10.1923C5.90573 10.3201 5.40851 10.5062 4.93073 10.7507C5.30851 11.3173 5.75017 11.8257 6.25573 12.2757C6.76129 12.7257 7.34184 13.0562 7.9974 13.2673Z\" fill=\"#FED4D3\"></path></g></svg></div><div width=\"28px\" height=\"28px\" display=\"flex\" style=\"    width: 28px;\n" +
    "    height: 28px;\n" +
    "    border: 0.8px solid;\n" +
    "    border-radius: 50%;\n" +
    "    border-color: var(--palette_gray_gray_600);\n" +
    "    background-color: var(--color_bg_dimmed);\n" +
    "    display: -webkit-box;\n" +
    "    display: -webkit-flex;\n" +
    "    display: -ms-flexbox;\n" +
    "    display: flex;\n" +
    "    -webkit-box-pack: center;\n" +
    "    -ms-flex-pack: center;\n" +
    "    -webkit-justify-content: center;\n" +
    "    justify-content: center;\n" +
    "    -webkit-align-items: center;\n" +
    "    -webkit-box-align: center;\n" +
    "    -ms-flex-align: center;\n" +
    "    align-items: center;\"><svg width=\"20\" height=\"20\" viewBox=\"0 0 24 24\" fill=\"currentColor\" xmlns=\"http://www.w3.org/2000/svg\" color=\"#ffffffff\"><mask id=\"mask0_13669_84\" maskUnits=\"userSpaceOnUse\" x=\"0\" y=\"0\" width=\"24\" height=\"24\" style=\"mask-type: alpha;\"><rect width=\"24\" height=\"24\" fill=\"currentColor\"></rect></mask><g mask=\"url(#mask0_13669_84)\"><path d=\"M11.951 13.4023L17.3804 9.78409L11.951 6.16591V13.4023ZM6.25011 20.9778C5.75241 21.0532 5.30373 20.9364 4.90406 20.6273C4.5044 20.3183 4.2744 19.915 4.21408 19.4175L3.01508 9.53534C2.95475 9.03784 3.07541 8.5931 3.37704 8.20113C3.67868 7.80916 4.07834 7.58303 4.57604 7.52272L5.61667 7.38704V14.7591C5.61667 15.7541 5.97109 16.6059 6.67993 17.3144C7.38877 18.023 8.24089 18.3773 9.23628 18.3773H17.6519C17.5614 18.7391 17.3804 19.0519 17.1089 19.3157C16.8375 19.5796 16.5057 19.7341 16.1135 19.7793L6.25011 20.9778ZM9.23628 16.5682C8.73858 16.5682 8.31253 16.391 7.95811 16.0368C7.60369 15.6825 7.42648 15.2566 7.42648 14.7591V4.80909C7.42648 4.31159 7.60369 3.8857 7.95811 3.53142C8.31253 3.17714 8.73858 3 9.23628 3H19.1902C19.6879 3 20.114 3.17714 20.4684 3.53142C20.8228 3.8857 21 4.31159 21 4.80909V14.7591C21 15.2566 20.8228 15.6825 20.4684 16.0368C20.114 16.391 19.6879 16.5682 19.1902 16.5682H9.23628Z\" fill=\"currentColor\"></path></g></svg></div></div></div><div display=\"flex\" style=\"    display: -webkit-box;\n" +
    "    display: -webkit-flex;\n" +
    "    display: -ms-flexbox;\n" +
    "    display: flex;\n" +
    "    -webkit-flex-direction: column;\n" +
    "    -ms-flex-direction: column;\n" +
    "    flex-direction: column;\n" +
    "    row-gap: 8px;\n" +
    "    -webkit-column-gap: 8px;\n" +
    "    column-gap: 8px;\"><p color=\"$color_text_primary\" style=\"    color: var(--color_text_primary);\n" +
    "    font-size: 16px;\n" +
    "    list-spacing: 0;\n" +
    "    line-height: 100%;\n" +
    "    font-weight: 600;\n" +
    "    white-space: nowrap;\n" +
    "    overflow: hidden;\n" +
    "    text-overflow: ellipsis;\">여존남비세계의 빌런</p><p color=\"$color_text_secondary\" style=\"    min-height: 40px;\n" +
    "    color: var(--color_text_secondary);\n" +
    "    font-size: 14px;\n" +
    "    list-spacing: 0;\n" +
    "    line-height: 140%;\n" +
    "    font-weight: 500;\n" +
    "    overflow: hidden;\n" +
    "    text-overflow: ellipsis;\n" +
    "    display: -webkit-box;\n" +
    "    -webkit-line-clamp: 2;\n" +
    "    -webkit-box-orient: vertical;\">아주 소수의 여성만이 초능력을 가지고 태어나는 세계. 여성들은 권력을 장악하고 여존남비적 사회질서를 선포한다. 남성들은 저항했지만, 5명의 여성 히어로에 의하여 그들의 저항은 간단히 분쇄당했다. 여성이 남성에게 무엇을 해도 범죄가 되지 않는 세상이 된 것이다.\n" +
    "그런 세상에서 당신은 유일하게 남성이면서도 서큐버스와 계약하여 초능력을 얻었다. 그리고 당신은 설령 원치 않아도 사회질서를 어지럽히는 위험한 '빌런'으로 취급될 수밖에 없다.</p></div></div><div display=\"flex\" width=\"fit-content\" style=\"    display: -webkit-box;\n" +
    "    display: -webkit-flex;\n" +
    "    display: -ms-flexbox;\n" +
    "    display: flex;\n" +
    "    -webkit-flex-direction: row;\n" +
    "    -ms-flex-direction: row;\n" +
    "    flex-direction: row;\n" +
    "    row-gap: 4px;\n" +
    "    -webkit-column-gap: 4px;\n" +
    "    column-gap: 4px;\n" +
    "    -webkit-align-items: center;\n" +
    "    -webkit-box-align: center;\n" +
    "    -ms-flex-align: center;\n" +
    "    align-items: center;\n" +
    "    padding: 2px 4px;\n" +
    "    background-color: var(--color_bg_elevated_secondary);\n" +
    "    border-radius: 4px;\n" +
    "    width: -webkit-fit-content;\n" +
    "    width: -moz-fit-content;\n" +
    "    width: fit-content;\n" +
    "    max-width: 100%;\"><svg width=\"16\" height=\"16\" viewBox=\"0 0 25 25\" fill=\"currentColor\" xmlns=\"http://www.w3.org/2000/svg\" color=\"#85837dff\"><path d=\"M12.5 22.437C11.1167 22.437 9.81667 22.1745 8.6 21.6495C7.38333 21.1245 6.325 20.412 5.425 19.512C4.525 18.612 3.8125 17.5537 3.2875 16.337C2.7625 15.1203 2.5 13.8203 2.5 12.437C2.5 11.0537 2.7625 9.75368 3.2875 8.53701C3.8125 7.32034 4.525 6.26201 5.425 5.36201C6.325 4.46201 7.38333 3.74951 8.6 3.22451C9.81667 2.69951 11.1167 2.43701 12.5 2.43701C13.8833 2.43701 15.1833 2.69951 16.4 3.22451C17.6167 3.74951 18.675 4.46201 19.575 5.36201C20.475 6.26201 21.1875 7.32034 21.7125 8.53701C22.2375 9.75368 22.5 11.0537 22.5 12.437V13.887C22.5 14.8703 22.1625 15.7078 21.4875 16.3995C20.8125 17.0912 19.9833 17.437 19 17.437C18.4167 17.437 17.8667 17.312 17.35 17.062C16.8333 16.812 16.4 16.4537 16.05 15.987C15.5667 16.4703 15.0208 16.8328 14.4125 17.0745C13.8042 17.3162 13.1667 17.437 12.5 17.437C11.1167 17.437 9.9375 16.9495 8.9625 15.9745C7.9875 14.9995 7.5 13.8203 7.5 12.437C7.5 11.0537 7.9875 9.87451 8.9625 8.89951C9.9375 7.92451 11.1167 7.43701 12.5 7.43701C13.8833 7.43701 15.0625 7.92451 16.0375 8.89951C17.0125 9.87451 17.5 11.0537 17.5 12.437V13.887C17.5 14.3203 17.6417 14.687 17.925 14.987C18.2083 15.287 18.5667 15.437 19 15.437C19.4333 15.437 19.7917 15.287 20.075 14.987C20.3583 14.687 20.5 14.3203 20.5 13.887V12.437C20.5 10.2037 19.725 8.31201 18.175 6.76201C16.625 5.21201 14.7333 4.43701 12.5 4.43701C10.2667 4.43701 8.375 5.21201 6.825 6.76201C5.275 8.31201 4.5 10.2037 4.5 12.437C4.5 14.6703 5.275 16.562 6.825 18.112C8.375 19.662 10.2667 20.437 12.5 20.437H17.5V22.437H12.5ZM12.5 15.437C13.3333 15.437 14.0417 15.1453 14.625 14.562C15.2083 13.9787 15.5 13.2703 15.5 12.437C15.5 11.6037 15.2083 10.8953 14.625 10.312C14.0417 9.72868 13.3333 9.43701 12.5 9.43701C11.6667 9.43701 10.9583 9.72868 10.375 10.312C9.79167 10.8953 9.5 11.6037 9.5 12.437C9.5 13.2703 9.79167 13.9787 10.375 14.562C10.9583 15.1453 11.6667 15.437 12.5 15.437Z\" fill=\"currentColor\"></path></svg><p color=\"$color_text_tertiary\" style=\"    color: var(--color_text_tertiary);\n" +
    "    font-size: 12px;\n" +
    "    list-spacing: 0;\n" +
    "    line-height: 100%;\n" +
    "    font-weight: 500;\n" +
    "    white-space: nowrap;\n" +
    "    overflow: hidden;\n" +
    "    text-overflow: ellipsis;\">이사예</p><svg width=\"16\" height=\"16\" viewBox=\"0 0 18 18\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" color=\"#f95939ff\"><path d=\"M15.75 12.578V5.42297C15.75 5.25797 15.66 5.10047 15.5175 5.01797L9.2325 1.43297C9.09 1.35047 8.9175 1.35047 8.775 1.43297L2.4825 5.01797C2.34 5.10047 2.25 5.25797 2.25 5.42297V12.5855C2.25 12.7505 2.34 12.908 2.4825 12.9905L8.7675 16.5755C8.91 16.658 9.0825 16.658 9.225 16.5755L15.51 12.9905C15.6525 12.908 15.7425 12.7505 15.7425 12.5855L15.75 12.578Z\" fill=\"url(#paint0_linear_14670_273716)\"></path><g filter=\"url(#filter0_i_14670_273716)\"><path d=\"M12.4169 7.5382L10.2944 7.2907C10.2944 7.2907 10.2269 7.2682 10.2194 7.2307L9.32686 5.2882C9.19936 5.0107 8.80186 5.0107 8.67436 5.2882L7.78186 7.2307C7.78186 7.2307 7.73686 7.2832 7.70686 7.2907L5.58436 7.5382C5.27686 7.5757 5.15686 7.9507 5.38186 8.1607L6.94936 9.6082C6.94936 9.6082 6.98686 9.6682 6.97936 9.6982L6.55936 11.7907C6.49936 12.0907 6.82186 12.3232 7.08436 12.1732L8.94436 11.1232C8.94436 11.1232 9.01186 11.1082 9.04186 11.1232L10.9019 12.1732C11.1719 12.3232 11.4869 12.0907 11.4269 11.7907L11.0069 9.6982C11.0069 9.6982 11.0069 9.6307 11.0369 9.6082L12.6044 8.1607C12.8294 7.9507 12.7094 7.5757 12.4019 7.5382H12.4169Z\" fill=\"url(#paint1_linear_14670_273716)\"></path></g><defs><filter id=\"filter0_i_14670_273716\" x=\"5.26562\" y=\"5.08008\" width=\"7.45312\" height=\"7.14062\" filterUnits=\"userSpaceOnUse\" color-interpolation-filters=\"sRGB\"><feFlood flood-opacity=\"0\" result=\"BackgroundImageFix\"></feFlood><feBlend mode=\"normal\" in=\"SourceGraphic\" in2=\"BackgroundImageFix\" result=\"shape\"></feBlend><feColorMatrix in=\"SourceAlpha\" type=\"matrix\" values=\"0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0\" result=\"hardAlpha\"></feColorMatrix><feOffset></feOffset><feGaussianBlur stdDeviation=\"0.68175\"></feGaussianBlur><feComposite in2=\"hardAlpha\" operator=\"arithmetic\" k2=\"-1\" k3=\"1\"></feComposite><feColorMatrix type=\"matrix\" values=\"0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0\"></feColorMatrix><feBlend mode=\"normal\" in2=\"shape\" result=\"effect1_innerShadow_14670_273716\"></feBlend></filter><linearGradient id=\"paint0_linear_14670_273716\" x1=\"9\" y1=\"1.37109\" x2=\"9\" y2=\"16.6373\" gradientUnits=\"userSpaceOnUse\"><stop stop-color=\"#FE1571\"></stop><stop offset=\"1\" stop-color=\"#FF27B4\"></stop></linearGradient><linearGradient id=\"paint1_linear_14670_273716\" x1=\"8.99311\" y1=\"5.08008\" x2=\"8.99311\" y2=\"12.22\" gradientUnits=\"userSpaceOnUse\"><stop stop-color=\"#FFFDEF\"></stop><stop offset=\"1\" stop-color=\"#FFFBDD\"></stop></linearGradient></defs></svg></div></div></div></div><div width=\"61px\" height=\"100%\" style=\"    width: 61px;\n" +
    "    height: 100%;\n" +
    "    position: absolute;\n" +
    "    top: 0;\n" +
    "    right: -1px;\n" +
    "    z-index: 2;\n" +
    "    background: linear-gradient(270deg, #1A1918 0%, rgba(26, 25, 24, 0.00) 100%);\"><button width=\"36px\" height=\"36px\" display=\"flex\" style=\"    position: absolute;\n" +
    "    right: 0;\n" +
    "    top: 60px;\n" +
    "    border-radius: 50%;\n" +
    "    border: 1px solid;\n" +
    "    border-color: var(--color_outline_secondary);\n" +
    "    width: 36px;\n" +
    "    height: 36px;\n" +
    "    display: -webkit-box;\n" +
    "    display: -webkit-flex;\n" +
    "    display: -ms-flexbox;\n" +
    "    display: flex;\n" +
    "    -webkit-box-pack: center;\n" +
    "    -ms-flex-pack: center;\n" +
    "    -webkit-justify-content: center;\n" +
    "    justify-content: center;\n" +
    "    -webkit-align-items: center;\n" +
    "    -webkit-box-align: center;\n" +
    "    -ms-flex-align: center;\n" +
    "    align-items: center;\n" +
    "    background-color: var(--color_surface_tertiary);\n" +
    "    z-index: 3;\"><svg width=\"24\" height=\"24\" viewBox=\"0 0 25 25\" fill=\"currentColor\" xmlns=\"http://www.w3.org/2000/svg\" color=\"#a8a69dff\"><path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M10.5 18.801L15.4498 13.8512L15.8033 13.4977C16.3891 12.9119 16.3891 11.9621 15.8033 11.3764L15.4498 11.0228L10.5 6.07305L9.08581 7.48726L14.0356 12.437L9.08581 17.3868L10.5 18.801Z\" fill=\"currentColor\"></path></svg></button></div></div></div>";
//플러스 랭킹 내부 모달 html + css
var plus_modal_front_html = "<div style=\"    position: fixed;\n" +
    "    inset: 0px;\n" +
    "    z-index: -1;\n" +
    "    background-color: var(--color_bg_dimmed);\n" +
    "    cursor: default;\"><div style=\"    width: 100%;\n" +
    "    height: 100%;\n" +
    "    display: flex;\n" +
    "    -webkit-box-align: center;\n" +
    "    align-items: center;\n" +
    "    -webkit-box-pack: center;\n" +
    "    justify-content: center;\n" +
    "    position: relative;\"><div width=\"444px\" display=\"flex\" height=\"776px\" style=\"    width: 444px;\n" +
    "    max-width: 100vw;\n" +
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
    "    flex-direction: column;\n" +
    "    height: 776px;\"><div display=\"flex\" width=\"100%\" height=\"66px\" style=\"    display: flex;\n" +
    "    flex-direction: row;\n" +
    "    width: 100%;\n" +
    "    height: 66px;\n" +
    "    min-height: 66px;\n" +
    "    padding-left: 24px;\n" +
    "    padding-right: 24px;\n" +
    "    -webkit-box-pack: justify;\n" +
    "    justify-content: space-between;\n" +
    "    -webkit-box-align: center;\n" +
    "    align-items: center;\n" +
    "    border-bottom-width: 1px;\n" +
    "    border-bottom-style: solid;\n" +
    "    border-color: var(--color_divider_primary);\"><p color=\"$color_text_primary\" style=\"    color: var(--color_text_primary);\n" +
    "    font-size: 20px;\n" +
    "    line-height: 100%;\n" +
    "    font-weight: 600;\">캐릭터 정보</p><button width=\"26px\" height=\"26px\" display=\"flex\" style=\"    width: 26px;\n" +
    "    height: 26px;\n" +
    "    display: flex;\n" +
    "    -webkit-box-pack: center;\n" +
    "    justify-content: center;\n" +
    "    -webkit-box-align: center;\n" +
    "    align-items: center;\"><svg width=\"26\" height=\"26\" viewBox=\"0 0 24 25\" fill=\"currentColor\" xmlns=\"http://www.w3.org/2000/svg\" color=\"#a8a69dff\"><path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M12 11.0228L7.05026 6.07305L5.63604 7.48726L10.5858 12.437L5.63604 17.3868L7.05026 18.801L12 13.8512L16.9498 18.801L18.364 17.3868L13.4142 12.437L18.364 7.48726L16.9498 6.07305L12 11.0228Z\" fill=\"currentColor\"></path></svg></button></div><div display=\"flex\" width=\"100%\" overflow=\"auto\" style=\"    display: flex;\n" +
    "    flex-direction: column;\n" +
    "    width: 100%;\n" +
    "    overflow: auto;\n" +
    "    scrollbar-width: none;\"><div width=\"100%\" style=\"    position: relative;\n" +
    "    width: 100%;\n" +
    "    min-width: 400px;\n" +
    "    border-bottom-width: 1px;\n" +
    "    height: 450px;\n" +
    "    border-bottom-style: solid;\n" +
    "    border-color: var(--color_divider_secondary);\n" +
    "    background-color: var(--color_surface_ivory);\n" +
    "    aspect-ratio: 1 / 1;\"><div overflow=\"hidden\" display=\"flex\" width=\"100%\" height=\"100%\" style=\"    position: relative;\n" +
    "    overflow: hidden;\n" +
    "    display: flex;\n" +
    "    -webkit-box-align: center;\n" +
    "    align-items: center;\n" +
    "    -webkit-box-pack: center;\n" +
    "    justify-content: center;\n" +
    "    width: 100%;\n" +
    "    height: 100%;\"><img src=\"https://d394jeh9729epj.cloudfront.net/8BBCYcZ8dfq-GGKOWTRZMTFZ/feaf47df-a068-424e-b9a8-0fa977928029_w600.webp\" alt=\"character_thumbnail\" style=\"width: 100%; height: 100%; object-fit: cover; position: absolute; top: 0px; left: 0px; border-radius: inherit;\"></div><button height=\"40px\" display=\"flex\" style=\"    position: absolute;\n" +
    "    bottom: 16px;\n" +
    "    right: 16px;\n" +
    "    height: 40px;\n" +
    "    padding-left: 16px;\n" +
    "    padding-right: 16px;\n" +
    "    gap: 8px;\n" +
    "    display: flex;\n" +
    "    -webkit-box-align: center;\n" +
    "    align-items: center;\n" +
    "    -webkit-box-pack: center;\n" +
    "    justify-content: center;\n" +
    "    border-width: 1px;\n" +
    "    border-style: solid;\n" +
    "    border-image: initial;\n" +
    "    border-color: var(--color_outline_tertiary);\n" +
    "    border-radius: 30px;\n" +
    "    background-color: var(--color_surface_ivory);\"><svg width=\"18\" height=\"18\" viewBox=\"0 0 25 25\" fill=\"currentColor\" xmlns=\"http://www.w3.org/2000/svg\" color=\"#f0efebff\"><path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M17.2432 6.23586L17.0825 7.43561L16.8146 9.43561L18.8325 9.43561L21.9996 9.43561C22.2759 9.43561 22.4998 9.65973 22.4996 9.93604L22.4947 15.4423C22.4918 18.7539 19.8064 21.437 16.4947 21.437L10.5 21.437L8.50001 21.437H4C3.72386 21.437 3.5 21.2132 3.5 20.937V10.937C3.5 10.6609 3.72386 10.437 4 10.437H8.5H8.51488L14.2339 2.80731C14.3905 2.59834 14.6816 2.54512 14.902 2.68515L15.8783 3.30529C16.8657 3.9325 17.3985 5.07644 17.2432 6.23586ZM8.5 12.437H5.5V19.437H8.50001L8.5 12.437ZM16.4947 19.437H10.5L10.5 11.1232L14.9855 5.13915C15.1972 5.35612 15.3023 5.66159 15.2609 5.97035L14.8323 9.1701L14.5289 11.4356H16.8146L20.4982 11.4356L20.4947 15.4405C20.4928 17.6483 18.7025 19.437 16.4947 19.437Z\" fill=\"currentColor\"></path></svg><p color=\"$color_text_primary\" style=\"    color: var(--color_text_primary);\n" +
    "    font-size: 16px;\n" +
    "    line-height: 100%;\n" +
    "    font-weight: 500;\">328</p></button></div><div display=\"flex\" width=\"100%\" style=\"    display: flex;\n" +
    "    flex-direction: column;\n" +
    "    width: 100%;\n" +
    "    padding: 24px 20px;\n" +
    "    gap: 20px;\"><div display=\"flex\" width=\"100%\" style=\"    display: flex;\n" +
    "    flex-direction: row;\n" +
    "    width: 100%;\n" +
    "    gap: 12px;\"><div display=\"flex\" style=\"    display: flex;\n" +
    "    flex-direction: column;\n" +
    "    gap: 4px;\"><p color=\"$color_text_primary\" style=\"    color: var(--color_text_primary);\n" +
    "    font-size: 20px;\n" +
    "    line-height: 100%;\n" +
    "    font-weight: 600;\">우리들의 시골 생활</p><a href=\"/character/profile/8BBCYcZ8dfq-GGKOWTRZMTFZ\"><div display=\"flex\" width=\"fit-content\" style=\"    display: flex;\n" +
    "    flex-direction: row;\n" +
    "    width: fit-content;\n" +
    "    -webkit-box-align: center;\n" +
    "    align-items: center;\n" +
    "    padding-right: 4px;\n" +
    "    padding-top: 4px;\n" +
    "    padding-bottom: 4px;\n" +
    "    gap: 2px;\n" +
    "    border-radius: 4px;\"><svg width=\"16\" height=\"16\" viewBox=\"0 0 25 25\" fill=\"currentColor\" xmlns=\"http://www.w3.org/2000/svg\" color=\"#85837dff\"><path d=\"M12.5 22.437C11.1167 22.437 9.81667 22.1745 8.6 21.6495C7.38333 21.1245 6.325 20.412 5.425 19.512C4.525 18.612 3.8125 17.5537 3.2875 16.337C2.7625 15.1203 2.5 13.8203 2.5 12.437C2.5 11.0537 2.7625 9.75368 3.2875 8.53701C3.8125 7.32034 4.525 6.26201 5.425 5.36201C6.325 4.46201 7.38333 3.74951 8.6 3.22451C9.81667 2.69951 11.1167 2.43701 12.5 2.43701C13.8833 2.43701 15.1833 2.69951 16.4 3.22451C17.6167 3.74951 18.675 4.46201 19.575 5.36201C20.475 6.26201 21.1875 7.32034 21.7125 8.53701C22.2375 9.75368 22.5 11.0537 22.5 12.437V13.887C22.5 14.8703 22.1625 15.7078 21.4875 16.3995C20.8125 17.0912 19.9833 17.437 19 17.437C18.4167 17.437 17.8667 17.312 17.35 17.062C16.8333 16.812 16.4 16.4537 16.05 15.987C15.5667 16.4703 15.0208 16.8328 14.4125 17.0745C13.8042 17.3162 13.1667 17.437 12.5 17.437C11.1167 17.437 9.9375 16.9495 8.9625 15.9745C7.9875 14.9995 7.5 13.8203 7.5 12.437C7.5 11.0537 7.9875 9.87451 8.9625 8.89951C9.9375 7.92451 11.1167 7.43701 12.5 7.43701C13.8833 7.43701 15.0625 7.92451 16.0375 8.89951C17.0125 9.87451 17.5 11.0537 17.5 12.437V13.887C17.5 14.3203 17.6417 14.687 17.925 14.987C18.2083 15.287 18.5667 15.437 19 15.437C19.4333 15.437 19.7917 15.287 20.075 14.987C20.3583 14.687 20.5 14.3203 20.5 13.887V12.437C20.5 10.2037 19.725 8.31201 18.175 6.76201C16.625 5.21201 14.7333 4.43701 12.5 4.43701C10.2667 4.43701 8.375 5.21201 6.825 6.76201C5.275 8.31201 4.5 10.2037 4.5 12.437C4.5 14.6703 5.275 16.562 6.825 18.112C8.375 19.662 10.2667 20.437 12.5 20.437H17.5V22.437H12.5ZM12.5 15.437C13.3333 15.437 14.0417 15.1453 14.625 14.562C15.2083 13.9787 15.5 13.2703 15.5 12.437C15.5 11.6037 15.2083 10.8953 14.625 10.312C14.0417 9.72868 13.3333 9.43701 12.5 9.43701C11.6667 9.43701 10.9583 9.72868 10.375 10.312C9.79167 10.8953 9.5 11.6037 9.5 12.437C9.5 13.2703 9.79167 13.9787 10.375 14.562C10.9583 15.1453 11.6667 15.437 12.5 15.437Z\" fill=\"currentColor\"></path></svg><p color=\"$color_text_tertiary\" style=\"    color: var(--color_text_tertiary);\n" +
    "    font-size: 15px;\n" +
    "    line-height: 100%;\n" +
    "    font-weight: 500;\">온유월</p><svg width=\"16\" height=\"16\" viewBox=\"0 0 18 18\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" color=\"#f95939ff\"><path d=\"M15.75 12.578V5.42297C15.75 5.25797 15.66 5.10047 15.5175 5.01797L9.2325 1.43297C9.09 1.35047 8.9175 1.35047 8.775 1.43297L2.4825 5.01797C2.34 5.10047 2.25 5.25797 2.25 5.42297V12.5855C2.25 12.7505 2.34 12.908 2.4825 12.9905L8.7675 16.5755C8.91 16.658 9.0825 16.658 9.225 16.5755L15.51 12.9905C15.6525 12.908 15.7425 12.7505 15.7425 12.5855L15.75 12.578Z\" fill=\"url(#paint0_linear_14670_273716)\"></path><g filter=\"url(#filter0_i_14670_273716)\"><path d=\"M12.4169 7.5382L10.2944 7.2907C10.2944 7.2907 10.2269 7.2682 10.2194 7.2307L9.32686 5.2882C9.19936 5.0107 8.80186 5.0107 8.67436 5.2882L7.78186 7.2307C7.78186 7.2307 7.73686 7.2832 7.70686 7.2907L5.58436 7.5382C5.27686 7.5757 5.15686 7.9507 5.38186 8.1607L6.94936 9.6082C6.94936 9.6082 6.98686 9.6682 6.97936 9.6982L6.55936 11.7907C6.49936 12.0907 6.82186 12.3232 7.08436 12.1732L8.94436 11.1232C8.94436 11.1232 9.01186 11.1082 9.04186 11.1232L10.9019 12.1732C11.1719 12.3232 11.4869 12.0907 11.4269 11.7907L11.0069 9.6982C11.0069 9.6982 11.0069 9.6307 11.0369 9.6082L12.6044 8.1607C12.8294 7.9507 12.7094 7.5757 12.4019 7.5382H12.4169Z\" fill=\"url(#paint1_linear_14670_273716)\"></path></g><defs><filter id=\"filter0_i_14670_273716\" x=\"5.26562\" y=\"5.08008\" width=\"7.45312\" height=\"7.14062\" filterUnits=\"userSpaceOnUse\" color-interpolation-filters=\"sRGB\"><feFlood flood-opacity=\"0\" result=\"BackgroundImageFix\"></feFlood><feBlend mode=\"normal\" in=\"SourceGraphic\" in2=\"BackgroundImageFix\" result=\"shape\"></feBlend><feColorMatrix in=\"SourceAlpha\" type=\"matrix\" values=\"0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0\" result=\"hardAlpha\"></feColorMatrix><feOffset></feOffset><feGaussianBlur stdDeviation=\"0.68175\"></feGaussianBlur><feComposite in2=\"hardAlpha\" operator=\"arithmetic\" k2=\"-1\" k3=\"1\"></feComposite><feColorMatrix type=\"matrix\" values=\"0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0\"></feColorMatrix><feBlend mode=\"normal\" in2=\"shape\" result=\"effect1_innerShadow_14670_273716\"></feBlend></filter><linearGradient id=\"paint0_linear_14670_273716\" x1=\"9\" y1=\"1.37109\" x2=\"9\" y2=\"16.6373\" gradientUnits=\"userSpaceOnUse\"><stop stop-color=\"#FE1571\"></stop><stop offset=\"1\" stop-color=\"#FF27B4\"></stop></linearGradient><linearGradient id=\"paint1_linear_14670_273716\" x1=\"8.99311\" y1=\"5.08008\" x2=\"8.99311\" y2=\"12.22\" gradientUnits=\"userSpaceOnUse\"><stop stop-color=\"#FFFDEF\"></stop><stop offset=\"1\" stop-color=\"#FFFBDD\"></stop></linearGradient></defs></svg></div></a></div><div display=\"flex\" style=\"    display: -webkit-box;\n" +
    "    display: -webkit-flex;\n" +
    "    display: -ms-flexbox;\n" +
    "    display: flex;\n" +
    "    -webkit-flex: 1;\n" +
    "    -ms-flex: 1;\n" +
    "    flex: 1;\"></div><button width=\"24px\" height=\"24px\" style=\"    width: 24px;\n" +
    "    height: 24px;\n" +
    "    border-radius: 3px;\n" +
    "    background-color: transparent;\"><svg width=\"24\" height=\"24\" viewBox=\"0 0 25 25\" fill=\"currentColor\" xmlns=\"http://www.w3.org/2000/svg\" color=\"#a8a69dff\"><path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M7.5 12.437C7.5 13.5416 6.60457 14.437 5.5 14.437C4.39543 14.437 3.5 13.5416 3.5 12.437C3.5 11.3324 4.39543 10.437 5.5 10.437C6.60457 10.437 7.5 11.3324 7.5 12.437ZM14.5 12.437C14.5 13.5416 13.6046 14.437 12.5 14.437C11.3954 14.437 10.5 13.5416 10.5 12.437C10.5 11.3324 11.3954 10.437 12.5 10.437C13.6046 10.437 14.5 11.3324 14.5 12.437ZM19.5 14.437C20.6046 14.437 21.5 13.5416 21.5 12.437C21.5 11.3324 20.6046 10.437 19.5 10.437C18.3954 10.437 17.5 11.3324 17.5 12.437C17.5 13.5416 18.3954 14.437 19.5 14.437Z\" fill=\"currentColor\"></path></svg></button></div><div display=\"flex\" width=\"100%\" style=\"    display: flex;\n" +
    "    flex-flow: wrap;\n" +
    "    width: 100%;\n" +
    "    gap: 8px;\"><div display=\"flex\" style=\"    display: flex;\n" +
    "    flex-direction: row;\n" +
    "    padding: 4px 6px;\n" +
    "    gap: 4px;\n" +
    "    -webkit-box-align: center;\n" +
    "    align-items: center;\n" +
    "    border-width: 1px;\n" +
    "    border-style: solid;\n" +
    "    border-image: initial;\n" +
    "    border-color: var(--color_outline_secondary);\n" +
    "    border-radius: 4px;\n" +
    "    background-color: var(--color_surface_elevated);\"><svg width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"currentColor\" xmlns=\"http://www.w3.org/2000/svg\" color=\"#85837dff\"><mask id=\"mask0_13669_84\" maskUnits=\"userSpaceOnUse\" x=\"0\" y=\"0\" width=\"24\" height=\"24\" style=\"mask-type: alpha;\"><rect width=\"24\" height=\"24\" fill=\"currentColor\"></rect></mask><g mask=\"url(#mask0_13669_84)\"><path d=\"M11.951 13.4023L17.3804 9.78409L11.951 6.16591V13.4023ZM6.25011 20.9778C5.75241 21.0532 5.30373 20.9364 4.90406 20.6273C4.5044 20.3183 4.2744 19.915 4.21408 19.4175L3.01508 9.53534C2.95475 9.03784 3.07541 8.5931 3.37704 8.20113C3.67868 7.80916 4.07834 7.58303 4.57604 7.52272L5.61667 7.38704V14.7591C5.61667 15.7541 5.97109 16.6059 6.67993 17.3144C7.38877 18.023 8.24089 18.3773 9.23628 18.3773H17.6519C17.5614 18.7391 17.3804 19.0519 17.1089 19.3157C16.8375 19.5796 16.5057 19.7341 16.1135 19.7793L6.25011 20.9778ZM9.23628 16.5682C8.73858 16.5682 8.31253 16.391 7.95811 16.0368C7.60369 15.6825 7.42648 15.2566 7.42648 14.7591V4.80909C7.42648 4.31159 7.60369 3.8857 7.95811 3.53142C8.31253 3.17714 8.73858 3 9.23628 3H19.1902C19.6879 3 20.114 3.17714 20.4684 3.53142C20.8228 3.8857 21 4.31159 21 4.80909V14.7591C21 15.2566 20.8228 15.6825 20.4684 16.0368C20.114 16.391 19.6879 16.5682 19.1902 16.5682H9.23628Z\" fill=\"currentColor\"></path></g></svg><p color=\"$color_text_secondary\" style=\"    color: var(--color_text_secondary);\n" +
    "    font-size: 14px;\n" +
    "    line-height: 100%;\n" +
    "    font-weight: 500;\">이미지 27장</p></div><div display=\"flex\" style=\"    display: flex;\n" +
    "    flex-direction: row;\n" +
    "    padding: 4px 6px;\n" +
    "    gap: 4px;\n" +
    "    -webkit-box-align: center;\n" +
    "    align-items: center;\n" +
    "    border-width: 1px;\n" +
    "    border-style: solid;\n" +
    "    border-image: initial;\n" +
    "    border-color: var(--color_outline_secondary);\n" +
    "    border-radius: 4px;\n" +
    "    background-color: var(--color_surface_elevated);\"><img src=\"https://d1k8apdmymvh8f.cloudfront.net/Character/prompt-template/simulation-dark.webp\" style=\"width: 16px; height: 16px;\"><p color=\"$color_text_secondary\" style=\"    color: var(--color_text_secondary);\n" +
    "    font-size: 14px;\n" +
    "    line-height: 100%;\n" +
    "    font-weight: 500;\">시뮬레이션</p></div></div><div display=\"flex\" style=\"    display: flex;\n" +
    "    flex-direction: column;\n" +
    "    gap: 4px;\"><p color=\"$color_text_primary\" style=\"    color: var(--color_text_primary);\n" +
    "    font-size: 16px;\n" +
    "    line-height: 160%;\n" +
    "    font-weight: 500;\">[힐링]오롯이 당신의 휴식을 위한, 아름다운 시골생활\n" +
    "집에 가던 길, 전철 안에서 깜빡 잠이 들었다. 눈을 떴을 때 보인 것은 시골 기차역과 자연의 푸르른 향기였다. 시골 마을의 다정다감한 이웃들과 함께하는 힐링 라이프.\n" +
    "___\n" +
    "✨️몰입도를 위해 캐릭터 이미지와 수채화 형식 마을 일러스트가 포험되어 있습니다!\n" +
    "❤️좋아요와 팔로우, 댓글은 제작에 큰 힘이 됩니다! \n" +
    "\n" +
    "(참고: 남성/여성 플레이어 성별 선택 가능. 달라지는 건 하숙할 장소 선택지)</p><div display=\"flex\" style=\"    display: flex;\n" +
    "    flex-flow: wrap;\n" +
    "    gap: 0px 8px;\"><p color=\"$color_text_accent_bg_blue\" style=\"    color: var(--color_text_accent_bg_blue);\n" +
    "    font-size: 16px;\n" +
    "    line-height: 160%;\n" +
    "    font-weight: 500;\">#힐링</p></div></div><div display=\"flex\" width=\"100%\" style=\"    display: flex;\n" +
    "    flex-flow: wrap;\n" +
    "    width: 100%;\n" +
    "    gap: 12px;\"><div style=\"    position: relative;\n" +
    "    user-select: none;\"><div display=\"flex\" style=\"    display: flex;\n" +
    "    flex-direction: row;\n" +
    "    -webkit-box-align: center;\n" +
    "    align-items: center;\n" +
    "    gap: 4px;\n" +
    "    padding-top: 4px;\n" +
    "    padding-bottom: 4px;\n" +
    "    padding-right: 4px;\n" +
    "    border-radius: 4px;\"><svg width=\"20\" height=\"20\" viewBox=\"0 0 25 25\" fill=\"currentColor\" xmlns=\"http://www.w3.org/2000/svg\" color=\"#85837dff\"><path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M15.5 8.43701C15.5 10.0939 14.1569 11.437 12.5 11.437C10.8431 11.437 9.5 10.0939 9.5 8.43701C9.5 6.78016 10.8431 5.43701 12.5 5.43701C14.1569 5.43701 15.5 6.78016 15.5 8.43701ZM17.5 8.43701C17.5 11.1984 15.2614 13.437 12.5 13.437C9.73858 13.437 7.5 11.1984 7.5 8.43701C7.5 5.67559 9.73858 3.43701 12.5 3.43701C15.2614 3.43701 17.5 5.67559 17.5 8.43701ZM12.5 14.437C10.5011 14.437 8.26488 14.574 6.51834 15.5339C5.61757 16.029 4.84466 16.7428 4.30622 17.7468C3.77252 18.7421 3.5 19.9645 3.5 21.437H5.5C5.5 20.2072 5.72748 19.3285 6.06878 18.692C6.40534 18.0644 6.88243 17.616 7.48166 17.2866C8.73512 16.5977 10.4989 16.437 12.5 16.437C14.5011 16.437 16.2649 16.5977 17.5183 17.2866C18.1176 17.616 18.5947 18.0644 18.9312 18.692C19.2725 19.3285 19.5 20.2072 19.5 21.437H21.5C21.5 19.9645 21.2275 18.7421 20.6938 17.7468C20.1553 16.7428 19.3824 16.029 18.4817 15.5339C16.7351 14.574 14.4989 14.437 12.5 14.437Z\" fill=\"currentColor\"></path></svg><p color=\"$color_text_tertiary\" style=\"    color: var(--color_text_tertiary);\n" +
    "    font-size: 16px;\n" +
    "    line-height: 100%;\n" +
    "    font-weight: 500;\">1.4K</p></div><div display=\"flex\" color=\"$palette_gray_gray_white\" style=\"    position: absolute;\n" +
    "    top: calc(100% + 4px);\n" +
    "    left: 0px;\n" +
    "    background-color: var(--palette_gray_gray_black);\n" +
    "    color: var(--palette_gray_gray_white);\n" +
    "    padding: 7px;\n" +
    "    border-radius: 3px;\n" +
    "    border-width: 1px;\n" +
    "    border-style: solid;\n" +
    "    border-image: initial;\n" +
    "    border-color: var(--color_outline_secondary);\n" +
    "    z-index: 3;\n" +
    "    white-space: nowrap;\n" +
    "    display: none;\n" +
    "    user-select: none;\"><p width=\"max-content\" style=\"    width: max-content;\n" +
    "    font-size: 13px;\n" +
    "    line-height: 140%;\n" +
    "    font-weight: 500;\n" +
    "    white-space: pre-wrap;\n" +
    "    user-select: none;\">대화 나눈 사람 수</p></div></div><div style=\"    position: relative;\n" +
    "    user-select: none;\"><div display=\"flex\" style=\"    display: flex;\n" +
    "    flex-direction: row;\n" +
    "    -webkit-box-align: center;\n" +
    "    align-items: center;\n" +
    "    gap: 4px;\n" +
    "    padding-top: 4px;\n" +
    "    padding-bottom: 4px;\n" +
    "    padding-right: 4px;\n" +
    "    border-radius: 4px;\"><svg width=\"20\" height=\"20\" viewBox=\"0 0 25 25\" fill=\"currentColor\" xmlns=\"http://www.w3.org/2000/svg\" color=\"#85837dff\"><path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M17.2432 6.23586L17.0825 7.43561L16.8146 9.43561L18.8325 9.43561L21.9996 9.43561C22.2759 9.43561 22.4998 9.65973 22.4996 9.93604L22.4947 15.4423C22.4918 18.7539 19.8064 21.437 16.4947 21.437L10.5 21.437L8.50001 21.437H4C3.72386 21.437 3.5 21.2132 3.5 20.937V10.937C3.5 10.6609 3.72386 10.437 4 10.437H8.5H8.51488L14.2339 2.80731C14.3905 2.59834 14.6816 2.54512 14.902 2.68515L15.8783 3.30529C16.8657 3.9325 17.3985 5.07644 17.2432 6.23586ZM8.5 12.437H5.5V19.437H8.50001L8.5 12.437ZM16.4947 19.437H10.5L10.5 11.1232L14.9855 5.13915C15.1972 5.35612 15.3023 5.66159 15.2609 5.97035L14.8323 9.1701L14.5289 11.4356H16.8146L20.4982 11.4356L20.4947 15.4405C20.4928 17.6483 18.7025 19.437 16.4947 19.437Z\" fill=\"currentColor\"></path></svg><p color=\"$color_text_tertiary\" style=\"    color: var(--color_text_tertiary);\n" +
    "    font-size: 16px;\n" +
    "    line-height: 100%;\n" +
    "    font-weight: 500;\">328</p></div><div display=\"flex\" color=\"$palette_gray_gray_white\" style=\"    position: absolute;\n" +
    "    top: calc(100% + 4px);\n" +
    "    left: 0px;\n" +
    "    background-color: var(--palette_gray_gray_black);\n" +
    "    color: var(--palette_gray_gray_white);\n" +
    "    padding: 7px;\n" +
    "    border-radius: 3px;\n" +
    "    border-width: 1px;\n" +
    "    border-style: solid;\n" +
    "    border-image: initial;\n" +
    "    border-color: var(--color_outline_secondary);\n" +
    "    z-index: 3;\n" +
    "    white-space: nowrap;\n" +
    "    display: none;\n" +
    "    user-select: none;\"><p width=\"max-content\" style=\"    width: max-content;\n" +
    "    font-size: 13px;\n" +
    "    line-height: 140%;\n" +
    "    font-weight: 500;\n" +
    "    white-space: pre-wrap;\n" +
    "    user-select: none;\">좋아요 수</p></div></div><div style=\"    position: relative;\n" +
    "    user-select: none;\"><div display=\"flex\" style=\"    display: flex;\n" +
    "    flex-direction: row;\n" +
    "    -webkit-box-align: center;\n" +
    "    align-items: center;\n" +
    "    gap: 4px;\n" +
    "    padding-top: 4px;\n" +
    "    padding-bottom: 4px;\n" +
    "    padding-right: 4px;\n" +
    "    border-radius: 4px;\"><svg width=\"20\" height=\"20\" viewBox=\"0 0 24 24\" fill=\"currentColor\" xmlns=\"http://www.w3.org/2000/svg\" color=\"#85837dff\"><path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M10 5H14C17.3137 5 20 7.68629 20 11C20 14.3137 17.3137 17 14 17H8.71215L5.55919 18.8924C5.87427 17.6729 6.09496 16.8008 6.2234 16.2932C6.31168 15.9443 6.35638 15.7676 6.35821 15.7688C4.92467 14.6723 4 12.9442 4 11C4 7.68629 6.68629 5 10 5ZM4.11706 16.4214C2.80278 14.996 2 13.0917 2 11C2 6.58172 5.58172 3 10 3H14C18.4183 3 22 6.58172 22 11C22 15.4183 18.4183 19 14 19H9.30754L4.51572 21.855C4.16885 22.0638 3.7303 22.0428 3.40492 21.8019C3.07954 21.561 2.93153 21.1476 3.03004 20.7549L4.11706 16.4214Z\" fill=\"currentColor\"></path></svg><p color=\"$color_text_tertiary\" style=\"    color: var(--color_text_tertiary);\n" +
    "    font-size: 16px;\n" +
    "    line-height: 100%;\n" +
    "    font-weight: 500;\">34</p></div><div display=\"flex\" color=\"$palette_gray_gray_white\" style=\"    position: absolute;\n" +
    "    top: calc(100% + 4px);\n" +
    "    left: 0px;\n" +
    "    background-color: var(--palette_gray_gray_black);\n" +
    "    color: var(--palette_gray_gray_white);\n" +
    "    padding: 7px;\n" +
    "    border-radius: 3px;\n" +
    "    border-width: 1px;\n" +
    "    border-style: solid;\n" +
    "    border-image: initial;\n" +
    "    border-color: var(--color_outline_secondary);\n" +
    "    z-index: 3;\n" +
    "    white-space: nowrap;\n" +
    "    display: none;\n" +
    "    user-select: none;\"><p width=\"max-content\" style=\"    width: max-content;\n" +
    "    font-size: 13px;\n" +
    "    line-height: 140%;\n" +
    "    font-weight: 500;\n" +
    "    white-space: pre-wrap;\n" +
    "    user-select: none;\">댓글 수</p></div></div></div></div></div><div display=\"flex\" style=\"    display: -webkit-box;\n" +
    "    display: -webkit-flex;\n" +
    "    display: -ms-flexbox;\n" +
    "    display: flex;\n" +
    "    -webkit-flex: 1;\n" +
    "    -ms-flex: 1;\n" +
    "    flex: 1;\"></div><div display=\"flex\" width=\"100%\" style=\"    display: flex;\n" +
    "    flex-direction: row;\n" +
    "    width: 100%;\n" +
    "    padding: 16px 20px;\n" +
    "    gap: 12px;\n" +
    "    border-top-width: 1px;\n" +
    "    border-top-style: solid;\n" +
    "    border-color: var(--color_divider_primary);\"><button display=\"flex\" width=\"100%\" height=\"48px\" color=\"$color_text_ivory\" style=\"    border-radius: 5px;\n" +
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
    "    height: 48px;\n" +
    "    background-color: var(--color_surface_primary);\n" +
    "    color: var(--color_text_ivory);\n" +
    "    font-size: 16px;\n" +
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
    "    align-items: center;\">대화하기</div></button></div></div></div></div>";
var feed_struct_element_front_html = "<div display=\"flex\" class=\"css-1878569\"><div width=\"100%\" height=\"148px,156px\" class=\"css-12gw3o5\"><div class=\"character_avatar css-1w95giw\" overflow=\"hidden\" display=\"flex\" width=\"100%\" height=\"100%\"><img src=\"https://d394jeh9729epj.cloudfront.net/8BwuNilwTjW-GGKONkJEOUk2/b176b0a9-46e0-4d93-baff-7dace3602f6e_w600.webp\" alt=\"character_thumbnail\" style=\"width: 100%; height: 100%; object-fit: cover; position: absolute; top: 0px; left: 0px; border-radius: inherit;\"></div><div class=\"character-card-overlay css-1w1m2cv\" width=\"100%\" height=\"100%\" display=\"none\"></div><div display=\"flex\" class=\"css-17z36ob\"><div width=\"28px\" height=\"28px\" display=\"flex\" class=\"css-1bygmye\"><svg xmlns=\"http://www.w3.org/2000/svg\" width=\"20\" height=\"20\" viewBox=\"0 0 16 16\" fill=\"none\"><mask id=\"mask0_8669_146020\" maskUnits=\"userSpaceOnUse\" x=\"0\" y=\"0\" width=\"16\" height=\"16\" style=\"mask-type: alpha;\"><rect width=\"16\" height=\"16\" fill=\"#D9D9D9\"></rect></mask><g mask=\"url(#mask0_8669_146020)\"><path d=\"M7.9974 8.66732C8.64184 8.66732 9.19184 8.43954 9.6474 7.98398C10.103 7.52843 10.3307 6.97843 10.3307 6.33398C10.3307 5.68954 10.103 5.13954 9.6474 4.68398C9.19184 4.22843 8.64184 4.00065 7.9974 4.00065C7.35295 4.00065 6.80295 4.22843 6.3474 4.68398C5.89184 5.13954 5.66406 5.68954 5.66406 6.33398C5.66406 6.97843 5.89184 7.52843 6.3474 7.98398C6.80295 8.43954 7.35295 8.66732 7.9974 8.66732ZM7.9974 14.6673C6.37517 14.2562 5.08073 13.3673 4.11406 12.0007C3.1474 10.634 2.66406 9.10065 2.66406 7.40065V3.33398L7.9974 1.33398L13.3307 3.33398V7.40065C13.3307 9.10065 12.8474 10.634 11.8807 12.0007C10.9141 13.3673 9.61962 14.2562 7.9974 14.6673ZM7.9974 13.2673C8.65295 13.0562 9.23351 12.7257 9.73906 12.2757C10.2446 11.8257 10.6863 11.3173 11.0641 10.7507C10.5863 10.5062 10.0891 10.3201 9.5724 10.1923C9.05573 10.0645 8.53073 10.0007 7.9974 10.0007C7.46406 10.0007 6.93906 10.0645 6.4224 10.1923C5.90573 10.3201 5.40851 10.5062 4.93073 10.7507C5.30851 11.3173 5.75017 11.8257 6.25573 12.2757C6.76129 12.7257 7.34184 13.0562 7.9974 13.2673Z\" fill=\"#FED4D3\"></path></g></svg></div><div width=\"28px\" height=\"28px\" display=\"flex\" class=\"css-1bygmye\"><svg width=\"20\" height=\"20\" viewBox=\"0 0 24 24\" fill=\"currentColor\" xmlns=\"http://www.w3.org/2000/svg\" color=\"#ffffffff\"><mask id=\"mask0_13669_84\" maskUnits=\"userSpaceOnUse\" x=\"0\" y=\"0\" width=\"24\" height=\"24\" style=\"mask-type: alpha;\"><rect width=\"24\" height=\"24\" fill=\"currentColor\"></rect></mask><g mask=\"url(#mask0_13669_84)\"><path d=\"M11.951 13.4023L17.3804 9.78409L11.951 6.16591V13.4023ZM6.25011 20.9778C5.75241 21.0532 5.30373 20.9364 4.90406 20.6273C4.5044 20.3183 4.2744 19.915 4.21408 19.4175L3.01508 9.53534C2.95475 9.03784 3.07541 8.5931 3.37704 8.20113C3.67868 7.80916 4.07834 7.58303 4.57604 7.52272L5.61667 7.38704V14.7591C5.61667 15.7541 5.97109 16.6059 6.67993 17.3144C7.38877 18.023 8.24089 18.3773 9.23628 18.3773H17.6519C17.5614 18.7391 17.3804 19.0519 17.1089 19.3157C16.8375 19.5796 16.5057 19.7341 16.1135 19.7793L6.25011 20.9778ZM9.23628 16.5682C8.73858 16.5682 8.31253 16.391 7.95811 16.0368C7.60369 15.6825 7.42648 15.2566 7.42648 14.7591V4.80909C7.42648 4.31159 7.60369 3.8857 7.95811 3.53142C8.31253 3.17714 8.73858 3 9.23628 3H19.1902C19.6879 3 20.114 3.17714 20.4684 3.53142C20.8228 3.8857 21 4.31159 21 4.80909V14.7591C21 15.2566 20.8228 15.6825 20.4684 16.0368C20.114 16.391 19.6879 16.5682 19.1902 16.5682H9.23628Z\" fill=\"currentColor\"></path></g></svg></div></div></div><div display=\"flex\" class=\"css-19ssvua\"><p color=\"$color_text_primary\" class=\"css-sjt0pv\">NTR 오피스</p><p color=\"$color_text_secondary\" class=\"css-9xnb32\">[R18/이미지 30장] 부하직원의 상사가 되어 그의 아내를 NTR하자! (NTL) / 요즘 부장님이 내 아내를 보는 눈빛이 심상치 않다... 더군다나, 아내도 요즘 태도가 변하기 시작했다... (NTR)\n" +
        "\n" +
        "[스토리: 1일차~14일차, 8~11일차 온천 접대 이벤트]</p></div></div><div display=\"flex\" width=\"fit-content\" class=\"css-13rssxq\"><svg width=\"16\" height=\"16\" viewBox=\"0 0 25 25\" fill=\"currentColor\" xmlns=\"http://www.w3.org/2000/svg\" color=\"#85837dff\"><path d=\"M12.5 22.437C11.1167 22.437 9.81667 22.1745 8.6 21.6495C7.38333 21.1245 6.325 20.412 5.425 19.512C4.525 18.612 3.8125 17.5537 3.2875 16.337C2.7625 15.1203 2.5 13.8203 2.5 12.437C2.5 11.0537 2.7625 9.75368 3.2875 8.53701C3.8125 7.32034 4.525 6.26201 5.425 5.36201C6.325 4.46201 7.38333 3.74951 8.6 3.22451C9.81667 2.69951 11.1167 2.43701 12.5 2.43701C13.8833 2.43701 15.1833 2.69951 16.4 3.22451C17.6167 3.74951 18.675 4.46201 19.575 5.36201C20.475 6.26201 21.1875 7.32034 21.7125 8.53701C22.2375 9.75368 22.5 11.0537 22.5 12.437V13.887C22.5 14.8703 22.1625 15.7078 21.4875 16.3995C20.8125 17.0912 19.9833 17.437 19 17.437C18.4167 17.437 17.8667 17.312 17.35 17.062C16.8333 16.812 16.4 16.4537 16.05 15.987C15.5667 16.4703 15.0208 16.8328 14.4125 17.0745C13.8042 17.3162 13.1667 17.437 12.5 17.437C11.1167 17.437 9.9375 16.9495 8.9625 15.9745C7.9875 14.9995 7.5 13.8203 7.5 12.437C7.5 11.0537 7.9875 9.87451 8.9625 8.89951C9.9375 7.92451 11.1167 7.43701 12.5 7.43701C13.8833 7.43701 15.0625 7.92451 16.0375 8.89951C17.0125 9.87451 17.5 11.0537 17.5 12.437V13.887C17.5 14.3203 17.6417 14.687 17.925 14.987C18.2083 15.287 18.5667 15.437 19 15.437C19.4333 15.437 19.7917 15.287 20.075 14.987C20.3583 14.687 20.5 14.3203 20.5 13.887V12.437C20.5 10.2037 19.725 8.31201 18.175 6.76201C16.625 5.21201 14.7333 4.43701 12.5 4.43701C10.2667 4.43701 8.375 5.21201 6.825 6.76201C5.275 8.31201 4.5 10.2037 4.5 12.437C4.5 14.6703 5.275 16.562 6.825 18.112C8.375 19.662 10.2667 20.437 12.5 20.437H17.5V22.437H12.5ZM12.5 15.437C13.3333 15.437 14.0417 15.1453 14.625 14.562C15.2083 13.9787 15.5 13.2703 15.5 12.437C15.5 11.6037 15.2083 10.8953 14.625 10.312C14.0417 9.72868 13.3333 9.43701 12.5 9.43701C11.6667 9.43701 10.9583 9.72868 10.375 10.312C9.79167 10.8953 9.5 11.6037 9.5 12.437C9.5 13.2703 9.79167 13.9787 10.375 14.562C10.9583 15.1453 11.6667 15.437 12.5 15.437Z\" fill=\"currentColor\"></path></svg><p color=\"$color_text_tertiary\" class=\"css-uoinwu\">야로망</p><svg width=\"16\" height=\"16\" viewBox=\"0 0 18 18\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" color=\"#f72f08ff\"><path d=\"M15.75 12.578V5.42297C15.75 5.25797 15.66 5.10047 15.5175 5.01797L9.2325 1.43297C9.09 1.35047 8.9175 1.35047 8.775 1.43297L2.4825 5.01797C2.34 5.10047 2.25 5.25797 2.25 5.42297V12.5855C2.25 12.7505 2.34 12.908 2.4825 12.9905L8.7675 16.5755C8.91 16.658 9.0825 16.658 9.225 16.5755L15.51 12.9905C15.6525 12.908 15.7425 12.7505 15.7425 12.5855L15.75 12.578Z\" fill=\"url(#paint0_linear_14670_273716)\"></path><g filter=\"url(#filter0_i_14670_273716)\"><path d=\"M12.4169 7.5382L10.2944 7.2907C10.2944 7.2907 10.2269 7.2682 10.2194 7.2307L9.32686 5.2882C9.19936 5.0107 8.80186 5.0107 8.67436 5.2882L7.78186 7.2307C7.78186 7.2307 7.73686 7.2832 7.70686 7.2907L5.58436 7.5382C5.27686 7.5757 5.15686 7.9507 5.38186 8.1607L6.94936 9.6082C6.94936 9.6082 6.98686 9.6682 6.97936 9.6982L6.55936 11.7907C6.49936 12.0907 6.82186 12.3232 7.08436 12.1732L8.94436 11.1232C8.94436 11.1232 9.01186 11.1082 9.04186 11.1232L10.9019 12.1732C11.1719 12.3232 11.4869 12.0907 11.4269 11.7907L11.0069 9.6982C11.0069 9.6982 11.0069 9.6307 11.0369 9.6082L12.6044 8.1607C12.8294 7.9507 12.7094 7.5757 12.4019 7.5382H12.4169Z\" fill=\"url(#paint1_linear_14670_273716)\"></path></g><defs><filter id=\"filter0_i_14670_273716\" x=\"5.26562\" y=\"5.08008\" width=\"7.45312\" height=\"7.14062\" filterUnits=\"userSpaceOnUse\" color-interpolation-filters=\"sRGB\"><feFlood flood-opacity=\"0\" result=\"BackgroundImageFix\"></feFlood><feBlend mode=\"normal\" in=\"SourceGraphic\" in2=\"BackgroundImageFix\" result=\"shape\"></feBlend><feColorMatrix in=\"SourceAlpha\" type=\"matrix\" values=\"0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0\" result=\"hardAlpha\"></feColorMatrix><feOffset></feOffset><feGaussianBlur stdDeviation=\"0.68175\"></feGaussianBlur><feComposite in2=\"hardAlpha\" operator=\"arithmetic\" k2=\"-1\" k3=\"1\"></feComposite><feColorMatrix type=\"matrix\" values=\"0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0\"></feColorMatrix><feBlend mode=\"normal\" in2=\"shape\" result=\"effect1_innerShadow_14670_273716\"></feBlend></filter><linearGradient id=\"paint0_linear_14670_273716\" x1=\"9\" y1=\"1.37109\" x2=\"9\" y2=\"16.6373\" gradientUnits=\"userSpaceOnUse\"><stop stop-color=\"#FE1571\"></stop><stop offset=\"1\" stop-color=\"#FF27B4\"></stop></linearGradient><linearGradient id=\"paint1_linear_14670_273716\" x1=\"8.99311\" y1=\"5.08008\" x2=\"8.99311\" y2=\"12.22\" gradientUnits=\"userSpaceOnUse\"><stop stop-color=\"#FFFDEF\"></stop><stop offset=\"1\" stop-color=\"#FFFBDD\"></stop></linearGradient></defs></svg></div>";
debug("front html");
//랭킹 플러스 필터링
function filter_character_list(characterListElement,IsCe){
    if (characterListElement.likeCount < likeCount_limit || characterListElement.chatCount < chatCount_limit){
        return false;
    }
    else{
        if (IsCe){
            if (characterListElement.creator.isCertifiedCreator){
                debug(characterListElement.name + " (Ce) ",5);
                return true
            }
            else{
                return false;
            }
        }
        else{
            if (!characterListElement.creator.isCertifiedCreator){
                debug(characterListElement.name + " (NoCe) ",5);
                return true;
            }
            else{
                return false;
            }
        }
    }
}

//디버그 버튼
function debug_btn(){
    var debug_Interval = setInterval(()=>{
        if (document.URL == "https://wrtn.ai/character"){
            var debug_modal = document.getElementsByClassName("css-e5sxrv").item(0);
            if (debug_modal != null){
                if (debug_modal.childNodes.length == 3){
                    var debug_modal_btn = debug_modal.childNodes[2].childNodes.item(0).cloneNode(true);
                    debug_modal_btn.textContent = `debug:${IsDebug}`;
                    debug_modal_btn.addEventListener('click',()=>{
                        if (IsDebug){
                            debug("debug OFF");
                            IsDebug = false;
                            debug_modal_btn.textContent = `debug:${IsDebug}`;
                            localStorage.setItem(local_IsDebug,JSON.stringify({
                                IsDebug: false
                            }))
                        }
                        else {
                            IsDebug = true;
                            debug_modal_btn.textContent = `debug:${IsDebug}`;
                            localStorage.setItem(local_IsDebug,JSON.stringify({
                                IsDebug: true
                            }))
                            debug("debug ON");
                        }
                        debug("debug_modal_btn",3);
                    })
                    debug_modal.insertBefore(debug_modal_btn,debug_modal.childNodes.item(2));
                    debug("web-modal founded");
                }
                else{
                    clearInterval(debug_Interval);
                }
            }
        }
        else{
            clearInterval(debug_Interval);
        }
    },100)
    debug("debug_btn",0)
}
//플러스 랭크 내부 캐릭터 클릭시 팝업
function plus_modal_func(Tfeed,CeCreator){
    const feed_struct = Tfeed.childNodes.item(1).cloneNode(true); //피드의 제일위에서 2번째 요소를 가져와서 형식만 가져옴
    const feed_struct_text = feed_struct.childNodes[0].childNodes[0].childNodes.item(0); //랭킹 플러스 (Fast wrtn) <- 이거 들어간 텍스트 구역
    const feed_struct_scroll = feed_struct.childNodes[1].childNodes[0].childNodes.item(0); //스크롤 가져오기
    const feed_struct_elements = feed_struct.childNodes[1].childNodes[0].childNodes[0].childNodes.item(0); //형식에 들어있던 캐챗 목록 가져오기
    const feed_struct_element = feed_struct_elements.childNodes.item(0).cloneNode(true); //형식에 들어있던 캐챗중 제일 첫번째걸 형식 삼아 가져옴
    feed_struct_element.innerHTML = feed_struct_element_front_html;
    const feed_struct_scroll_btn = feed_struct.childNodes[1].childNodes[0].childNodes[1].childNodes.item(0); // > 버튼
    const feed_struct_scroll_btn_l = document.createElement("div"); // < 버튼
    debug("plus_modal_func",1);
    feed_struct_scroll_btn_l.setAttribute("width", "61px");
    feed_struct_scroll_btn_l.setAttribute("style", "    width: 61px;\n" +
        "    height: 100%;\n" +
        "    position: absolute;\n" +
        "    top: 0px;\n" +
        "    left: -1px;\n" +
        "    z-index: 2;\n" +
        "    background: linear-gradient(90deg, rgb(26, 25, 24) 0%, rgba(26, 25, 24, 0) 100%);");
    feed_struct_scroll_btn_l.innerHTML = feed_front_html_scroll;
    const feed_struct_six = feed_struct.childNodes[1].childNodes.item(0); // < 버튼.
    // > 버튼 누를시
    feed_struct_scroll_btn.addEventListener('click', () => {
        scroll_func(feed_struct_scroll,feed_struct_six,feed_struct_scroll_btn_l,scroll_all_amount,scroll_amount);
        debug("feed_struct_scroll_btn",3);
    })
    /* 이 부분 부터는 랭킹 플러스 내부에 자격을 만족하는 캐릭터챗을 추가하는 기능
    근대 웃긴게 캐릭터챗을 불러오는데 시간이 걸려서 (원래 형식에 들어있어야할 캐챗을 불러오는거 말하는거임)
    한번에 알잘딱갈센으로 삭제가 안됨 그래서 기존에 남아있던 캐챗이 전부 삭제될때까지 for문 돌림
    */
    //character_list에 불러와진 캐챗이 실제 랭킹플러스에 추가됬는지 확인하기위한 배열
    var character_list = [];
    var loaded = 0;
    var IsLoaded = false;
    var cursor = "";
    var jm = setInterval(() => {
        if (document.URL != "https://wrtn.ai/character") {
            clearInterval(jm);
        }
        if (feed_struct_element.childNodes.length != 0) {
            if (feed_struct_elements.childNodes.item(0) != null){
                if (feed_struct_elements.childNodes.item(0).id == "") {
                    for (const feedStructElementElement of feed_struct_elements.childNodes) {
                        if (feedStructElementElement.id == "") {
                            feedStructElementElement.remove();
                        }
                    }
                    if (!IsLoaded){
                        fetch(wrtn_api + `/characters?limit=${limit}&sort=createdAt`,{
                            method: "GET",
                            headers: {
                                "Authorization": `Bearer ${getCookie(token_key)}`,
                        }}).then(res => res.json()).then(data => {
                            for (const element of data.data.characters) {
                                if(filter_character_list(element,CeCreator)){
                                    character_list[character_list.length] = element;
                                    const fe = feed_struct_element.cloneNode(true);
                                    if (fe.childNodes[0].childNodes[0].childNodes[0].childNodes.item(1) != null) {
                                        fe.childNodes[0].childNodes[0].childNodes[0].childNodes.item(1).remove();
                                    }
                                    fe.setAttribute("id", loaded);
                                    fe.setAttribute("src", element._id)
                                    try {
                                        fe.childNodes[0].childNodes[0].childNodes[0].childNodes.item(0).src = element.profileImage.w600;
                                    } catch {
                                        console.log("image");
                                    }
                                    try {
                                        fe.childNodes[0].childNodes[1].childNodes.item(0).textContent = element.name;
                                    } catch {
                                        console.log("name");
                                    }
                                    try {
                                        fe.childNodes[0].childNodes[1].childNodes.item(1).textContent = element.description;
                                    } catch {
                                        console.log("info");
                                    }
                                    try {
                                        fe.childNodes[1].childNodes.item(1).textContent = element.creator.nickname;
                                    } catch {
                                        console.log("creater");
                                    }
                                    try {
                                        //팝업 이벤트 리스너
                                        const fe_event_bar = fe.childNodes.item(0);
                                        const fe_creator_event_bar = fe.childNodes.item(1);
                                        fe_creator_event_bar.addEventListener('click',()=>{
                                            window.location.href = `https://wrtn.ai/character/profile/${character_list[fe.id].creator.wrtnUid}`;
                                        })
                                        fe_event_bar.addEventListener("click", () => {
                                            const isModal = document.getElementById("web-modal");
                                            //모달 존재 여부
                                            if (isModal == null){
                                                plus_modal_yes(character_list,fe);
                                            }
                                            else{
                                                plus_modal_no(isModal,character_list,fe);
                                            }
                                        })
                                    } catch {
                                        console.log("link");
                                    }
                                    try {
                                        if (!character_list[loaded].creator.isCertifiedCreator) {
                                            fe.childNodes[1].childNodes.item(2).remove();
                                        }
                                    } catch {
                                        console.log("isCertifiedCreator");
                                    }
                                    try {
                                        if (!character_list[loaded].isAdult) {
                                            fe.childNodes[0].childNodes[0].childNodes[2].childNodes.item(0).remove();
                                        }
                                    } catch {
                                        console.log("isCertifiedCreator");
                                    }
                                    feed_struct_elements.appendChild(fe);
                                    loaded++;
                                }
                            }
                            debug("first_charcter_section",2)
                            cursor = data.data.nextCursor;
                            function loadF(cursorL){
                                fetch(wrtn_api + `/characters?limit=${limit}&sort=createdAt&cursor=${cursorL}`,{
                                    method: "GET",
                                    headers: {
                                        "Authorization": `Bearer ${getCookie(token_key)}`,
                                }}).then(res => res.json()).then(data => {
                                    for (const element of data.data.characters) {
                                        if(filter_character_list(element,CeCreator)){
                                            character_list[character_list.length] = element;
                                            const fe = feed_struct_element.cloneNode(true);
                                            if (fe.childNodes[0].childNodes[0].childNodes[0].childNodes.item(1) != null) {
                                                fe.childNodes[0].childNodes[0].childNodes[0].childNodes.item(1).remove();
                                            }
                                            fe.setAttribute("id", loaded);
                                            fe.setAttribute("src", element._id)
                                            try {
                                                fe.childNodes[0].childNodes[0].childNodes[0].childNodes.item(0).src = element.profileImage.w600;
                                            } catch {
                                                console.log("image");
                                            }
                                            try {
                                                fe.childNodes[0].childNodes[1].childNodes.item(0).textContent = element.name;
                                            } catch {
                                                console.log("name");
                                            }
                                            try {
                                                fe.childNodes[0].childNodes[1].childNodes.item(1).textContent = element.description;
                                            } catch {
                                                console.log("info");
                                            }
                                            try {
                                                fe.childNodes[1].childNodes.item(1).textContent = element.creator.nickname;
                                            } catch {
                                                console.log("creater");
                                            }
                                            try {
                                                //팝업 이벤트 리스너
                                                const fe_event_bar = fe.childNodes.item(0);
                                                const fe_creator_event_bar = fe.childNodes.item(1);
                                                fe_creator_event_bar.addEventListener('click',()=>{
                                                    window.location.href = `https://wrtn.ai/character/profile/${character_list[fe.id].creator.wrtnUid}`;
                                                })
                                                fe_event_bar.addEventListener("click", () => {
                                                    const isModal = document.getElementById("web-modal");
                                                    //모달 존재 여부
                                                    if (isModal == null){
                                                        plus_modal_yes(character_list,fe);
                                                    }
                                                    else{
                                                        plus_modal_no(isModal,character_list,fe);
                                                    }
                                                })
                                            } catch {
                                                console.log("link");
                                            }
                                            try {
                                                if (!character_list[loaded].creator.isCertifiedCreator) {
                                                    fe.childNodes[1].childNodes.item(2).remove();
                                                }
                                            } catch {
                                                console.log("isCertifiedCreator");
                                            }
                                            try {
                                                if (!character_list[loaded].isAdult) {
                                                    fe.childNodes[0].childNodes[0].childNodes[2].childNodes.item(0).remove();
                                                }
                                            } catch {
                                                console.log("isCertifiedCreator");
                                            }
                                            feed_struct_elements.appendChild(fe);
                                            loaded++;  
                                        }
                                    }
                                    if (loaded < load_limit){
                                        loadF(data.data.nextCursor);
                                    }
                                })
                            }       
                            loadF(cursor);
                        })
                        IsLoaded = true;
                        debug("character");
                    }
                }
            }
        }
    })
    if (feed_struct.childNodes[0].childNodes[0].childNodes.item(1) != null){
        feed_struct.childNodes[0].childNodes[0].childNodes.item(1).remove();
    }
    if (CeCreator){
        feed_struct.childNodes[0].childNodes.item(0).appendChild(feed_struct_element.childNodes[1].childNodes.item(2).cloneNode(true));
    }
    feed_struct_text.textContent = plus;
    Tfeed.prepend(feed_struct);
    debug("plus_modal_func",0);
}

//< > 스크롤 기능 구현
function scroll_func(feed_struct_scroll,feed_struct_six, feed_struct_scroll_btn_l,scroll_all_amount,scroll_amount){
    /*
    < > 버튼이 유동적으로 삭제될수있게끔 수정 해야함
    */
    //만약 예상되는 스크롤양이 한계를 넘어선경우 제한시킴
    if (feed_struct_scroll.scrollLeft + scroll_all_amount > feed_struct_scroll.scrollWidth - feed_struct_scroll.clientWidth) {
        wanted_scroll = feed_struct_scroll.scrollWidth - feed_struct_scroll.clientWidth;
    } else {
        wanted_scroll = feed_struct_scroll.scrollLeft + scroll_all_amount;
    }
    var a = setInterval(() => {
        //만약 > 버튼을 눌렀을시 < 버튼이 생기게 함 length는 < 버튼이 하나만 생기도록 제한
        if (0 < feed_struct_scroll.scrollLeft && feed_struct_six.childNodes.length < 3) {
            // < 버튼을 눌렀을시
            feed_struct_scroll_btn_l.addEventListener('click', () => {
                if (feed_struct_scroll.scrollLeft - scroll_all_amount < 0) {
                    wanted_scroll = feed_struct_scroll.scrollWidth - feed_struct_scroll.clientWidth;
                } else {
                    wanted_scroll = feed_struct_scroll.scrollLeft - scroll_all_amount;
                }
                var j = setInterval(() => {
                    if (wanted_scroll == 0) {
                        feed_struct_scroll.scrollLeft = 0;
                    } else if (feed_struct_scroll.scrollLeft > wanted_scroll) {
                        feed_struct_scroll.scrollLeft -= scroll_amount;
                    } else {
                        clearInterval(j);
                    }
                },)
                debug("left croll_func",3);
            })
            // < 버튼을 만듦
            feed_struct_six.insertBefore(feed_struct_scroll_btn_l, feed_struct_six.childNodes.item(0));
        }
        if (feed_struct_scroll.scrollLeft < wanted_scroll) {
            feed_struct_scroll.scrollLeft += scroll_amount;
        } else {
            clearInterval(a);
        }
    },)
    debug("scroll_func",0);
}
//제작자의 다른 캐릭터 보기 기능
function plus_modal_recommand_creator_func(creator_character,plus_modal_recommand_creator,isModal){
    const creator_character_top = plus_modal_recommand_creator.childNodes[1].childNodes.item(0);
    const creator_character_struct = creator_character_top.childNodes.item(0);
    const creator_character_six = plus_modal_recommand_creator.childNodes.item(1);
    const creator_character_scroll = creator_character_six.childNodes.item(0);
    const creator_character_btn = creator_character_six.childNodes[1].childNodes.item(0);
    const creater_character_struct_scroll_btn_l = document.createElement("div"); // < 버튼
    debug("plus_modal_recommand_creator_func",1);
    creater_character_struct_scroll_btn_l.setAttribute("width", "61px");
    creater_character_struct_scroll_btn_l.setAttribute("style", "    width: 61px;\n" +
        "    height: 100%;\n" +
        "    position: absolute;\n" +
        "    top: 0px;\n" +
        "    left: -1px;\n" +
        "    z-index: 2;\n" +
        "    background: linear-gradient(90deg, rgb(26, 25, 24) 0%, rgba(26, 25, 24, 0) 100%);");
    creater_character_struct_scroll_btn_l.innerHTML = feed_front_html_scroll;
    creator_character_btn.addEventListener('click',()=>{
        scroll_func(creator_character_scroll,creator_character_six,creater_character_struct_scroll_btn_l,scroll_all_amount,scroll_amount);
        debug("creator_character_btn",3)
    })
    i = 0;
    for (const element of creator_character) {
        const creator_character_elment = creator_character_struct.cloneNode(true);
        creator_character_elment.setAttribute("id",i);
        creator_character_elment.setAttribute("src",element._id);
        creator_character_elment.childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes.item(0).src = element.profileImage.w600;
        creator_character_elment.childNodes[0].childNodes[0].childNodes[1].childNodes.item(0).textContent = element.name;
        creator_character_elment.childNodes[0].childNodes[0].childNodes[1].childNodes.item(1).textContent = element.description;
        creator_character_elment.childNodes[0].childNodes[1].childNodes[1].textContent = element.creator.nickname;
        if (!element.creator.isCertifiedCreator){
            creator_character_elment.childNodes[0].childNodes[1].childNodes[2].remove();
        }
        if (!element.isAdult){
            creator_character_elment.childNodes[0].childNodes[0].childNodes[0].childNodes[2].childNodes.item(0).remove();
        }
        creator_character_elment.childNodes[0].childNodes.item(0).addEventListener('click',()=>{
            plus_modal_no(isModal,creator_character,creator_character_elment);
        })
        creator_character_elment.childNodes[0].childNodes.item(1).addEventListener('click',()=>{
            window.location.href = `https://wrtn.ai/character/profile/${creator_character[creator_character_elment.id].creator.wrtnUid}`
        })
        creator_character_top.appendChild(creator_character_elment);
        i++
    }
    debug("creator_character",4);
    creator_character_struct.remove();
    debug("plus_modal_recommand_creator_func",0);
}

//팝업 내부의 업데이트와 댓글
function date_and_comment(plus_modal_date_and_comment_struct,comment){
    if (comment.writer.profileImage == undefined){
        var guest = document.createElement('div');
        guest.innerHTML = "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 25\" fill=\"currentColor\" xmlns=\"http://www.w3.org/2000/svg\" color=\"#85837dff\"><path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M21.7968 14.4524C20.8644 19.0092 16.8325 22.437 12 22.437C11.6548 22.437 11.3137 22.4195 10.9776 22.3854C5.935 21.8733 2 17.6147 2 12.437C2 6.91416 6.47715 2.43701 12 2.43701C17.5228 2.43701 22 6.91416 22 12.437C22 13.1274 21.93 13.8014 21.7968 14.4524ZM16 9.43701C16 11.6462 14.2091 13.437 12 13.437C9.79086 13.437 8 11.6462 8 9.43701C8 7.22787 9.79086 5.43701 12 5.43701C14.2091 5.43701 16 7.22787 16 9.43701ZM18.5786 16.9904C17.1344 19.0731 14.7265 20.437 12 20.437C9.27351 20.437 6.86558 19.0731 5.42131 16.9903C5.79777 16.4264 6.28345 15.9604 6.86686 15.5891C8.2895 14.6837 10.1521 14.437 11.9999 14.437C13.8478 14.437 15.7104 14.6837 17.133 15.5891C17.7165 15.9604 18.2022 16.4264 18.5786 16.9904Z\" fill=\"currentColor\"></path></svg>";
        guest = guest.childNodes.item(0);
        plus_modal_date_and_comment_struct.childNodes[1].childNodes[1].childNodes[0].remove();
        plus_modal_date_and_comment_struct.childNodes[1].childNodes[1].insertBefore(guest,plus_modal_date_and_comment_struct.childNodes[1].childNodes[1].childNodes.item(0));
    }
    else{
        plus_modal_date_and_comment_struct.childNodes[1].childNodes[1].childNodes[0].childNodes.item(0).src = comment.writer.profileImage.w200;
    }
    plus_modal_date_and_comment_struct.childNodes[1].childNodes[1].childNodes.item(1).textContent = comment.content;
    debug("date_and_comment",0);
}

//modal 팝업 구역이 존재할시
function plus_modal_yes(character_list,fe){
    //새로운 모달 팝업을 생성
    const plus_modal = document.createElement("div");
    plus_modal.setAttribute("id","web-modal");
    //모달을 활성화 하는 css
    plus_modal.setAttribute("style","position: relative !important;z-index: 11 !important;");
    plus_modal.innerHTML = plus_modal_front_html;
    plus_modal_no(plus_modal,character_list,fe);
    document.body.appendChild(plus_modal);
    debug("plus_modal_yes",0);
}

//modal 팝업구역이 존재하지 않을시 (기능적 요소 포함)
function plus_modal_no(isModal,character_list,fe){
    //모달을 활성화 하는 css
    isModal.setAttribute("style","position: relative !important;z-index: 11 !important;");
    isModal.innerHTML = plus_modal_front_html;
    //제작자의 다른 캐릭터보기 팝업용
    const plus_modal_recommand_creator = document.createElement('div');
    plus_modal_recommand_creator.innerHTML = plus_modal_recommand_creator_front_html;
    //업데이트 시간 및 댓글 기능용
    const plus_modal_date_and_comment_struct = document.createElement('div');
    plus_modal_date_and_comment_struct.innerHTML = plus_modal_date_and_comment;
    //plus_modal_date_and_comment_struct,plus_modal_recommand_creator 삽입 위치
    const plus_modal_main_struct = isModal.childNodes[0].childNodes[0].childNodes[0].childNodes.item(1);
    //모달 내부 x 버튼
    const plus_modal_x_btn = isModal.childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes.item(1);
    //모달 내부 대화하기 버튼
    const plus_modal_btn = isModal.childNodes[0].childNodes[0].childNodes[0].childNodes[3].childNodes.item(0);
    //모달 내부 이미지
    const plus_modal_img = isModal.childNodes[0].childNodes[0].childNodes[0].childNodes[1].childNodes[0].childNodes[0].childNodes.item(0);
    //이미지 내부 좋아요 버튼
    const plus_modal_img_likeCount = isModal.childNodes[0].childNodes[0].childNodes[0].childNodes[1].childNodes[0].childNodes[1].childNodes.item(1);
    //모달 내부 캐릭터챗 제목
    const plus_modal_title = isModal.childNodes[0].childNodes[0].childNodes[0].childNodes[1].childNodes[1].childNodes[0].childNodes[0].childNodes.item(0);
    //크레이터 버튼 이벤트 href
    const plus_modal_creator_link = isModal.childNodes[0].childNodes[0].childNodes[0].childNodes[1].childNodes[1].childNodes[0].childNodes[0].childNodes.item(1);
    //크레이터 요소
    const plus_modal_creator = isModal.childNodes[0].childNodes[0].childNodes[0].childNodes[1].childNodes[1].childNodes[0].childNodes[0].childNodes[1].childNodes[0].childNodes.item(1);
    //크레이터 뱃지를 가리킴
    const plus_modal_IsCe = isModal.childNodes[0].childNodes[0].childNodes[0].childNodes[1].childNodes[1].childNodes[0].childNodes[0].childNodes[1].childNodes[0].childNodes.item(2);
    //이미지 장수, 템플릿, 셒 언셒 들어가는 부분
    const plus_modal_tabs = isModal.childNodes[0].childNodes[0].childNodes[0].childNodes[1].childNodes[1].childNodes.item(1);
    //모달 내부 캐릭터 설명
    const plus_modal_text = isModal.childNodes[0].childNodes[0].childNodes[0].childNodes[1].childNodes[1].childNodes[2].childNodes.item(0);
    //모달 내부 태그
    const plus_modal_tags = isModal.childNodes[0].childNodes[0].childNodes[0].childNodes[1].childNodes[1].childNodes[2].childNodes.item(1);
    //대화 한 유저수, 좋아요수, 댓글수 넣는부분
    const plus_modal_last = isModal.childNodes[0].childNodes[0].childNodes[0].childNodes[1].childNodes[1].childNodes.item(3);
    debug("plus_modal",1);
    //제작자의 캐챗 불러오기
    var creator_character = JSON.parse(getAfetch(wrtn_api + `/character-profiles/${character_list[fe.id].wrtnUid}/characters?limit=10&sort=createdAt`)).data.characters;
    plus_modal_recommand_creator_func(creator_character,plus_modal_recommand_creator.childNodes.item(0),isModal);
    //캐릭터챗 댓글 불러오기 (가장 좋아요 많은 댓글만)
    var comment = JSON.parse(getAfetch(wrtn_api + `/characters/${character_list[fe.id]._id}/comments?sort=likeCount`)).data.comments[0];
    plus_modal_date_and_comment_struct.childNodes[0].childNodes[1].childNodes[0].childNodes[1].textContent = `${character_list[fe.id].commentCount}건`;
    plus_modal_date_and_comment_struct.childNodes[0].childNodes[1].childNodes[0].childNodes[3].href = `/character/detail/${character_list[fe.id]._id}`;
    var update = new Date(character_list[fe.id].updatedAt);
    plus_modal_date_and_comment_struct.childNodes[0].childNodes[0].childNodes[1].childNodes.item(0).textContent = `${update.getFullYear()}.${update.getMonth()+1}.${update.getDate()}`
    if (comment == null){
        plus_modal_date_and_comment_struct.childNodes[0].childNodes[1].remove();
    }
    else{
        date_and_comment(plus_modal_date_and_comment_struct.childNodes.item(0),comment);
    }
    plus_modal_last.childNodes[0].childNodes[0].childNodes.item(1).textContent = character_list[fe.id].chatUserCount;
    plus_modal_last.childNodes[1].childNodes[0].childNodes.item(1).textContent = character_list[fe.id].likeCount;
    plus_modal_last.childNodes[2].childNodes[0].childNodes.item(1).textContent = character_list[fe.id].commentCount;
    plus_modal_main_struct.appendChild(plus_modal_date_and_comment_struct);
    plus_modal_main_struct.appendChild(plus_modal_recommand_creator);
    plus_modal_img_likeCount.textContent = character_list[fe.id].likeCount;
    plus_modal_creator_link.href = `https://wrtn.ai/character/profile/${character_list[fe.id].creator.wrtnUid}`
    const plus_modal_tags_struct = plus_modal_tags.childNodes.item(0).cloneNode(true);
    plus_modal_tags.childNodes.item(0).remove();
    //태그 넣기
    for (const element of character_list[fe.id].tags) {
        const new_tags = plus_modal_tags_struct.cloneNode(true);
        new_tags.textContent = `#${element}`;
        plus_modal_tags.appendChild(new_tags);
    }
    debug("character_list.tags",4);
    //언셒 마크
    plus_modal_IsAudult = document.createElement('div');
    plus_modal_IsAudult.innerHTML = plus_modal_front_html_IsAudlt;
    plus_modal_img.src = character_list[fe.id].profileImage.w600;
    plus_modal_title.textContent = character_list[fe.id].name;
    plus_modal_creator.textContent = character_list[fe.id].creator.nickname;
    plus_modal_tabs.childNodes[1].childNodes.item(1).textContent = character_list[fe.id].promptTemplate.name;
    plus_modal_text.textContent = character_list[fe.id].description;
    //언셒이면 언셒마크 추가
    if (character_list[fe.id].isAdult){
        plus_modal_tabs.appendChild(plus_modal_IsAudult);
    }
    //이미지 있으면 이미지 마크 추가
    if (!character_list[fe.id].hasImage){
        plus_modal_tabs.childNodes.item(0).remove();
    }
    else{
        plus_modal_tabs.childNodes[0].childNodes.item(1).textContent = `이미지 ${character_list[fe.id].imageCount}장`;
    }
    //크레이터면 크레이터 뱃지 추가
    if (!character_list[fe.id].creator.isCertifiedCreator){
        plus_modal_IsCe.remove();
    }
    //모달 내부 x버트 이벤트리스너
    plus_modal_x_btn.addEventListener('click',()=>{
        isModal.remove();
        debug("plus_modal_x_btn",3)
    })
    //대화하기 버튼 이벤트 리스너
    plus_modal_btn.addEventListener('click',()=>{
        window.location.href = `https://wrtn.ai/character/u/${fe.getAttribute("src")}`;
    })
    debug("plus_modal_no",0);
}

function character(){
/*
    정확한 명칭을 잘모르겠어서 일단 피드라고 했는데
    처음 들어가면 태그 반뜨 뭐 이런거 뜨잖아?
    그것들의 상위 엘리먼트임 정확하게는
        */
    var Tfeed = document.getElementsByClassName("css-1go39bq").item(0); // 피드를 가져옴
    // 랭킹 플러스 기준
    //랭킹 플러스
    if (Tfeed != null) {
        //비크레이터
        plus_modal_func(Tfeed,false);
        //크레이터
        plus_modal_func(Tfeed,true);
    }
    debug("character",0);
}

function chatroom(){
    try{
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
        persona_p.textContent = persona_name;
        const persona_svg = persona.childNodes.item(0); // 페르소나 svg
        const persona_path = persona_svg.childNodes.item(0); // 페르소나 path
        var personal_modal = document.createElement("div"); //모달팝업
        debug("chatroom",1);
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

        //유저노트 자동 요약 기능
        var km = setInterval(()=>{
            const usernote_modal = document.getElementsByClassName("css-f3xxdk").item(0);//유저노트 클릭시 생기는 모달 팝업
            if (usernote_modal != null){
                //페르소나 모달 팝업인지 아닌지 판별
                if (usernote_modal.childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes.item(0).textContent == "유저 노트"){
                    const usernote_modal_struct = usernote_modal.childNodes[0].childNodes[0].childNodes[0].childNodes[1].childNodes.item(0); //유저노트 모달팝업 구조 형식
                    //버튼 추가가 1번만 실행될수있도록하는 조건문
                    if (document.URL.split("/")[7] != undefined) {
                        if (usernote_modal_struct.childNodes.length < 3) {
                            usernote_modal.childNodes[0].childNodes[0].childNodes[0].childNodes[1].childNodes[0].childNodes.item(1).textContent = usernote_description;
                            fetch(wrtn_api2 + `/api/v2/chat-room/${document.URL.split("/")[7].split("?")[0]}`, {
                                method: "GET",
                                headers: {
                                    "Authorization": `Bearer ${getCookie(token_key)}`,
                                }
                            }).then(res => res.json()).then(data => {
                                usernote_modal_textarea.value = data.data.character.userNote.content;
                                debug("GET " + wrtn_api2 + `/api/v2/chat-room/${document.URL.split("/")[7].split("?")[0]}`,2);
                            })
                            /*
                            textarea의 내부값을 수정해도 적용이 안되는 문제가 있어서
                            모달 팝업 내의 모든 버튼 이벤트 리스너를 바꿔버림
                            기능이 정상작동 가능하도록
                             */
                            const usernote_modal_btn_c = usernote_modal.childNodes[0].childNodes[0].childNodes[0].childNodes[2].childNodes.item(0); //닫기 버튼 형식
                            const usernote_modal_btn_x = usernote_modal.childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes.item(1); //x 버튼 형식
                            const usernote_modal_x = usernote_modal_btn_x.cloneNode(true); // x 버튼 형식을 기반으로 버튼을 새로 만듦
                            const usernote_modal_btn = usernote_modal_btn_c.cloneNode(true); // 닫기 버튼 형식 기반으로 버튼을 새로만듬
                            const usernote_modal_textarea = usernote_modal.childNodes[0].childNodes[0].childNodes[0].childNodes[1].childNodes.item(1); //textarea
                            const usernote_modal_apply_btn_struct = usernote_modal.childNodes[0].childNodes[0].childNodes[0].childNodes[2].childNodes.item(1); // 수정 버튼 형식
                            /*
                            닫기 버튼 기반으로 새로운 수정 버튼을 만드는 이유는 수정버튼을 기존 수정버튼 형식으로 만들시 이벤트 리스너가 적용되지 않는 문제가 있음
                            수정 버튼을 누르고 모달팝업이 사라진후 유저노트의 이벤트 리스너가 사라지는 기이한 현상이 생김 그래서
                            수정 버튼을 한번 누르고 난 후에는 유저노트에 모달팝업을 띄워주는 이벤트 리스너를 넣음
                            그래서 모달팝업의 모든 버튼 이벤트는 확장프로그램이 제어하게 설정함
                             */
                            const usernote_modal_apply_btn = usernote_modal_btn.cloneNode(true); //닫기 버튼 형식 기반으로 수정 버튼을 새로만듦
                            const usernote_modal_update_btn = usernote_modal_btn.cloneNode(true); //닫기 버튼 형식 기반으로 업데이트 버튼을 만듦
                            const usernote_modal_new_close_btn = usernote_modal_btn.cloneNode(true); //닫기 버튼형식으로 새로운 닫기버튼을 만듦
                            var modal = document.getElementById("web-modal"); //모달 팝업을 가져옴
                            var usernote = document.getElementsByClassName("css-uxwch2").item(0).childNodes.item(0); //유저노트를 가져옴
                            debug("usernote",1);
                            //메뉴속 유저노트 버튼을 누를시 모달팝업을 띄워주는 함수
                            function after_usernote_event() {
                                modal.appendChild(usernote_modal);
                                fetch(wrtn_api2 + `/api/v2/chat-room/${document.URL.split("/")[7].split("?")[0]}`, {
                                    method: "GET",
                                    headers: {
                                        "Authorization": `Bearer ${getCookie(token_key)}`,
                                    }
                                }).then(res => res.json()).then(data => {
                                    usernote_modal_textarea.value = data.data.character.userNote.content;
                                    debug("GET " + wrtn_api2 + `/api/v2/chat-room/${document.URL.split("/")[7].split("?")[0]}`,2);
                                })
                                debug("after_usernote_event",0);
                            }
                            //css 수동 동기화 (닫기 버튼을 수정버튼으로 만들기 위함)
                            usernote_modal_apply_btn.removeAttribute("class");
                            usernote_modal_apply_btn.setAttribute("style", "    border-radius: 5px;\n" +
                                "    -webkit-box-pack: center;\n" +
                                "    justify-content: center;\n" +
                                "    -webkit-box-align: center;\n" +
                                "    align-items: center;\n" +
                                "    display: flex;\n" +
                                "    flex-direction: row;\n" +
                                "    gap: 8px;\n" +
                                "    width: fit-content;\n" +
                                "    border: 1px solid transparent;\n" +
                                "    padding: 0px 20px;\n" +
                                "    height: 40px;\n" +
                                "    background-color: var(--color_surface_primary);\n" +
                                "    color: var(--color_text_ivory);\n" +
                                "    font-size: 16px;\n" +
                                "    line-height: 100%;\n" +
                                "    font-weight: 600;\n" +
                                "    cursor: pointer;");
                            //수정 버튼을 누를시
                            usernote_modal_apply_btn.addEventListener('click', () => {
                                //해당 채팅방에 할당된 유저노트의 값을 api로 변경
                                putAfetch(wrtn_william + `/chat-room/${document.URL.split("/")[7].split("?")[0]}`, {
                                    userNote: {"content": usernote_modal_textarea.value}
                                })
                                //메뉴의 유저노트 버튼에 이벤트 리스너 삽입
                                usernote.removeEventListener('click', after_usernote_event);
                                usernote.addEventListener('click', after_usernote_event);
                                modal.childNodes.item(0).remove(); //모달 팝업 닫기
                                debug("usernote_modal_apply_btn",3)
                                alert("유저노트에 반영되었습니다!");
                            })
                            //닫기 버튼 누를시
                            usernote_modal_new_close_btn.addEventListener('click', () => {
                                //메뉴의 유저노트 버튼에 이벤트 리스너 삽입
                                usernote.removeEventListener('click', after_usernote_event);
                                usernote.addEventListener('click', after_usernote_event);
                                modal.childNodes.item(0).remove(); //모달 팝업 닫기
                                debug("usernote_modal_new_close_btn",3)
                            })
                            //x 버튼 누를시
                            usernote_modal_x.addEventListener('click', () => {
                                //메뉴의 유저노트 버튼에 이벤트 리스너 삽입
                                usernote.removeEventListener('click', after_usernote_event);
                                usernote.addEventListener('click', after_usernote_event);
                                modal.childNodes.item(0).remove(); //모달 팝업 닫기
                                debug("usernote_modal_x",3)
                            })
                            usernote_modal_apply_btn.childNodes.item(0).textContent = "수정"; //버튼 이름을 변경
                            //자동생성 버튼을 누를시
                            usernote_modal_btn.addEventListener('click', () => {
                                /* 작동방식
                                설정해둔 자동요약을 수행할 캐챗 id이랑 연동이 가능하도록 방을 만듦
                                그리고 생성버튼을 누를시 요약할 유저노트내용을 textarea에서 가져온 후 캐챗에게 전송
                                캐챗에게 응답을 받아온 후 그걸 다시 textarea에 기입하는 방식
                                로컬스토리지에는 판 방의 id가 저장됨 그렇게 안하면 매번 방을 파서 보내야 하잖음
                                업데이트 버튼은 캐챗이 업데이트 됬을경우 그걸 적용하기 위해서
                                기존의 방을 버리고 새방을 파서 그 방의 id를 로컬 스토리지에 저장함
                                 */
                                //처음 사용하면 로컬스토리지에 chatid가 없을꺼니 추가하기위해 판별하는 조건문
                                if (localStorage.getItem(local_usernote) == null) {
                                    // auto_summation_characterChatId의 캐챗방을 팜
                                    var created_chatId = JSON.parse(postAfetch(wrtn_api + "/chat", {
                                        unitId: auto_summation_characterChatId,
                                        type: "character",
                                        userNote: {"content": usernote_modal_textarea.textContent}
                                    })).data._id;
                                    //로컬스토리지에 판 방의 id를 저장
                                    localStorage.setItem(local_usernote, created_chatId);
                                    //메세지를 보냄
                                    var created_msg = JSON.parse(postAfetch(wrtn_api2 + `/characters/chat/${created_chatId}/message`, {
                                        message: usernote_modal_textarea.textContent,
                                        reroll: false,
                                        images: [],
                                        isSuperMode: false
                                    })).data;
                                    getAfetch(wrtn_api2 + `/characters/chat/${created_chatId}/message/${created_msg}`);
                                    var res_msg = JSON.parse(getAfetch(wrtn_api2 + `/characters/chat/${created_chatId}/message/${created_msg}/result`)).data.content;
                                    usernote_modal_textarea.value = res_msg; //textarea에 값을 반영
                                } else {
                                    var created_chatId = localStorage.getItem(local_usernote); //이미 파진 채팅방을 가져옴
                                    //그 방에 textarea값 즉 요약할 유저노트내용을 보냄
                                    var created_msg = JSON.parse(postAfetch(wrtn_api2 + `/characters/chat/${created_chatId}/message`, {
                                        message: usernote_modal_textarea.textContent,
                                        reroll: false,
                                        images: [],
                                        isSuperMode: false
                                    })).data;
                                    getAfetch(wrtn_api2 + `/characters/chat/${created_chatId}/message/${created_msg}`);
                                    var res_msg = JSON.parse(getAfetch(wrtn_api2 + `/characters/chat/${created_chatId}/message/${created_msg}/result`)).data.content;
                                    usernote_modal_textarea.value = res_msg; //textarea에 값을 반영
                                }
                                debug("usernote_modal_btn",3);
                            })
                            usernote_modal_update_btn.addEventListener('click', () => {
                                //새로운 방을 팜
                                var created_chatId = JSON.parse(postAfetch(wrtn_api + "/chat", {
                                    unitId: auto_summation_characterChatId,
                                    type: "character",
                                    userNote: {"content": ""}
                                })).data._id;
                                localStorage.setItem(local_usernote, created_chatId); //스토리지에 방 id 저장
                                debug("usernote_modal_update_btn",3);
                                alert("업데이트 되었습니다! (채팅방 확인)");
                            })
                            /*
                            밑의 코드는 기존 버튼들을 삭제후 새로운 버튼으로 대체하는 내용임
                             */
                            usernote_modal_btn_c.remove();
                            usernote_modal_apply_btn_struct.remove();
                            usernote_modal_btn_x.remove();
                            usernote_modal.childNodes[0].childNodes[0].childNodes[0].childNodes.item(0).appendChild(usernote_modal_x);
                            usernote_modal.childNodes[0].childNodes[0].childNodes[0].childNodes.item(2).appendChild(usernote_modal_new_close_btn);
                            usernote_modal.childNodes[0].childNodes[0].childNodes[0].childNodes.item(2).appendChild(usernote_modal_apply_btn);
                            usernote_modal_btn.childNodes.item(0).textContent = auto_summation;
                            usernote_modal_update_btn.childNodes.item(0).textContent = auto_summation_update;
                            usernote_modal_struct.appendChild(usernote_modal_update_btn);
                            usernote_modal_struct.appendChild(usernote_modal_btn);
                        }
                    }
                    else{
                        var e = usernote_modal.childNodes[0].childNodes[0].childNodes[0].childNodes[1].childNodes[0].childNodes.item(1);
                        if (e.textContent == "캐릭터가 이 채팅방에서 반드시 기억해 줬으면 하는 내용을 적어주세요"){
                            e.textContent = usernote_for_error;
                        }
                    }
                    debug("usernote event");
                }
            }
            else if (document.URL.split("/")[4] != "u"){
                clearTimeout(km);//현재 접속한 url이 대화url이 아닐경우 반복 끝냄
                debug("else usernote");
            }
        },100)

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
                debug(`vsmc`,3);
            }
            vsmc.addEventListener("click",v_clicked);
            targetDiv.appendChild(vsmc);
            targetDiv.appendChild(NBS_E);
            targetDiv.appendChild(NS);
            debug(`NBS`,3);
        }

        //-버튼 클릭시
        function E_clicked() {
            const a = document.getElementById(`${l.length-1}`);
            a.remove();
            l.pop();
            debug("NBS_E",3);
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
            fetch(wrtn_api + '/user',{
              method: "GET",
              headers: {
                "Authorization": `Bearer ${getCookie(token_key)}`,
              }}).then(res => res.json()).then(data => {
                  //유저 id가져오기
                  fetch(wrtn_api + `/character-profiles/${data.data.wrtnUid}`,{
                      method: "GET",
                      headers: {
                        "Authorization": `Bearer ${getCookie(token_key)}`,
                      }
                }).then(res=>res.json()).then(data=>{
                    const pid = data.data._id;
                    //유저 id를 사용해 페르소나 목록 조회
                    fetch(wrtn_api + `/character-profiles/${data.data._id}/character-chat-profiles`,{
                      method: "GET",
                      headers: {
                        "Authorization": `Bearer ${getCookie(token_key)}`,
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
                                personaL_change_modal.innerHTML = persona_modal_html;
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
                                    fetch(wrtn_api + `/character-profiles/${pid}/character-chat-profiles/${mpid}`,{
                                     method: "PATCH",
                                      headers: {
                                        "Authorization": `Bearer ${getCookie(token_key)}`,
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
                                    debug("personal_modal_Cbtn",3);
                                })
                                //모달 내부 x버튼 눌렀을시
                                personal_modal_x.addEventListener("click",()=>{
                                    personal_modal.childNodes.item(0).remove();
                                    debug("personal_modal_x",3);
                                })
                                debug("personaL",3);
                            }
                            personaL.addEventListener('click',personaL_change);
                            bar_c.appendChild(personaL);
                            c++;
                        }
                      })
                  })
            });
            debug("persona",0);
        }
    }catch (e){
        console.log(e);
    }
    debug("chatroom",0);
}

function my(){
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
                        tipbar_copy.childNodes.item(0).textContent = copyTojson;
                        //copy to json 클릭시
                        tipbar_copy.addEventListener('click',()=>{
                            //유저가 제작한 캐챗 목록을 10000개 조회함 (설마 이것보다 많이 만든 사람이 있겠어?)
                            fetch(wrtn_api + `/characters/me?limit=${forced_limit}`,{
                                method: "GET",
                                headers: {
                                    "Authorization": `Bearer ${getCookie(token_key)}`,
                                },
                            }).then(res => res.json()).then(data => {
                                i=0;
                                for (const datum of data.data.characters) {
                                    //조회한 캐챗을 가져옴
                                    if (i == selected){
                                        //캐챗 id를 사용해서 캐챗의 모든 정보를 가져온후 클립보드에 복사
                                        fetch(wrtn_api + `/characters/me/${datum._id}`,{
                                            method: "GET",
                                            headers: {
                                                "Authorization": `Bearer ${getCookie(token_key)}`,
                                            },
                                        }).then(res => res.json()).then(data => {
                                            copyToClipboard(JSON.stringify(data.data));
                                            alert('클립보드에 복사되었습니다!');
                                        })
                                    }
                                    i++;
                                }
                                debug("GET" + wrtn_api + `/characters/me?limit=${forced_limit}`,2);
                            })
                            debug(`tipbar_copy`,3);
                        })
                        tipbar.item(0).appendChild(tipbar_copy);
                    }
                    //paste to json
                    //paste to json가 없다면
                    if (tipbar.item(0).childNodes.item(3) == null){
                        tipbar_paste.childNodes.item(0).textContent = pasteTojson;
                        //paste to json 클릭시
                        tipbar_paste.addEventListener('click',()=>{
                            //유저가 제작한 캐챗 목록을 10000개 조회함 (설마 이것보다 많이 만든 사람이 있겠어?)
                            fetch(wrtn_api + `/characters/me?limit=${forced_limit}`,{
                                method: "GET",
                                headers: {
                                    "Authorization": `Bearer ${getCookie(token_key)}`,
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
                                            fetch(wrtn_api + `/characters/${datum._id}`, {
                                                method: "PATCH",
                                                headers: {
                                                    "Authorization": `Bearer ${getCookie(token_key)}`,
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
                                                debug("PATCH " + wrtn_api + `/characters/${datum._id}`,2);
                                                alert("캐챗 변경 성공! (새로고침 후 적용됩니다.)");
                                            })
                                        })
                                    }
                                    i++
                                }
                                debug("GET " + wrtn_api + `/characters/me?limit=${forced_limit}`,2);
                            })
                            debug(`tipbar_paste`,3);
                        })
                        tipbar.item(0).appendChild(tipbar_paste);
                    }
                    //publish
                    //publish가 없다면
                    if (tipbar.item(0).childNodes.item(4) == null){
                        tipbar_clone.childNodes.item(0).textContent = publish;
                        tipbar_clone.addEventListener("click",()=> {
                            //유저가 제작한 캐챗 목록을 10000개 조회함 (설마 이것보다 많이 만든 사람이 있겠어?)
                            fetch(wrtn_api + `/characters/me?limit=${forced_limit}`,{
                                method: "GET",
                                headers: {
                                    "Authorization": `Bearer ${getCookie(token_key)}`,
                                },
                            }).then(res => res.json()).then(data => {
                                i=0;
                                for (const datum of data.data.characters) {
                                    //조회한 캐챗을 가져옴
                                    if (i == selected){
                                        //새 캐챗을 만듬
                                        fetch(wrtn_api + `/characters/me/${datum._id}`,{
                                            method: "GET",
                                            headers: {
                                                "Authorization": `Bearer ${getCookie(token_key)}`,
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
                                            fetch(wrtn_api + "/characters",{
                                                method: "POST",
                                                headers: {
                                                    "Authorization": `Bearer ${getCookie(token_key)}`,
                                                    "Content-Type": "application/json",
                                                },
                                                body: json_body,
                                            }).then(res => res.json()).then(data => {
                                                debug("POST "+ wrtn_api + "/characters",2);
                                                alert("캐챗 공개 성공! (새로고침 후 적용됩니다.)");
                                            })
                                        })
                                    }
                                    i++;
                                }
                                debug("GET " + wrtn_api + `/characters/me?limit=${forced_limit}`,2);
                            })
                            debug(`tipbar_clone`,3);
                        })
                        tipbar.item(0).appendChild(tipbar_clone);
                    }
                }
                opend=true;
                debug("dropdown event");
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
                    debug("three dot button event");
                })
            }
            i++;
        }
    },500)
    debug("my",0);
}

function builder (){
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
                    recommand_prompt_plus_btn.innerHTML = recommand_prompt_html;
                    const recommand_prompt_minus_btn = recommand_prompt_plus_btn.cloneNode(true); // - 버튼
                    var json_data = JSON.parse(localStorage.getItem(local_saved_prompt)); //localstorage에 저장된 프롬프트 들고오기
                    recommand_prompt_minus_btn.childNodes.item(0).textContent = "-";
                    // + 버튼 누를시
                    recommand_prompt_plus_btn.addEventListener('click',()=>{
                        const text = document.getElementsByClassName("css-1vu2uq1").item(0); //textarea 의 내용 들고옴
                        var json_data = JSON.parse(localStorage.getItem(local_saved_prompt)); //localstorage에 저장된 내용 들고오기
                        const recommand_promt_btn_add = recommand_prompt_plus_btn.cloneNode(true);//1~9버튼을 만들기
                        recommand_promt_btn_add.childNodes.item(0).textContent = json_data.prompt.length + 1;
                        recommand_promt_btn_add.setAttribute("id",json_data.prompt.length);
                        //1~9버튼 누를시
                        recommand_promt_btn_add.addEventListener('click',()=>{
                            var json_data2 = JSON.parse(localStorage.getItem(local_saved_prompt));//localstorage에 저장된 프롬프트 들고오기
                            copyToClipboard(json_data2.prompt[recommand_promt_btn_add.id]); //클립보드에 저장된 프롬프트 복사
                            alert("클립보드에 복사되었습니다.");
                            debug("recommand_promt_btn_add",3);
                        })
                        json_data.prompt[json_data.prompt.length] = text.textContent;//프롬프트 추가
                        setting.insertBefore(recommand_promt_btn_add,recommand_prompt_minus_btn);
                        localStorage.setItem(local_saved_prompt,JSON.stringify(json_data)); //추가한 프롬프트를 localstorage에 등록
                        debug("recommand_prompt_plus_btn",3);
                    })
                    // - 버튼 누를시
                    recommand_prompt_minus_btn.addEventListener('click',()=>{
                        //이미 1~9버튼을 전부 삭제한 상태에서 누르면 작동 안되게끔하는 조건문
                        if (setting.childNodes.length > 5){
                            const json_data = JSON.parse(localStorage.getItem(local_saved_prompt)); //localstorage에 저장된 프롬프트 들고오기
                            setting.childNodes.item(setting.childNodes.length-3).remove(); //1~9 버튼중 마지막 숫자 버튼 삭제
                            json_data.prompt.pop(); //저장 된프롬프트 삭제
                            localStorage.setItem(local_saved_prompt,JSON.stringify(json_data)); //삭제한 프롬프트를 localstorage에 등록 및 적용
                        }
                        else{
                            alert("삭제할 항목이 존재하지 않습니다.");
                        }
                        debug("recommand_prompt_minus_btn",3);
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
                            var json_data = JSON.parse(localStorage.getItem(local_saved_prompt)); //localstorage에 저장된 프롬프트 들고오기
                            copyToClipboard(json_data.prompt[recommand_promt_add_btn.id]); //가져온 프롬프트를 클립보드에 복사
                            debug("rrecommand_promt_add_btn",3);
                            alert("클립보드에 복사되었습니다.");
                        })
                        setting.appendChild(recommand_promt_add_btn);
                        i++;
                    }
                    debug("json_data.promt",4);
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
    debug("builder",0);
}

//쿠키 가져오는 함수
function getCookie(name) {
    let matches = document.cookie.match(new RegExp(
      "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
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

// 클립보드의 텍스트를 가져오기
function getClipboardTextModern() {
    debug("getClipboardTextModern",0);
    return navigator.clipboard.readText(); // 붙여넣기
}

// 텍스트를 클립보드에 복사하기
function copyToClipboard(text) {
    navigator.clipboard.writeText(text); // 복사하기
    debug("copyToClipboard",0);
}
//real-time apply
var lastest = "";
setInterval(()=>{
    if (getCookie(token_key) != undefined){
        if (lastest != document.URL){
            //character
            if (document.URL == "https://wrtn.ai/character"){
                main();
            }
            //character/builder
            if (document.URL.split("/")[4] != undefined){
                if (document.URL.split("/")[4].split("?")[0] == "builder"){
                    main();
                }
            }
            debug(`${lastest} -> ${document.URL}`);
            //character/my
            if (document.URL.split("/")[4] == "my"){
                main();
            }
        }
        //character/u
        const targetDiv = document.getElementsByClassName("css-d7pngb").item(0);
        if (targetDiv != null) {
            if (targetDiv.childNodes.length < 5) {
                debug(`if targetDiv != null`);
                main();
            }
        }
    }
    lastest = document.URL;
},500)

function main(){
    //캐릭터 플러스 랭킹 기능
    if (document.URL.split("/")[3] == "character" && document.URL.split("/").length == 4){
        debug_btn();
        character();
    }

    //채팅방 기능
    if (document.URL.split("/")[4] == "u"){
        chatroom();
    }

    //캐릭터 관리
    if (document.URL.split("/")[4] == "my"){
        my();
    }

    //캐릭터 만들기
    if (document.URL.split("/")[4] != undefined){
        if (document.URL.split("/")[4].split("?")[0] == "builder"){
            builder();
        }
    }
    debug('main',0);
}


