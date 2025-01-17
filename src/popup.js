var s= document.getElementById("copy");

fetch("https://status.anthropic.com").then(res => res.text()).then(html => {
    const anthropic_dom = new DOMParser().parseFromString(html, 'text/html');
    anthropic_dom.getElementsByClassName("masthead-container basic").item(0).remove();
    anthropic_dom.getElementsByClassName("page-status status-none").item(0).remove();
    anthropic_dom.getElementsByClassName("incidents-list format-expanded").item(0).remove();
    anthropic_dom.getElementsByClassName("page-footer border-color font-small").item(0).remove();
    const lg = anthropic_dom.getElementsByClassName("layout-content status status-index starter");
    const lgm = anthropic_dom.getElementsByClassName("component-container border-color");
    const Acss = document.createElement('link');
    document.body.setAttribute("class","status index status-none");
    document.body.style.backgroundColor = "white";
    Acss.setAttribute("rel","stylesheet");
    Acss.setAttribute("href","https://dka575ofm4ao0.cloudfront.net/assets/status/status_manifest-260e48dd9b8c9b04e8d6c6286f76aecb8ac22f273beea6dba3eee902141bcbfe.css");
    document.head.appendChild(Acss);
    document.body.appendChild(lg.item(0));
})