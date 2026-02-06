/* ===============================
   GESTION DES SONS
=============================== */

const sounds = {
  click: new Audio("click.mp3"),
  entree: new Audio("entrée_ok.mp3"),
  sortie: new Audio("sortie_ok.mp3"),
  refus: new Audio("refus.mp3"),
  depart: new Audio("depart.mp3"),
  retard: new Audio("retard.mp3"),
  inconnu: new Audio("matricule inconnu.mp3")
};

function playSound(type) {
  if (!sounds[type]) return;
  sounds[type].currentTime = 0;
  sounds[type].play().catch(() => {});
}

/* ===============================
   CODE EXISTANT (LOGIQUE INCHANGÉE)
=============================== */

const input = document.getElementById("matricule");
const msg = document.getElementById("message");
const justificationZone = document.getElementById("justificationZone");
const justificationSelect = document.getElementById("justification");
const btn = document.getElementById("validateBtn");

btn.addEventListener("click", () => {
  playSound("click");
  handleValidation();
});

function handleValidation() {

  const matricule = input.value.trim();
  if (!matricule) return;

  const agent = getAgentByMatricule(matricule);

  /* === MATRICULE INCONNU === */
  if (!agent) {
    msg.textContent = "❌ Matricule inconnu";
    playSound("inconnu");
    return;
  }

  const now = new Date();
  const hour = now.getHours();
  const minute = now.getMinutes();

  let mouvement = getMouvementDuJour(matricule);

  /* ====== PREMIÈRE SAISIE ====== */
  if (!mouvement) {

    // Absence
    if (hour >= 15 && minute >= 30) {
      msg.textContent = `⚠️ ${agent.nom} est absent pendant la journée`;
      playSound("refus");
      return;
    }

    mouvement = {
      date: today(),
      matricule,
      ordre: agent.ordre,
      nom: agent.nom + " " + agent.postnom,
      grade: agent.grade,
      heureEntree: "",
      heureSortie: "",
      justificationEntree: "",
      justificationSortie: "",
      photoEntree: "",
      photoSortie: "",
      statut: "présent"
    };

    /* === RETARD === */
    if (hour >= 8) {
      msg.textContent = `⏰ Retard — justification obligatoire`;
      playSound("retard");

      justificationZone.classList.remove("hidden");
      justificationSelect.innerHTML = `
        <option value="">-- justification entrée --</option>
        <option value="Autorisation d'entrée">Autorisation d'entrée</option>
        <option value="Permission du responsable">Permission du responsable</option>
      `;

      justificationSelect.onchange = () => {
        mouvement.justificationEntree = justificationSelect.value;
        finalizeEntry(mouvement); // 🔊 son entrée joué ici
      };

      return;
    }

    // entrée normale
    finalizeEntry(mouvement);
    return;
  }

  /* ====== DEUXIÈME SAISIE ====== */

  // déjà sorti
  if (mouvement.heureSortie) {
    msg.textContent = "⚠️ Mouvement déjà terminé aujourd’hui";
    playSound("refus");
    return;
  }

  /* === SORTIE ANTICIPÉE === */
  if (hour < 15 || (hour === 15 && minute < 30)) {

    msg.textContent = "🚪 Sortie anticipée — justification requise";
    playSound("depart");

    justificationZone.classList.remove("hidden");
    justificationSelect.innerHTML = `
      <option value="">-- justification sortie --</option>
      <option value="Urgence">Urgence</option>
      <option value="Mission">Mission</option>
      <option value="Malade">Malade</option>
      <option value="Autorisation">Autorisation</option>
    `;

    justificationSelect.onchange = () => {
      mouvement.justificationSortie = justificationSelect.value;
      finalizeExit(mouvement); // 🔊 son sortie joué ici
    };

    return;
  }

  // sortie normale
  finalizeExit(mouvement);
}

/* ===============================
   FINALISATION
=============================== */

function finalizeEntry(m) {
  m.heureEntree = new Date().toLocaleTimeString("fr-FR");
  m.photoEntree = capturePhoto();
  m.statut = "présent";

  const list = getMouvements();
  list.push(m);
  saveMouvements(list);

  msg.textContent = `✅ Bienvenue ${m.nom} — entrée enregistrée`;
  playSound("entree");

  justificationZone.classList.add("hidden");
}

function finalizeExit(m) {
  m.heureSortie = new Date().toLocaleTimeString("fr-FR");
  m.photoSortie = capturePhoto();
  m.statut = "sorti";

  let list = getMouvements();
  list = list.filter(x => !(x.date === today() && x.matricule === m.matricule));
  list.push(m);
  saveMouvements(list);

  msg.textContent = `👋 Bonne sortie ${m.nom}`;
  playSound("sortie");

  justificationZone.classList.add("hidden");
}

/* ===============================
   RETOUR ACCUEIL
=============================== */

const btnAccueil = document.getElementById("btnAccueil");
if (btnAccueil) {
  btnAccueil.addEventListener("click", () => {
    playSound("click");
    window.location.href = "index.html";
  });
}
