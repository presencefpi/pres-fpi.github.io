/*************************************************
 * 🔐 PROTECTION MOT DE PASSE ADMIN
 *************************************************/

const ADMIN_PASSWORD = "1234"; // 🔴 change ce mot de passe

const lock = document.getElementById("adminLock");
const input = document.getElementById("adminPassword");
const btn = document.getElementById("adminLoginBtn");
const msg = document.getElementById("adminLockMsg");

// Sécurité : si les éléments n’existent pas, on ne fait rien
if (lock && input && btn) {
  btn.onclick = () => {
    if (input.value === ADMIN_PASSWORD) {
      lock.style.display = "none"; // déverrouille l’admin
    } else {
      msg.textContent = "❌ Mot de passe incorrect";
      input.value = "";
    }
  };
}
// 🔙 bouton retour depuis l’écran mot de passe
const backBtn = document.getElementById("adminBackBtn");

if (backBtn) {
  backBtn.onclick = () => {
    window.location.href = "index.html";
  };
}

const menu = document.getElementById("adminMenu");
const form = document.getElementById("agentForm");
const list = document.getElementById("agentList");
const listContainer = document.getElementById("listContainer");
const message = document.getElementById("adminMessage");

const openFormBtn = document.getElementById("openFormBtn");
const openListBtn = document.getElementById("openListBtn");
const backFromForm = document.getElementById("backFromForm");
const backFromList = document.getElementById("backFromList");
const saveBtn = document.getElementById("saveAgentBtn");

let editIndex = null;

// UTIL
function getAgents() {
  return JSON.parse(localStorage.getItem("agentsFPI")) || [];
}

function saveAgents(agents) {
  localStorage.setItem("agentsFPI", JSON.stringify(agents));
}

// NAVIGATION
openFormBtn.onclick = () => {
  menu.classList.add("hidden");
  form.classList.remove("hidden");
};

openListBtn.onclick = () => {
  menu.classList.add("hidden");
  list.classList.remove("hidden");
  renderList();
};

backFromForm.onclick = backFromList.onclick = () => {
  form.classList.add("hidden");
  list.classList.add("hidden");
  menu.classList.remove("hidden");
  editIndex = null;
  form.reset();
};

// ENREGISTREMENT
saveBtn.onclick = () => {
  const agent = {
    ordre: ordre.value.trim(),
    nom: nom.value.trim(),
    postnom: postnom.value.trim(),
    matricule: matriculeAdmin.value.trim(),
    grade: grade.value.trim()
  };

  if (!agent.ordre || !agent.matricule) {
    message.textContent = "N° d’ordre et matricule obligatoires";
    return;
  }

  let agents = getAgents();

  if (editIndex !== null) {
    agents[editIndex] = agent;
    message.textContent = "Agent modifié avec succès";
  } else {
    agents.push(agent);
    message.textContent = "Agent enregistré avec succès";
  }

  saveAgents(agents);
  form.reset();
  editIndex = null;
};

// LISTE
function renderList() {
  listContainer.innerHTML = "";
  const agents = getAgents();

  agents.sort((a, b) => a.ordre - b.ordre);

  agents.forEach((agent, index) => {
    const div = document.createElement("div");
    div.className = "agent-item";

    div.innerHTML = `
      <strong>${agent.ordre} - ${agent.nom} ${agent.postnom}</strong>
      Matricule : ${agent.matricule}<br>
      Grade : ${agent.grade}

      <div class="agent-actions">
        <button class="edit-btn">Modifier</button>
        <button class="delete-btn">Effacer</button>
      </div>
    `;

    div.querySelector(".edit-btn").onclick = () => {
      menu.classList.add("hidden");
      list.classList.add("hidden");
      form.classList.remove("hidden");

      ordre.value = agent.ordre;
      nom.value = agent.nom;
      postnom.value = agent.postnom;
      matriculeAdmin.value = agent.matricule;
      grade.value = agent.grade;

      editIndex = index;
    };

    div.querySelector(".delete-btn").onclick = () => {
      agents.splice(index, 1);
      saveAgents(agents);
      renderList();
    };

    listContainer.appendChild(div);
  });
}
const menuToggle = document.getElementById("menuToggle");
const adminMenu = document.getElementById("adminMenu");

menuToggle.addEventListener("click", () => {
  adminMenu.classList.toggle("active");
});

// fermeture auto après clic
function closeMenu() {
  adminMenu.classList.remove("active");
}

document.getElementById("menuAudit").onclick = closeMenu;
document.getElementById("menuAuditPrint").onclick = closeMenu;
document.getElementById("menuPresence").onclick = closeMenu;
document.getElementById("menuPresencePrint").onclick = closeMenu;
document.getElementById("menuReglage").onclick = closeMenu;
document.getElementById("menuAbout").onclick = closeMenu;
const auditPage = document.getElementById("auditPage");
const auditContainer = document.getElementById("auditContainer");
const backFromAudit = document.getElementById("backFromAudit");
const clearAuditBtn = document.getElementById("clearAuditBtn");

document.getElementById("menuAudit").onclick = () => {

  // masquer tout l’admin
  document.querySelector(".admin-container").classList.add("hidden");
  document.querySelector("header").classList.add("hidden");

  // afficher audit plein écran
  auditDashboard.classList.remove("hidden");

  renderAudit();
};

const auditDashboard = document.getElementById("auditDashboard");
const auditTableBody = document.querySelector("#auditTable tbody");

document.getElementById("menuAudit").onclick = () => {
  menu.classList.add("hidden");
  auditDashboard.classList.remove("hidden");
  renderAudit();
};

backFromAudit.onclick = () => {

  auditDashboard.classList.add("hidden");

  document.querySelector(".admin-container").classList.remove("hidden");
  document.querySelector("header").classList.remove("hidden");
};

function renderAudit(filter = {}) {

  auditTableBody.innerHTML = "";

  let audit = getAudit();

  if (filter.date) {
    audit = audit.filter(a => a.date === filter.date);
  }

  if (filter.matricule) {
    audit = audit.filter(a =>
      a.matricule.toLowerCase().includes(filter.matricule.toLowerCase())
    );
  }

  audit.forEach(m => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${m.date}</td>
      <td>${m.matricule}</td>
      <td>${m.nom}</td>
      <td>${m.heureEntree || "-"}</td>
      <td>${m.heureSortie || "-"}</td>
      <td>${m.statut}</td>
      <td>${m.justificationEntree || "-"}</td>
      <td>${m.justificationSortie || "-"}</td>
      <td>${m.photoEntree ? "<img src='" + m.photoEntree + "' width='50'>" : "-"}</td>
      <td>${m.photoSortie ? "<img src='" + m.photoSortie + "' width='50'>" : "-"}</td>
    `;

    auditTableBody.appendChild(tr);
  });
}
auditFilterBtn.onclick = () => {
  const date = auditDateFilter.value;
  const mat = auditMatriculeFilter.value.trim();

  renderAudit({
    date,
    matricule: mat
  });
};
clearAuditBtn.onclick = () => {
  if (!confirm("Supprimer TOUT l’audit ?")) return;

  saveAudit([]);
  renderAudit();
};

const printBtn = document.getElementById("printAuditBtn");

let logoData = "";

// lecture logo sélectionné
document.getElementById("logoInput").addEventListener("change", e => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => logoData = reader.result;
  reader.readAsDataURL(file);
});

printBtn.onclick = () => {

  const adjoint = document.getElementById("adjointName").value.trim() || "";
  const visa = document.getElementById("visaName").value.trim() || "";

  const dateImpression = document.getElementById("auditDateFilter").value || "________";

  // 👉 on récupère UNIQUEMENT le tableau
  const tableHtml = document.getElementById("auditTable").outerHTML;

  const win = window.open("", "_blank");

  win.document.write(`
    <html>
    <head>
      <title>Impression Audit</title>

      <style>

        body{
          font-family: Arial;
        }

        .header{
          text-align:center;
        }

        .title{
          font-size:22px;
          font-weight:bold;
        }

        .subtitle{
          font-size:14px;
        }

        .underline{
          text-decoration: underline;
        }

        .logo{
          width:90px;
          height:90px;
          object-fit:contain;
        }

        table{
          width:100%;
          border-collapse: collapse;
          margin-top:15px;
          font-size:11px;
        }

        th,td{
          border:1px solid black;
          padding:4px;
          text-align:center;
        }

        .footer{
          width:100%;
          margin-top:40px;
          font-size:13px;
        }

        .left{
          float:left;
        }

        .right{
          float:right;
          text-align:right;
        }

      </style>

    </head>

    <body>

      <div class="header">

        ${logoData ? `<img class="logo" src="${logoData}">` : ""}

        <div class="title">FONDS DE PROMOTION DE L'INDUSTRIE</div>

        <div class="subtitle">
          DIRECTION PROVINCIALE DU KONGO CENTRAL<br>
          SERVICE ADMINISTRATIF<br>
          <span class="underline">
            SECTION PERSONNEL, SOCIAL ET FORMATION
          </span>
        </div>

        <br>

        <strong>STATISTIQUE DE PRÉSENCE DU ${dateImpression}</strong>
      </div>

      ${tableHtml}

      <div class="footer">

        <div class="left">
          VISA/DP<br>
          <strong>${visa}</strong>
        </div>

        <div class="right">
          Adjoint au Directeur<br>
          <strong>${adjoint}</strong>
        </div>

      </div>

      <script>
        window.print();
      </script>

    </body>
    </html>
  `);

  win.document.close();
};

const presencePage = document.getElementById("presencePage");
const presenceTableBody = document.querySelector("#presenceTable tbody");
const presenceDate = document.getElementById("presenceDate");

document.getElementById("menuPresencePrint").onclick = () => {
  menu.classList.add("hidden");
  presencePage.classList.remove("hidden");
  renderPresenceList();
};

presenceBackBtn.onclick = () => {
  presencePage.classList.add("hidden");
  menu.classList.remove("hidden");
};

function renderPresenceList() {

  // 📅 date venant de la sécurité (si existe)
  const selectedDate =
    localStorage.getItem("printSelectedDate") || today();

  presenceDate.textContent = selectedDate;
  presenceTableBody.innerHTML = "";

  const agents = getAgents().sort((a, b) => a.ordre - b.ordre);
  const mouvements = getMouvements().filter(m => m.date === selectedDate);

  agents.forEach(agent => {

    const mv = mouvements.find(m => m.matricule === agent.matricule) || {};

    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${agent.ordre}</td>
      <td>${agent.nom} ${agent.postnom}</td>
      <td>${agent.matricule}</td>
      <td>${agent.grade}</td>

      <td contenteditable="true">${mv.heureEntree || ""}</td>
      <td contenteditable="true">${mv.heureSortie || ""}</td>
      <td contenteditable="true">${mv.statut === "absent" ? "Absent" : (mv.observation || "")}</td>
      <td></td>
    `;

    presenceTableBody.appendChild(tr);
  });
}
presencePrintBtn.onclick = () => {
  window.print();
};
presencePrintBtn.onclick = imprimerListePresence;

function imprimerListePresence() {

  const today = new Date().toISOString().split("T")[0];

  // champs de noms comme demandé
  const visa1 = document.getElementById("visaPage1").value || "";
  const resp1 = document.getElementById("respPage1").value || "";

  const visaN = document.getElementById("visaPageN").value || "";
  const respN = document.getElementById("respPageN").value || "";

  // 👉 récupère EXACTEMENT ce qui est dans le tableau affiché
  const rows = Array.from(document.querySelectorAll("#presenceTable tbody tr"))
    .map(tr => Array.from(tr.children).map(td => td.innerText.trim()));

  const win = window.open("", "_blank");

  function blocEntete(titre) {
    return `
      <div class="header">

        <div class="title">FONDS DE PROMOTION DE L'INDUSTRIE</div>

        <div class="subtitle">
          DIRECTION PROVINCIALE DU KONGO CENTRAL<br>
          SERVICE ADMINISTRATIF<br>
          <span class="underline">
            SECTION PERSONNEL, SOCIAL ET FORMATION
          </span>
        </div>

        <br>

        <div class="title">${titre} ${today}</div>

      </div>
    `;
  }

  function blocTable(lignes) {
    return `
      <table>
        <thead>
          <tr>
            <th>N°</th>
            <th>Nom & Postnom</th>
            <th>Matricule</th>
            <th>Grade</th>
            <th>Heure d’arrivée</th>
            <th>Heure de sortie</th>
            <th>Observation</th>
            <th>Signature</th>
          </tr>
        </thead>
        <tbody>
          ${lignes.map(cells => `
            <tr>
              ${cells.map(c => `<td>${c}</td>`).join("")}
            </tr>
          `).join("")}
        </tbody>
      </table>
    `;
  }

  function piedPage(visa, resp, libelleResp) {
    return `
      <div class="footer">

        <div class="left">
          VISA/DP<br>
          <strong>${visa}</strong>
        </div>

        <div class="right">
          ${libelleResp}<br>
          <strong>${resp}</strong>
        </div>

      </div>
    `;
  }

  // STYLE GLOBAL
  let html = `
  <html>
  <head>
    <title>Liste de présence</title>
    <style>

      @page { size: A4 landscape; }

      body{ font-family: Arial; }

      .page-break{ page-break-after: always; }

      .header{text-align:center;}

      .title{font-size:18px; font-weight:bold;}

      .subtitle{font-size:13px;}

      .underline{text-decoration:underline;}

      table{
        width:100%;
        border-collapse:collapse;
        margin-top:10px;
        font-size:11px;
      }

      th,td{
        border:1px solid black;
        padding:4px;
        text-align:center;
      }

      .footer{
        width:100%;
        margin-top:30px;
        font-size:13px;
      }

      .left{float:left;}
      .right{float:right;}

    </style>
  </head>
  <body>
  `;

  // ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
  // PAGE 1 — 6 premiers agents
  // ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬

  const page1 = rows.slice(0, 6);

  html += blocEntete("LISTE DES PRESENCES DES CADRES SUPERIEURS DU");
  html += blocTable(page1);
  html += piedPage(visa1, resp1, "Adjoint au Directeur");
  html += `<div class="page-break"></div>`;

  // ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
  // SUIVANTES — paquets de 15
  // ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬

  const rest = rows.slice(6);

  for(let i = 0; i < rest.length; i += 15){

    const part = rest.slice(i, i+15);

    html += blocEntete("LISTES DES PRESENCES DES CADRES ET AGENTS DU");
    html += blocTable(part);
    html += piedPage(visaN, respN, "Responsable de service");
    html += `<div class="page-break"></div>`;
  }

  html += `
    <script>window.print();<\/script>
  </body>
  </html>
  `;

  win.document.write(html);
  win.document.close();
}

const btnAccueilAdmin = document.getElementById("btnAccueilAdmin");

if (btnAccueilAdmin) {
  btnAccueilAdmin.onclick = () => {
    window.location.href = "index.html";
  };
}
function hideAllAdminPages() {
  document.querySelector(".agent-container").style.display = "none";
  document.getElementById("auditDashboard").classList.add("hidden");
  document.getElementById("presencePage").classList.add("hidden");

  document.getElementById("auditDashboard").classList.remove("fullscreen-admin");
  document.getElementById("presencePage").classList.remove("fullscreen-admin");
}



function showAdminHome() {
  hideAllAdminPages();
  document.querySelector(".agent-container").style.display = "block";
}
document.getElementById("menuAudit").onclick = () => {
  hideAllAdminPages();

  const audit = document.getElementById("auditDashboard");
  audit.classList.remove("hidden");
  audit.classList.add("fullscreen-admin");
};


document.getElementById("menuPresence").onclick = () => {
  hideAllAdminPages();

  const presence = document.getElementById("presencePage");
  presence.classList.remove("hidden");
  presence.classList.add("fullscreen-admin");
};


document.getElementById("backFromAudit").onclick = () => {
  showAdminHome();
};

document.getElementById("presenceBackBtn").onclick = () => {
  showAdminHome();
};


document.getElementById("menuPresencePrint").onclick = () => {
  // cacher tout le reste
  document.querySelector(".agent-container").style.display = "none";
  document.getElementById("auditDashboard").classList.add("hidden");

  // afficher la liste imprimable en plein écran
  const presence = document.getElementById("presencePage");
  presence.classList.remove("hidden");
  presence.classList.add("fullscreen-admin");

  renderPresenceList(); // logique EXISTANTE, inchangée
};
