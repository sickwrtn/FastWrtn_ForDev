
export interface chatroom_menus_class {
    item: Array<[string,string,onClickChatroom_menus,string]>;
    listeners: Array<any>;
    menu: any;
    add(name: string,svg: string,func: onClickChatroom_menus,color:string): void;
    get(name): any | undefined;
    apply(menu): void;
}

export interface onClickChatroom_menus { (menus: chatroom_menus_class): void }

export interface dropdown_class {
    item: Array<[string,onClickDropdown]>;
    add(name: string,funtion: onClickDropdown): void;
    listen(tipbar: any,tipbar_struct: any,selected: number): void;
}

export interface onClickDropdown { (character: myCharacter): void; }

export interface feed_class {
    item: Array<[string,filter_character_list,boolean]>;
    add(name: string, filter_character_list: filter_character_list, CeCreator: boolean): void;
    listen(Tfeed: any): void;
}

export interface filter_character_list { (characterListElement: character): boolean }

export interface my_struct {
    json: myCharacter;
    reload(): response;
    get(): myCharacter;
    set(json_data: myCharacter): response;
    remove(): boolean
    publish(visibility:string): response
}

export interface character_struct {
    getHeader: RequestInit;
    postHeader: RequestInit;
    json: character;
    reload(): response;
    get(): response;
    getComments(cursor: string,sort: string,load_limit: number): Promise<response | null>;
}

export interface message_struct{
    json: message;
    reload(): response;
    get(): string;
    set(content: string): response;
    remove(): boolean;
}

export interface chatroom_struct{
    getHeader: RequestInit;
    postHeader: RequestInit;
    json: myCharacter;
    reload(): response;
    remove(): response;
    getMessages(cursor: string,load_limit: number): Promise<response | null>;
    send(content: string, IsSuperMode: boolean): message_struct;
    getUsernote(): string;
    setUsernote(content: string): response;
}

export interface wrtn_api_class{
    getHeader: RequestInit;
    postHeader: RequestInit;
    getUser(): response;
    getSuperchat(): response;
    getPersona(): Array<characterChatProfile>;
    getRepresentativePersona(): characterChatProfile | null;
    setPersona(personaId: string,name: string,information: string,isRepresentative: boolean): response;
    getChatrooms(cursor: string,load_limit:number,type: string): Promise<response | null>;
    getMycharacters(cursor: string,load_limit: number): Promise<response | null>;
    character_search(query: string,cursor: string,sort: string,load_limit: number): Promise<response | null>;
    user_search(query: string,cursor: string,load_limit: number): Promise<response | null>;
    createChatroom(charId: string): chatroom_struct;
    getCharacter(charId: string): character_struct;
    getMycharacter(charId: string): my_struct;
    getMessage(msgId): message_struct;
    getChatroom(chatId: string): chatroom_struct;
}


export interface ids {
    _id? : string;
    wrtnUid?: string;
    userId?: string;
    chatId? : string;
    turnId? : string;
    parentTurnId? : string;
    characterProfileId? : string;
}

export interface creator extends ids{
    nickname: string;
    isCertifiedCreator: boolean;
}

export interface categorie extends ids{
    name: string;
    recommendDescription: string;
}

export interface profileImage{
    origin: string;
    w200: string;
    w600: string;
}

export interface icon{
    dark: string;
    light: string;
}

export interface promptTemplate{
    name: string;
    template: string;
    icon: icon;
}

export interface chatExample{
    user: string;
    character: string;
}

export interface startingSet extends ids{
    name: string,
    initialMessages: Array<string>;
    situationPrompt: string;
    replySuggestions: Array<string>;
}

export interface keywordBook{
    name: string;
    keywords: Array<string>;
    prompt: string;
}

export interface situationImage{
    situation: string;
    keyword: string;
    imageUrl: string;
}

export interface myCharacter extends ids{
    initialMessages: Array<string>;
    creator: creator;
    name: string;
    description: string;
    categories: Array<categorie>;
    chatCount: number;
    chatUserCount: number;
    likeCount: number;
    imageCount: number;
    tags: Array<string>;
    hasImage: boolean;
    isLiked: boolean;
    isDisliked: boolean;
    countryCode: string;
    status: string;
    visibility:  string;
    profileImage: profileImage;
    replySuggestions: Array<string>;
    createdAt: string;
    updatedAt: string;
    isAdult: boolean;
    isConvertedToAdult: boolean;
    commentCount: number;
    promptTemplate: promptTemplate;
    badges: [];
    snapshotId: string;
    model: string;
    characterDetails?: string;
    customPrompt?: string;
    chatExamples: Array<chatExample>;
    situationImages: Array<situationImage>;
    dislikeCount: number;
    startingSets: Array<startingSet>;
    isCommentBlocked: boolean;
    defaultStartingSetName: string;
    keywordBook: Array<keywordBook>;
    defaultStartingSetSituationPrompt: string;
}

export interface writer extends ids{
    nickname: string;
    profileImage: profileImage;
}

export interface representativeComment extends ids {
    writer: writer;
    content: string;
}

export interface character extends ids{
    initialMessages: Array<string>;
    creator: creator;
    name: string;
    description: string;
    categories: Array<categorie>;
    chatCount: number;
    chatUserCount: number;
    likeCount: number;
    imageCount: number;
    tags: Array<string>;
    hasImage: boolean;
    isLiked: boolean;
    isDisliked: boolean;
    countryCode: boolean;
    status: string;
    visibility: string;
    profileImage: profileImage;
    replySuggestions: Array<string>;
    createdAt: string;
    updatedAt: string;
    isAdult: boolean;
    isConvertedToAdult: boolean;
    commentCount: number;
    promptTemplate: promptTemplate;
    representativeComment?: representativeComment | null;
    isCommentBlocked: boolean;
    startingSets: Array<startingSet>;
    defaultStartingSetName: string;
    deepLink: string;
}

export interface message extends ids{
    role: string;
    type: string;
    content: string;
    model: string;
    reroll: boolean;
    liked: boolean;
    diliked: boolean;
    status: string;
    isSuperMode: string;
}

export interface usernote extends ids{
    content: string;
    createdAt: string;
    updatedAt: string;
}

export interface chatroomCharacter extends ids{
    snapshotId: string;
    name: string;
    profileImage: profileImage;
    isAdult: boolean;
    userNote: usernote;
}

export interface chatroom extends ids{
    topic: string;
    model: string;
    character: chatroomCharacter;
    createdAt: string;
    updatedAt: string;
}

export interface characterChatProfile extends ids{
    name: string;
    information: string;
    isRepresentative: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface response{
    result: string;
    data: any;
}