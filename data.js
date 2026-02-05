function today() {
  return new Date().toISOString().split("T")[0];
}

/* --- AGENTS --- */

function getAgents() {
  return JSON.parse(localStorage.getItem("agentsFPI")) || [];
}

function saveAgents(list) {
  localStorage.setItem("agentsFPI", JSON.stringify(list));
}

function getAgentByMatricule(matricule) {
  return getAgents().find(a => a.matricule === matricule);
}

/* --- MOUVEMENTS JOURNÉE --- */

function getMouvements() {
  return JSON.parse(localStorage.getItem("mouvementsFPI")) || [];
}

function saveMouvements(list) {
  localStorage.setItem("mouvementsFPI", JSON.stringify(list));
}

function getMouvementDuJour(matricule) {
  return getMouvements().find(m => m.date === today() && m.matricule === matricule);
}

/* --- AUDIT --- */

function getAudit() {
  return JSON.parse(localStorage.getItem("auditFPI")) || [];
}

function saveAudit(list) {
  localStorage.setItem("auditFPI", JSON.stringify(list));
}
