const images = {
  C: "img/C.png",
  C2: "img/C2.png",
  CH4: "img/CH4.png",
  Cl: "img/Cl.png",
  Cl2: "img/Cl2.png",
  CO2: "img/CO2.png",
  H: "img/H.png",
  H2: "img/H2.png",
  H2CO3: "img/H2CO3.png",
  H2O: "img/H2O.png",
  HCl: "img/HCl.png",
  Na: "img/Na.png",
  Na2: "img/Na2.png",
  Na2CO3: "img/Na2CO3.png",
  Na2O: "img/Na2O.png",
  NaCl: "img/NaCl.png",
  NaH: "img/NaH.png",
  NaHCO3: "img/NaHCO3.png",
  NaOH: "img/NaOH.png",
  O: "img/O.png",
  O2: "img/O2.png",
  OH: "img/OH.png"
};

let inventory = ["H", "O", "Na", "C", "Cl"];

const elements = [
  "C",
  "C2",
  "CH4",
  "Cl",
  "Cl2",
  "CO2",
  "H",
  "H2",
  "H2CO3",
  "H2O",
  "HCl",
  "Na",
  "Na2",
  "Na2CO3",
  "Na2O",
  "NaCl",
  "NaH",
  "NaHCO3",
  "NaOH",
  "O",
  "O2",
  "OH"
];

const displayNames = {
  C: "C",
  C2: "C₂",
  CH4: "CH₄",

  Cl: "Cl",
  Cl2: "Cl₂",

  CO2: "CO₂",

  H: "H",
  H2: "H₂",
  H2CO3: "H₂CO₃",
  H2O: "H₂O",
  HCl: "HCl",
  OH: "OH",

  Na: "Na",
  Na2: "Na₂",
  Na2O: "Na₂O",
  NaCl: "NaCl",
  NaH: "NaH",
  NaOH: "NaOH",
  Na2CO3: "Na₂CO₃",
  NaHCO3: "NaHCO₃",

  O: "O",
  O2: "O₂"
};

const reactions = {};

elements.forEach(e => reactions[e] = {});

reactions["H"]["H"] = ["H2"];
reactions["H"]["O"] = ["H2O"];
reactions["H"]["Cl"] = ["HCl"];
reactions["H"]["Na"] = ["NaH"];
reactions["H"]["C"] = ["CH4"];

reactions["O"]["O"] = ["O2"];
reactions["O2"]["Na"] = ["Na2O"];

reactions["Na"]["Na"] = ["Na2"];
reactions["Na"]["Cl"] = ["NaCl"];

reactions["Cl"]["Cl"] = ["Cl2"];

reactions["C"]["C"] = ["C2"];
reactions["C"]["O2"] = ["CO2"];

reactions["H2O"]["Na"] = ["NaOH"];
reactions["H2O"]["C"] = ["H2CO3"];

reactions["HCl"]["NaOH"] = ["NaCl", "H2O"];

reactions["NaOH"]["CO2"] = ["Na2CO3", "H2O"];

reactions["CH4"]["O2"] = ["CO2", "H2O"];

reactions["CO2"]["H2O"] = ["H2CO3"];

reactions["H2CO3"]["NaOH"] = ["NaHCO3", "H2O"];

reactions["NaH"]["H2O"] = ["H2", "NaOH"];

reactions["C2"]["O2"] = ["CO2"];

reactions["H2O"]["O"] = ["OH"];

reactions["Cl2"]["Na"] = ["NaCl"];
reactions["Cl2"]["H"] = ["HCl"];


let draggedValue = null;
let origemSlot = null;

const grid = document.querySelector(".grid");
const slots = document.querySelectorAll(".slot");

function renderGrid() {

  grid.innerHTML = "";

  inventory.forEach(el => {

    const div = document.createElement("div");
    div.className = "item";
    div.draggable = true;
    div.dataset.value = el;

    div.innerHTML = `
      <img src="${images[el]}" />
      <span>${displayNames[el] || el}</span>
    `;

    div.addEventListener("dragstart", () => {
      draggedValue = el;
      origemSlot = null;
    });

    grid.appendChild(div);
  });
}

renderGrid();

slots.forEach(slot => {

  slot.addEventListener("dragover", (e) => {
    e.preventDefault();
  });

  slot.addEventListener("drop", () => {

    if (origemSlot) {
      origemSlot.dataset.value = "";
      origemSlot.innerHTML = "";
    }

    slot.dataset.value = draggedValue;
    slot.innerHTML = `<img src="${images[draggedValue]}" />`;

  });

  slot.addEventListener("dragstart", () => {

    const id = slot.dataset.value;
    if (!id) return;

    draggedValue = id;
    origemSlot = slot;

  });

});

grid.addEventListener("dragover", (e) => {
  e.preventDefault();
});

grid.addEventListener("drop", () => {

  if (origemSlot) {
    origemSlot.dataset.value = "";
    origemSlot.innerHTML = "";
  }

});

function misturar() {

  const a = document.getElementById("slot1").dataset.value || "";
  const b = document.getElementById("slot2").dataset.value || "";

  document.getElementById("popup").style.display = "flex";

  reagir(a, b);
}

function reagir(a, b) {

  const title = document.getElementById("popup-title");

  const result =
    reactions[a]?.[b] ||
    reactions[b]?.[a];

  ["slot1", "slot2"].forEach(id => {
    const s = document.getElementById(id);
    s.dataset.value = "";
    s.innerHTML = "";
  });
  
  if (!result) {
    title.innerHTML = "Nenhuma reação";
    return;
  } 

  let novos = [];
  let jaTinha = [];

  result.forEach(el => {
    if (!inventory.includes(el)) {
      inventory.push(el);
      novos.push(el);
    } else {
      jaTinha.push(el);
    }
  });

  if (novos.length > 0 && jaTinha.length > 0) {
    title.innerHTML = `Nova descoberta: ${novos.join(", ")} [já tinha: ${jaTinha.join(", ")}]`;
  } 
  else if (novos.length > 0) {
    title.innerHTML = `Nova descoberta: ${novos.join(", ")}`;
  } 
  else {
    title.innerHTML = `Mistura já feita [${jaTinha.join(", ")}]`;
  }
  renderGrid();
}

function fecharPopup() {
  document.getElementById("popup").style.display = "none";
}