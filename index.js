const targetDiv = document.getElementsByClassName("css-d7pngb").item(0);
const NS = document.getElementsByClassName("css-13yljkq").item(0);
const NBS = NS.cloneNode(true);
const NBS_E = NS.cloneNode(true);
const Cm_E = NBS_E.childNodes.item(0).childNodes.item(0);
const Cm = NBS.childNodes.item(0).childNodes.item(0);
var l = []

Cm.setAttribute("d","M 12 12 L 12 7 L 14 7 L 14 12 L 19 12 L 19 14 L 14 14 L 14 19 L 12 19 L 12 14 L 7 14 L 7 12 L 12 12");
targetDiv.appendChild(NBS);
NBS.addEventListener('click',clicked);

Cm_E.setAttribute("d","M 12 12 L 7 12 L 7 14 L 19 14 L 19 12 L 12 12");
targetDiv.appendChild(NBS_E);
NBS_E.addEventListener('click',E_clicked);


targetDiv.appendChild(NS);
function clicked() {
    const vsm = document.getElementsByTagName("textarea").item(0);
    const vsmc = document.createElement("div");
    vsmc.setAttribute("display","flex");
    vsmc.setAttribute("class","css-13yljkq");
    vsmc.setAttribute("id",`${l.length}`);
    vsmc.append(`${l.length}`);
    l[l.length] = [l.length,vsm.value]
    function v_clicked() {
        const vsm2 = document.getElementsByTagName("textarea").item(0);
        vsm2.value = l[vsmc.id][1];
    }
    vsmc.addEventListener("click",v_clicked);
    targetDiv.appendChild(vsmc);
    targetDiv.appendChild(NBS_E);
    targetDiv.appendChild(NS);
}

function E_clicked() {
    const a = document.getElementById(`${l.length-1}`);
    a.remove();
    l.pop();
}
