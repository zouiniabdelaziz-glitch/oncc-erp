(function () {
  let customerSearch = "";
  let importMessage = "";
  let selectedCustomerId = "";
  let editingCustomerId = "";
  let customerDetailTab = "profile";
  let salesPathModalOpen = false;
  const extraContactSlots = {};

  const statusOptions = [
    { value: "lead", label: "Lead" },
    { value: "aktiv", label: "Aktiv" },
    { value: "ruhend", label: "Ruhend" },
    { value: "intern", label: "Intern" },
    { value: "archiv", label: "Archiv" }
  ];

  const importanceOptions = [
    { value: "hoch", label: "Hoch" },
    { value: "mittel", label: "Mittel" },
    { value: "normal", label: "Normal" },
    { value: "niedrig", label: "Niedrig" }
  ];

  const contactRoleOptions = [
    { value: "Einkauf", label: "Einkauf" },
    { value: "Vertrieb", label: "Vertrieb" },
    { value: "Technik", label: "Technik" },
    { value: "Qualität", label: "Qualität" },
    { value: "Logistik", label: "Logistik" },
    { value: "Geschäftsführung", label: "Geschäftsführung" }
  ];

  const salesPathTypes = [
    { value: "linkedin", label: "LinkedIn-Weg", startCard: "linkedin_send_request", firstAction: "Kontaktanfrage senden" },
    { value: "phone", label: "Telefon-Weg", startCard: "phone_call", firstAction: "Anrufen" },
    { value: "email", label: "E-Mail-Weg", startCard: "email_send", firstAction: "E-Mail senden" },
    { value: "direct_contact", label: "Direktkontakt-Weg", startCard: "direct_contact_source", firstAction: "Kontaktquelle dokumentieren" }
  ];

  const salesPathCards = {
    linkedin_send_request: {
      title: "LinkedIn Kontaktanfrage",
      buttons: [
        { key: "sent", label: "Kontaktanfrage gesendet", status: "Anfrage gesendet", nextCard: "linkedin_check_acceptance", nextAction: "Anfrage prüfen", dueDays: 7 },
        { key: "not_possible", label: "Anfrage nicht möglich", status: "Anfrage nicht möglich", nextCard: "linkedin_alternative", nextAction: "anderen Weg wählen", dueDays: 1 },
        { key: "cancel", label: "Weg abbrechen", status: "abgebrochen", complete: true }
      ]
    },
    linkedin_check_acceptance: {
      title: "Wurde die Anfrage angenommen?",
      buttons: [
        { key: "accepted", label: "Ja, angenommen", status: "LinkedIn verbunden", nextCard: "linkedin_send_message", nextAction: "erste Nachricht senden", dueDays: 1 },
        { key: "rejected", label: "Nein, nicht angenommen", status: "nicht angenommen", nextCard: "linkedin_alternative", nextAction: "anderen Weg wählen", dueDays: 1 },
        { key: "pending", label: "Noch nicht", status: "Anfrage noch offen", nextCard: "linkedin_check_acceptance", nextAction: "erneut prüfen", dueDays: 7 }
      ]
    },
    linkedin_send_message: {
      title: "Erste LinkedIn-Nachricht",
      buttons: [
        { key: "message_sent", label: "Nachricht gesendet", status: "Nachricht gesendet", nextCard: "linkedin_check_reply", nextAction: "Antwort prüfen", dueDays: 3 },
        { key: "message_open", label: "Nachricht nicht gesendet", status: "Nachricht offen", nextCard: "linkedin_send_message", nextAction: "Nachricht senden", dueDays: 1 }
      ]
    },
    linkedin_check_reply: {
      title: "Hat der Kontakt geantwortet?",
      buttons: [
        { key: "reply", label: "Antwort erhalten", status: "Antwort erhalten", nextCard: "linkedin_interest_check", nextAction: "Interesse bewerten", dueDays: 1 },
        { key: "no_reply", label: "Keine Antwort", status: "keine Antwort", nextCard: "linkedin_followup", nextAction: "Follow-up senden", dueDays: 5 },
        { key: "no_interest", label: "Kein Interesse", status: "kein Interesse", nextCard: "linkedin_close", nextAction: "Weg abschließen", dueDays: 0 }
      ]
    },
    linkedin_followup: {
      title: "LinkedIn Follow-up",
      buttons: [
        { key: "followup_sent", label: "Follow-up gesendet", status: "Follow-up gesendet", nextCard: "linkedin_check_reply_after_followup", nextAction: "Antwort erneut prüfen", dueDays: 7 },
        { key: "later", label: "Später nachfassen", status: "später nachfassen", nextCard: "linkedin_followup", nextAction: "Follow-up", customDue: true, dueDays: 7 },
        { key: "stop", label: "Nicht weiter verfolgen", status: "beendet", complete: true }
      ]
    },
    linkedin_check_reply_after_followup: {
      title: "Antwort nach Follow-up?",
      buttons: [
        { key: "reply", label: "Antwort erhalten", status: "Antwort erhalten", nextCard: "linkedin_interest_check", nextAction: "Interesse bewerten", dueDays: 1 },
        { key: "no_reply", label: "Keine Antwort", status: "keine Antwort", nextCard: "linkedin_close", nextAction: "Weg abschließen", dueDays: 0 },
        { key: "no_interest", label: "Kein Interesse", status: "kein Interesse", nextCard: "linkedin_close", nextAction: "Weg abschließen", dueDays: 0 }
      ]
    },
    linkedin_interest_check: {
      title: "Interesse bewerten",
      buttons: [
        { key: "interest", label: "Interesse vorhanden", status: "Interesse vorhanden", nextCard: "linkedin_next_action", nextAction: "nächste Aktion planen", dueDays: 2 },
        { key: "meeting", label: "Termin gewünscht", status: "Termin gewünscht", nextCard: "linkedin_meeting", nextAction: "Termin planen", dueDays: 1 },
        { key: "request", label: "Anfrage erhalten", status: "Anfrage erhalten", nextCard: "linkedin_request_received", nextAction: "Anfrage weiterbearbeiten", dueDays: 1 },
        { key: "later", label: "Später nachfassen", status: "später nachfassen", nextCard: "linkedin_followup_planned", nextAction: "Follow-up", customDue: true, dueDays: 7 },
        { key: "no_need", label: "Kein Bedarf", status: "kein Bedarf", nextCard: "linkedin_close", nextAction: "Weg abschließen", dueDays: 0 }
      ]
    },
    linkedin_next_action: {
      title: "Nächste Aktion",
      buttons: [
        { key: "start_phone", label: "Telefonweg starten", status: "Telefonweg empfohlen", nextCard: "linkedin_next_action", nextAction: "Telefonweg bearbeiten", dueDays: 0, startPathType: "phone" },
        { key: "start_email", label: "E-Mail-Weg starten", status: "E-Mail-Weg empfohlen", nextCard: "linkedin_next_action", nextAction: "E-Mail-Weg bearbeiten", dueDays: 0, startPathType: "email" },
        { key: "meeting_planned", label: "Termin geplant", status: "Termin geplant", nextCard: "linkedin_close", nextAction: "Termin durchführen", customDue: true, dueDays: 1 },
        { key: "followup_planned", label: "Follow-up geplant", status: "Follow-up geplant", nextCard: "linkedin_followup_planned", nextAction: "Follow-up", customDue: true, dueDays: 7 },
        { key: "close", label: "Weg abschließen", status: "beendet", complete: true }
      ]
    },
    linkedin_alternative: {
      title: "Alternativen Weg wählen",
      buttons: [
        { key: "start_phone", label: "Telefonweg starten", status: "Telefonweg empfohlen", nextCard: "linkedin_alternative", nextAction: "Telefonweg bearbeiten", dueDays: 0, startPathType: "phone" },
        { key: "start_email", label: "E-Mail-Weg starten", status: "E-Mail-Weg empfohlen", nextCard: "linkedin_alternative", nextAction: "E-Mail-Weg bearbeiten", dueDays: 0, startPathType: "email" },
        { key: "check_later", label: "Später nochmal LinkedIn prüfen", status: "LinkedIn später prüfen", nextCard: "linkedin_check_acceptance", nextAction: "LinkedIn erneut prüfen", customDue: true, dueDays: 7 },
        { key: "close", label: "Weg abschließen", status: "beendet", complete: true }
      ]
    },
    linkedin_followup_planned: {
      title: "Geplantes LinkedIn Follow-up",
      buttons: [
        { key: "followup_sent", label: "Follow-up gesendet", status: "Follow-up gesendet", nextCard: "linkedin_check_reply_after_followup", nextAction: "Antwort erneut prüfen", dueDays: 7 },
        { key: "later", label: "Später nachfassen", status: "später nachfassen", nextCard: "linkedin_followup_planned", nextAction: "Follow-up", customDue: true, dueDays: 7 },
        { key: "close", label: "Weg abschließen", status: "beendet", complete: true }
      ]
    },
    linkedin_meeting: {
      title: "Termin planen",
      buttons: [
        { key: "planned", label: "Termin geplant", status: "Termin geplant", nextCard: "linkedin_close", nextAction: "Termin durchführen", customDue: true, dueDays: 1 },
        { key: "later", label: "Später nachfassen", status: "später nachfassen", nextCard: "linkedin_followup_planned", nextAction: "Follow-up", customDue: true, dueDays: 7 }
      ]
    },
    linkedin_request_received: {
      title: "Anfrage erhalten",
      buttons: [
        { key: "rfq", label: "RFQ / Anfrage anlegen", status: "Anfrage erhalten", nextCard: "linkedin_close", nextAction: "RFQ weiterbearbeiten", dueDays: 1 },
        { key: "close", label: "Weg abschließen", status: "Anfrage erhalten", complete: true }
      ]
    },
    linkedin_close: {
      title: "LinkedIn-Weg abschließen",
      buttons: [
        { key: "interested", label: "Kunde interessiert", status: "Kunde interessiert", complete: true },
        { key: "meeting", label: "Termin geplant", status: "Termin geplant", complete: true },
        { key: "request", label: "Anfrage erhalten", status: "Anfrage erhalten", complete: true },
        { key: "later", label: "Später nachfassen", status: "später nachfassen", nextCard: "linkedin_followup_planned", nextAction: "Follow-up", customDue: true, dueDays: 14 },
        { key: "no_need", label: "Kein Bedarf", status: "kein Bedarf", complete: true },
        { key: "lost", label: "Verloren", status: "verloren", complete: true },
        { key: "close", label: "Weg abschließen", status: "beendet", complete: true }
      ]
    },
    phone_call: {
      title: "Telefonkontakt",
      buttons: [
        { key: "called", label: "Angerufen", status: "angerufen", nextCard: "phone_result", nextAction: "Gesprächsergebnis dokumentieren", dueDays: 0 },
        { key: "not_reached", label: "Nicht erreicht", status: "nicht erreicht", nextCard: "phone_call", nextAction: "erneut anrufen", dueDays: 3 },
        { key: "callback", label: "Rückruf gewünscht", status: "Rückruf gewünscht", nextCard: "phone_call", nextAction: "Rückruf planen", customDue: true, dueDays: 1 },
        { key: "wrong_contact", label: "Falscher Kontakt", status: "falscher Kontakt", nextCard: "phone_close", nextAction: "anderen Kontakt wählen", dueDays: 1 }
      ]
    },
    phone_result: {
      title: "Gesprächsergebnis",
      buttons: [
        { key: "interest", label: "Interesse vorhanden", status: "Interesse vorhanden", nextCard: "phone_close", nextAction: "nächste Aktion planen", dueDays: 2 },
        { key: "meeting", label: "Termin gewünscht", status: "Termin gewünscht", nextCard: "phone_close", nextAction: "Termin planen", customDue: true, dueDays: 1 },
        { key: "email", label: "E-Mail gewünscht", status: "E-Mail gewünscht", nextCard: "phone_close", nextAction: "E-Mail senden", dueDays: 1, startPathType: "email" },
        { key: "request", label: "Anfrage erhalten", status: "Anfrage erhalten", nextCard: "phone_close", nextAction: "Anfrage weiterbearbeiten", dueDays: 1 },
        { key: "no_need", label: "Kein Bedarf", status: "kein Bedarf", complete: true },
        { key: "later", label: "Später nachfassen", status: "später nachfassen", nextCard: "phone_call", nextAction: "erneut anrufen", customDue: true, dueDays: 14 }
      ]
    },
    phone_close: {
      title: "Telefon-Weg abschließen",
      buttons: [
        { key: "close", label: "Weg abschließen", status: "beendet", complete: true },
        { key: "later", label: "Später nachfassen", status: "später nachfassen", nextCard: "phone_call", nextAction: "erneut anrufen", customDue: true, dueDays: 14 }
      ]
    },
    email_send: {
      title: "E-Mail senden",
      buttons: [
        { key: "sent", label: "E-Mail gesendet", status: "E-Mail gesendet", nextCard: "email_check_reply", nextAction: "Antwort prüfen", dueDays: 5 },
        { key: "not_sent", label: "E-Mail nicht gesendet", status: "E-Mail offen", nextCard: "email_send", nextAction: "E-Mail senden", dueDays: 1 }
      ]
    },
    email_check_reply: {
      title: "Antwort erhalten?",
      buttons: [
        { key: "reply", label: "Antwort erhalten", status: "Antwort erhalten", nextCard: "email_close", nextAction: "Interesse bewerten", dueDays: 1 },
        { key: "no_reply", label: "Keine Antwort", status: "keine Antwort", nextCard: "email_followup", nextAction: "Follow-up senden", dueDays: 7 },
        { key: "no_interest", label: "Kein Interesse", status: "kein Interesse", complete: true },
        { key: "auto", label: "Automatische Antwort", status: "automatische Antwort", nextCard: "email_check_reply", nextAction: "Antwort erneut prüfen", dueDays: 5 }
      ]
    },
    email_followup: {
      title: "E-Mail Follow-up",
      buttons: [
        { key: "sent", label: "Follow-up gesendet", status: "Follow-up gesendet", nextCard: "email_check_reply", nextAction: "Antwort prüfen", dueDays: 7 },
        { key: "later", label: "Später nachfassen", status: "später nachfassen", nextCard: "email_followup", nextAction: "Follow-up senden", customDue: true, dueDays: 7 },
        { key: "stop", label: "Nicht weiter verfolgen", status: "beendet", complete: true }
      ]
    },
    email_close: {
      title: "E-Mail-Weg abschließen",
      buttons: [
        { key: "interest", label: "Interesse vorhanden", status: "Interesse vorhanden", complete: true },
        { key: "meeting", label: "Termin geplant", status: "Termin geplant", complete: true },
        { key: "request", label: "Anfrage erhalten", status: "Anfrage erhalten", complete: true },
        { key: "later", label: "Später nachfassen", status: "später nachfassen", nextCard: "email_followup", nextAction: "Follow-up senden", customDue: true, dueDays: 14 },
        { key: "close", label: "Weg abschließen", status: "beendet", complete: true }
      ]
    },
    direct_contact_source: {
      title: "Kontaktquelle",
      buttons: [
        { key: "website", label: "Website", status: "Quelle Website", nextCard: "direct_contact_result", nextAction: "Kontakt bewerten", dueDays: 1 },
        { key: "recommendation", label: "Empfehlung", status: "Quelle Empfehlung", nextCard: "direct_contact_result", nextAction: "Kontakt bewerten", dueDays: 1 },
        { key: "call", label: "Direktanruf", status: "Quelle Direktanruf", nextCard: "direct_contact_result", nextAction: "Kontakt bewerten", dueDays: 1 },
        { key: "mail", label: "Direkt-E-Mail", status: "Quelle Direkt-E-Mail", nextCard: "direct_contact_result", nextAction: "Kontakt bewerten", dueDays: 1 },
        { key: "existing", label: "bestehender Kontakt", status: "Quelle bestehender Kontakt", nextCard: "direct_contact_result", nextAction: "Kontakt bewerten", dueDays: 1 },
        { key: "other", label: "Sonstige", status: "Quelle Sonstige", nextCard: "direct_contact_result", nextAction: "Kontakt bewerten", dueDays: 1 }
      ]
    },
    direct_contact_result: {
      title: "Kontakt bewerten",
      buttons: [
        { key: "interest", label: "Interesse vorhanden", status: "Interesse vorhanden", nextCard: "direct_contact_close", nextAction: "nächste Aktion planen", dueDays: 2 },
        { key: "meeting", label: "Termin gewünscht", status: "Termin gewünscht", nextCard: "direct_contact_close", nextAction: "Termin planen", customDue: true, dueDays: 1 },
        { key: "request", label: "Anfrage erhalten", status: "Anfrage erhalten", nextCard: "direct_contact_close", nextAction: "Anfrage weiterbearbeiten", dueDays: 1 },
        { key: "later", label: "Später nachfassen", status: "später nachfassen", nextCard: "direct_contact_result", nextAction: "Follow-up", customDue: true, dueDays: 14 },
        { key: "no_need", label: "Kein Bedarf", status: "kein Bedarf", complete: true }
      ]
    },
    direct_contact_close: {
      title: "Direktkontakt abschließen",
      buttons: [
        { key: "close", label: "Weg abschließen", status: "beendet", complete: true },
        { key: "later", label: "Später nachfassen", status: "später nachfassen", nextCard: "direct_contact_result", nextAction: "Follow-up", customDue: true, dueDays: 14 }
      ]
    },
    closed: {
      title: "Weg abgeschlossen",
      buttons: []
    }
  };

  const aliases = {
    name: ["name", "firma", "firmenname", "unternehmen", "kunde", "customer", "company", "companyname", "azienda", "ragionesociale"],
    country: ["land", "country", "staat", "paese", "nazione"],
    industry: ["branche", "industry", "sektor", "sector", "settore", "bereich"],
    importance: ["wichtigkeit", "prioritaet", "prioritat", "priorita", "importance", "priority", "klasse", "abc", "a", "b", "c"],
    phone: ["telefon", "telefonnummer", "tel", "phone", "rufnummer", "telefono", "telefonoazienda"],
    website: ["website", "webseite", "homepage", "url", "sito", "site"],
    logoUrl: ["logo", "logourl", "logo_url", "bild", "image"],
    status: ["status", "zustand", "phase"],
    notes: ["notiz", "notizen", "notes", "bemerkung", "bemerkungen", "kommentar", "beschreibung", "description", "email", "e-mail", "mail", "ansprechpartner"]
  };

  function normalizeHeader(value) {
    return String(value || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]/g, "");
  }

  function normalizeName(value) {
    return String(value || "").trim().toLowerCase();
  }

  function clean(value) {
    return String(value ?? "").trim();
  }

  function ensureSalesCollections(data) {
    data.sales_paths = Array.isArray(data.sales_paths) ? data.sales_paths : [];
    data.sales_path_events = Array.isArray(data.sales_path_events) ? data.sales_path_events : [];
  }

  function todayIso() {
    return new Date().toISOString().slice(0, 10);
  }

  function addDays(days) {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() + Number(days || 0));
    return date.toISOString().slice(0, 10);
  }

  function formatDate(value) {
    if (!value) return "-";
    try {
      return new Intl.DateTimeFormat("de-DE").format(new Date(`${value}T00:00:00`));
    } catch (error) {
      return value;
    }
  }

  function pathTypeLabel(pathType) {
    const item = salesPathTypes.find((type) => type.value === pathType);
    return item ? item.label : pathType || "-";
  }

  function contactLabel(data, contactId) {
    const contact = (data.contacts || []).find((item) => item.id === contactId);
    return contact ? contact.name || contact.email || contact.phone || "Kontakt ohne Namen" : "Kontakt offen";
  }

  function dueForResult(result, customDue) {
    if (result.complete) return "";
    if (result.customDue && clean(customDue)) return clean(customDue);
    return addDays(result.dueDays ?? 0);
  }

  function parseDelimited(text) {
    const sample = text.slice(0, 3000);
    const delimiter = [";", "\t", ","]
      .map((item) => ({ item, count: sample.split(item).length }))
      .sort((a, b) => b.count - a.count)[0].item;
    const rows = [];
    let row = [];
    let cell = "";
    let quoted = false;

    for (let index = 0; index < text.length; index += 1) {
      const char = text[index];
      const next = text[index + 1];
      if (char === '"' && quoted && next === '"') {
        cell += '"';
        index += 1;
      } else if (char === '"') {
        quoted = !quoted;
      } else if (char === delimiter && !quoted) {
        row.push(cell.trim());
        cell = "";
      } else if ((char === "\n" || char === "\r") && !quoted) {
        if (char === "\r" && next === "\n") index += 1;
        row.push(cell.trim());
        if (row.some((value) => value !== "")) rows.push(row);
        row = [];
        cell = "";
      } else {
        cell += char;
      }
    }

    row.push(cell.trim());
    if (row.some((value) => value !== "")) rows.push(row);
    return rows;
  }

  function columnLetters(ref) {
    return String(ref || "").replace(/[^A-Z]/gi, "").toUpperCase();
  }

  function columnIndex(ref) {
    const letters = columnLetters(ref);
    let total = 0;
    for (let index = 0; index < letters.length; index += 1) {
      total = total * 26 + letters.charCodeAt(index) - 64;
    }
    return Math.max(0, total - 1);
  }

  function textFromXml(xml, selector) {
    const node = xml.querySelector(selector);
    return node ? node.textContent || "" : "";
  }

  async function unzipXlsx(buffer) {
    const bytes = new Uint8Array(buffer);
    const view = new DataView(buffer);
    let eocd = -1;
    for (let index = bytes.length - 22; index >= 0; index -= 1) {
      if (view.getUint32(index, true) === 0x06054b50) {
        eocd = index;
        break;
      }
    }
    if (eocd < 0) throw new Error("Excel-Datei konnte nicht gelesen werden.");

    const entries = {};
    const entryCount = view.getUint16(eocd + 10, true);
    let offset = view.getUint32(eocd + 16, true);
    const decoder = new TextDecoder("utf-8");

    for (let index = 0; index < entryCount; index += 1) {
      if (view.getUint32(offset, true) !== 0x02014b50) break;
      const method = view.getUint16(offset + 10, true);
      const compressedSize = view.getUint32(offset + 20, true);
      const fileNameLength = view.getUint16(offset + 28, true);
      const extraLength = view.getUint16(offset + 30, true);
      const commentLength = view.getUint16(offset + 32, true);
      const localOffset = view.getUint32(offset + 42, true);
      const name = decoder.decode(bytes.slice(offset + 46, offset + 46 + fileNameLength));

      const localNameLength = view.getUint16(localOffset + 26, true);
      const localExtraLength = view.getUint16(localOffset + 28, true);
      const dataStart = localOffset + 30 + localNameLength + localExtraLength;
      const compressed = bytes.slice(dataStart, dataStart + compressedSize);

      if (method === 0) {
        entries[name] = compressed;
      } else if (method === 8) {
        if (!("DecompressionStream" in window)) {
          throw new Error("Dieser Browser kann Excel-Dateien nicht direkt entpacken. Bitte als CSV speichern.");
        }
        const stream = new Blob([compressed]).stream().pipeThrough(new DecompressionStream("deflate-raw"));
        entries[name] = new Uint8Array(await new Response(stream).arrayBuffer());
      }

      offset += 46 + fileNameLength + extraLength + commentLength;
    }

    return entries;
  }

  async function parseXlsx(file) {
    const entries = await unzipXlsx(await file.arrayBuffer());
    const decoder = new TextDecoder("utf-8");
    const parser = new DOMParser();
    const shared = [];

    if (entries["xl/sharedStrings.xml"]) {
      const sharedXml = parser.parseFromString(decoder.decode(entries["xl/sharedStrings.xml"]), "application/xml");
      [...sharedXml.querySelectorAll("si")].forEach((item) => {
        shared.push([...item.querySelectorAll("t")].map((node) => node.textContent || "").join(""));
      });
    }

    const sheetName = Object.keys(entries).find((name) => /^xl\/worksheets\/sheet\d+\.xml$/.test(name));
    if (!sheetName) throw new Error("Keine Tabelle in der Excel-Datei gefunden.");
    const sheetXml = parser.parseFromString(decoder.decode(entries[sheetName]), "application/xml");

    return [...sheetXml.querySelectorAll("sheetData row")].map((row) => {
      const values = [];
      [...row.querySelectorAll("c")].forEach((cell) => {
        const index = columnIndex(cell.getAttribute("r"));
        const type = cell.getAttribute("t");
        let value = "";
        if (type === "s") {
          value = shared[Number(textFromXml(cell, "v"))] || "";
        } else if (type === "inlineStr") {
          value = [...cell.querySelectorAll("t")].map((node) => node.textContent || "").join("");
        } else {
          value = textFromXml(cell, "v");
        }
        values[index] = clean(value);
      });
      return values;
    }).filter((row) => row.some(Boolean));
  }

  async function readRows(file) {
    const name = file.name.toLowerCase();
    if (name.endsWith(".xlsx")) return parseXlsx(file);
    if (name.endsWith(".csv") || name.endsWith(".tsv") || name.endsWith(".txt")) {
      return parseDelimited(await file.text());
    }
    throw new Error("Bitte CSV, TSV oder XLSX wählen. Alte XLS-Dateien bitte als XLSX oder CSV speichern.");
  }

  function findColumn(headers, target) {
    const wanted = aliases[target] || [];
    return headers.findIndex((header) => wanted.includes(normalizeHeader(header)));
  }

  function normalizeStatus(value) {
    const status = normalizeHeader(value);
    if (["aktiv", "active", "kunde", "customer"].includes(status)) return "aktiv";
    if (["ruhend", "sleeping", "paused", "inaktiv"].includes(status)) return "ruhend";
    if (["intern", "internal"].includes(status)) return "intern";
    if (["archiv", "archiviert", "archive", "archived"].includes(status)) return "archiv";
    return "lead";
  }

  function normalizeImportance(value) {
    const normalized = normalizeHeader(value);
    if (["hoch", "high", "wichtig", "top", "a", "1"].includes(normalized)) return "hoch";
    if (["mittel", "medium", "b", "2"].includes(normalized)) return "mittel";
    if (["niedrig", "low", "c", "3"].includes(normalized)) return "niedrig";
    return "normal";
  }

  function rowsToCustomers(rows, fileName) {
    if (rows.length < 2) return [];
    const headers = rows[0].map(clean);
    const indexes = {
      name: findColumn(headers, "name"),
      country: findColumn(headers, "country"),
      industry: findColumn(headers, "industry"),
      importance: findColumn(headers, "importance"),
      phone: findColumn(headers, "phone"),
      website: findColumn(headers, "website"),
      logoUrl: findColumn(headers, "logoUrl"),
      status: findColumn(headers, "status"),
      notes: findColumn(headers, "notes")
    };

    if (indexes.name < 0) {
      throw new Error("Keine Spalte für Firmenname gefunden. Nutze z.B. Firma, Firmenname, Kunde oder Company.");
    }

    return rows.slice(1).map((row) => {
      const unknownNotes = headers
        .map((header, index) => ({ header, value: clean(row[index]) }))
        .filter((item, index) => item.value && !Object.values(indexes).includes(index))
        .map((item) => `${item.header}: ${item.value}`);
      const notes = [
        indexes.notes >= 0 ? clean(row[indexes.notes]) : "",
        unknownNotes.join(" | "),
        `Import: ${fileName}`
      ].filter(Boolean).join("\n");

      return {
        name: clean(row[indexes.name]),
        country: indexes.country >= 0 ? clean(row[indexes.country]) : "",
        industry: indexes.industry >= 0 ? clean(row[indexes.industry]) : "",
        importance: indexes.importance >= 0 ? normalizeImportance(row[indexes.importance]) : "normal",
        phone: indexes.phone >= 0 ? clean(row[indexes.phone]) : "",
        website: indexes.website >= 0 ? clean(row[indexes.website]) : "",
        logoUrl: indexes.logoUrl >= 0 ? clean(row[indexes.logoUrl]) : "",
        status: indexes.status >= 0 ? normalizeStatus(row[indexes.status]) : "lead",
        notes
      };
    }).filter((customer) => customer.name);
  }

  function importCustomers(customers) {
    const data = window.OSM.data;
    data.customers = data.customers || [];
    const existingByName = new Map(data.customers.map((customer) => [normalizeName(customer.name), customer]));
    let created = 0;
    let updated = 0;

    customers.forEach((customer) => {
      const existing = existingByName.get(normalizeName(customer.name));
      if (existing) {
        const next = Object.assign({}, existing);
        ["country", "industry", "importance", "phone", "website", "logoUrl", "status", "notes"].forEach((key) => {
          if (!next[key] && customer[key]) next[key] = customer[key];
        });
        window.OSM.state.upsert(data, "customers", next);
        updated += 1;
      } else {
        const next = Object.assign({ id: window.OSM.state.uid("cus") }, customer);
        window.OSM.state.upsert(data, "customers", next);
        existingByName.set(normalizeName(next.name), next);
        created += 1;
      }
    });

    importMessage = `${created} neue Kunden importiert, ${updated} vorhandene Kunden geprüft.`;
    window.OSM.render();
  }

  async function processImportFile(file) {
    if (!file) return;
    try {
      importMessage = `Import läuft: ${file.name}`;
      window.OSM.render();
      const rows = await readRows(file);
      importCustomers(rowsToCustomers(rows, file.name));
    } catch (error) {
      importMessage = error.message || "Import nicht möglich.";
      window.OSM.render();
    }
  }

  function renderImportPanel(h) {
    return `
      <section class="customer-import-panel customer-import-panel--compact">
        <div class="customer-import-panel__text">
          <span class="kicker">Import</span>
          <h2>Kunden aus Excel oder CSV importieren</h2>
          <p>Unterstützt werden XLSX, CSV, TSV und TXT. Erkannt werden u.a. Kundenname, Branche, Wichtigkeit, Telefon, Website, Status und Notizen.</p>
          <div class="import-chips">
            <span>Firma</span>
            <span>Branche</span>
            <span>Wichtigkeit</span>
            <span>Telefon</span>
            <span>Status</span>
            <span>Notizen</span>
          </div>
          ${importMessage ? `<div class="notice">${h.escapeHtml(importMessage)}</div>` : ""}
        </div>
        <div class="customer-dropzone" data-action="customer-drop-zone">
          <strong>Datei ablegen</strong>
          <span>oder auswählen</span>
          <input class="hidden" type="file" accept=".csv,.tsv,.txt,.xlsx" data-action="customer-import-file" />
          <button class="button" type="button" data-action="customer-import">Datei wählen</button>
        </div>
      </section>
    `;
  }

  function optionTags(options, value, h) {
    return options.map((option) => `
      <option value="${h.escapeHtml(option.value)}" ${String(value || "") === String(option.value) ? "selected" : ""}>
        ${h.escapeHtml(option.label)}
      </option>
    `).join("");
  }

  function customerInitials(customer) {
    return clean(customer.name || "K")
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0] || "")
      .join("")
      .toUpperCase();
  }

  function logoSource(customer) {
    return customer.logoDataUrl || customer.logoUrl || "";
  }

  function renderLogo(customer, h) {
    const source = logoSource(customer);
    if (source) {
      return `<div class="customer-logo"><img src="${h.escapeHtml(source)}" alt="${h.escapeHtml(customer.name || "Kundenlogo")}" /></div>`;
    }
    return `<div class="customer-logo customer-logo--placeholder">${h.escapeHtml(customerInitials(customer))}</div>`;
  }

  function importanceRank(value) {
    return { hoch: 0, mittel: 1, normal: 2, niedrig: 3 }[value || "normal"] ?? 2;
  }

  function importanceTone(value) {
    if (value === "hoch") return "danger";
    if (value === "mittel") return "warn";
    if (value === "niedrig") return "muted";
    return "ok";
  }

  function renderCustomerList(rows, selected, h) {
    if (!rows.length) return `<div class="empty">Keine Kunden gefunden.</div>`;
    return `
      <div class="customer-list">
        ${rows.map((customer) => {
          const active = selected && selected.id === customer.id ? " is-active" : "";
          return `
            <button class="customer-list-item${active}" type="button" data-action="select-customer" data-id="${h.escapeHtml(customer.id)}">
              <span class="customer-list-item__name">${h.escapeHtml(customer.name || "Ohne Namen")}</span>
              <span class="customer-list-item__meta">${h.escapeHtml(customer.industry || "Branche offen")}</span>
              <span class="customer-list-item__footer">
                ${h.badge(customer.importance || "normal", importanceTone(customer.importance))}
                ${h.badge(customer.status || "lead", h.toneForStatus(customer.status))}
              </span>
            </button>
          `;
        }).join("")}
      </div>
    `;
  }

  function valueRow(label, value, h) {
    return `
      <div class="customer-value">
        <span>${h.escapeHtml(label)}</span>
        <strong>${h.escapeHtml(value || "-")}</strong>
      </div>
    `;
  }

  function renderCustomerReadonly(customer, contacts, h) {
    return `
      <div class="customer-detail-read">
        <div class="customer-profile">
          ${renderLogo(customer, h)}
          <div>
            <h2>${h.escapeHtml(customer.name || "Ohne Namen")}</h2>
            <div class="customer-profile__badges">
              ${h.badge(customer.importance || "normal", importanceTone(customer.importance))}
              ${h.badge(customer.status || "lead", h.toneForStatus(customer.status))}
            </div>
          </div>
        </div>
        <div class="customer-value-grid">
          ${valueRow("Branche", customer.industry, h)}
          ${valueRow("Telefon Firma", customer.phone, h)}
          ${valueRow("Land", customer.country, h)}
          ${valueRow("Website", customer.website, h)}
        </div>
        <section class="customer-section">
          <div class="customer-section__head">
            <h3>Kontakte</h3>
            <button class="icon-button" type="button" data-action="customer-edit-contacts">+ Kontakt hinzufügen</button>
          </div>
          ${renderContactCards(customer, contacts, false, h)}
        </section>
        <section class="customer-section">
          <h3>Notizen</h3>
          <div class="customer-notes">${h.escapeHtml(customer.notes || "Noch keine Notizen.").replace(/\n/g, "<br>")}</div>
        </section>
      </div>
    `;
  }

  function renderCustomerEditor(customer, contacts, h) {
    return `
      <form class="customer-detail-form" data-customer-detail-form data-customer-id="${h.escapeHtml(customer.id)}">
        <div class="customer-edit-head">
          ${renderLogo(customer, h)}
          <div class="customer-logo-tools">
            <label class="button button--quiet">
              Logo einfügen
              <input class="hidden" type="file" accept="image/*" data-action="customer-logo-file" />
            </label>
            <input name="logoUrl" type="url" value="${h.escapeHtml(customer.logoUrl || "")}" placeholder="Logo-URL optional" />
          </div>
        </div>
        <div class="customer-form-grid">
          <label>
            <span>Kundenname</span>
            <input name="name" required value="${h.escapeHtml(customer.name || "")}" />
          </label>
          <label>
            <span>Branche</span>
            <input name="industry" value="${h.escapeHtml(customer.industry || "")}" />
          </label>
          <label>
            <span>Wichtigkeit</span>
            <select name="importance">${optionTags(importanceOptions, customer.importance || "normal", h)}</select>
          </label>
          <label>
            <span>Status</span>
            <select name="status">${optionTags(statusOptions, customer.status || "lead", h)}</select>
          </label>
          <label>
            <span>Telefon Firma</span>
            <input name="phone" value="${h.escapeHtml(customer.phone || "")}" />
          </label>
          <label>
            <span>Land</span>
            <input name="country" value="${h.escapeHtml(customer.country || "")}" />
          </label>
          <label class="customer-form-grid__wide">
            <span>Website</span>
            <input name="website" type="url" value="${h.escapeHtml(customer.website || "")}" />
          </label>
          <label class="customer-form-grid__wide">
            <span>Notizen zur Firma</span>
            <textarea name="notes" rows="4">${h.escapeHtml(customer.notes || "")}</textarea>
          </label>
        </div>
        <section class="customer-section">
          <div class="customer-section__head">
            <h3>Kontakte</h3>
            <button class="icon-button" type="button" data-action="customer-add-contact">+ Kontakt</button>
          </div>
          ${renderContactCards(customer, contacts, true, h)}
        </section>
      </form>
    `;
  }

  function emptyContactForIndex(index) {
    const role = index === 0 ? "Einkauf" : index === 1 ? "Vertrieb" : "";
    return { id: `draft_${index}`, role, name: "", email: "", phone: "", linkedin: "", notes: "", isDraft: true };
  }

  function renderContactCards(customer, contacts, editing, h) {
    const visibleContacts = contacts.slice();
    const minimumSlots = editing ? Math.max(2, visibleContacts.length + (extraContactSlots[customer.id] || 0)) : visibleContacts.length;
    while (editing && visibleContacts.length < minimumSlots) {
      visibleContacts.push(emptyContactForIndex(visibleContacts.length));
    }

    if (!editing && !visibleContacts.length) {
      return `<div class="empty">Noch keine Kontakte gespeichert.</div>`;
    }

    return `
      <div class="customer-contact-grid">
        ${visibleContacts.map((contact, index) => editing ? renderContactEditor(contact, index, h) : renderContactReadonly(contact, h)).join("")}
        ${editing ? `
          <button class="customer-contact-add" type="button" data-action="customer-add-contact">
            <strong>+</strong>
            <span>Weiteren Kontakt hinzufügen</span>
          </button>
        ` : ""}
      </div>
    `;
  }

  function renderContactReadonly(contact, h) {
    return `
      <article class="customer-contact-card">
        <div class="customer-contact-card__head">
          <strong>${h.escapeHtml(contact.name || "Kontakt ohne Namen")}</strong>
          ${h.badge(contact.role || "Kontakt", "muted")}
        </div>
        <div class="customer-contact-lines">
          <span>${h.escapeHtml(contact.email || "E-Mail offen")}</span>
          <span>${h.escapeHtml(contact.phone || "Telefon offen")}</span>
          ${contact.linkedin ? `<a href="${h.escapeHtml(contact.linkedin)}" target="_blank" rel="noreferrer">LinkedIn öffnen</a>` : `<span>LinkedIn offen</span>`}
        </div>
        ${contact.notes ? `<p>${h.escapeHtml(contact.notes).replace(/\n/g, "<br>")}</p>` : ""}
      </article>
    `;
  }

  function renderContactEditor(contact, index, h) {
    return `
      <article class="customer-contact-card customer-contact-card--edit" data-contact-card data-contact-id="${h.escapeHtml(contact.id)}">
        <div class="customer-contact-card__head">
          <strong>Kontakt ${index + 1}</strong>
          ${contact.isDraft ? `<span class="small muted">wird erst mit Inhalt gespeichert</span>` : `
            <button class="icon-button icon-button--danger" type="button" data-action="customer-remove-contact" data-id="${h.escapeHtml(contact.id)}">Entfernen</button>
          `}
        </div>
        <div class="customer-contact-form">
          <label>
            <span>Bereich</span>
            <select data-contact-field="role">${optionTags(contactRoleOptions, contact.role || "", h)}<option value="" ${contact.role ? "" : "selected"}>-</option></select>
          </label>
          <label>
            <span>Name</span>
            <input data-contact-field="name" value="${h.escapeHtml(contact.name || "")}" />
          </label>
          <label>
            <span>E-Mail</span>
            <input data-contact-field="email" type="email" value="${h.escapeHtml(contact.email || "")}" />
          </label>
          <label>
            <span>Telefon</span>
            <input data-contact-field="phone" value="${h.escapeHtml(contact.phone || "")}" />
          </label>
          <label class="customer-contact-form__wide">
            <span>LinkedIn</span>
            <input data-contact-field="linkedin" type="url" value="${h.escapeHtml(contact.linkedin || "")}" />
          </label>
          <label class="customer-contact-form__wide">
            <span>Persönliche Notiz / worauf achten?</span>
            <textarea data-contact-field="notes" rows="3">${h.escapeHtml(contact.notes || "")}</textarea>
          </label>
        </div>
      </article>
    `;
  }

  function salesPathsForCustomer(data, customerId) {
    ensureSalesCollections(data);
    return (data.sales_paths || [])
      .filter((path) => path.customer_id === customerId)
      .sort((a, b) => String(b.updated_at || b.created_at || "").localeCompare(String(a.updated_at || a.created_at || "")));
  }

  function salesEventsForPath(data, pathId) {
    ensureSalesCollections(data);
    return (data.sales_path_events || [])
      .filter((event) => event.sales_path_id === pathId)
      .sort((a, b) => String(b.created_at || "").localeCompare(String(a.created_at || "")));
  }

  function renderCustomerTabs(customer, data, h) {
    const pathCount = salesPathsForCustomer(data, customer.id).length;
    const tabs = [
      { id: "profile", label: "Profil" },
      { id: "salesPaths", label: `Vertriebswege (${pathCount})` }
    ];
    return `
      <div class="customer-tabs">
        ${tabs.map((tab) => `
          <button class="${customerDetailTab === tab.id ? "is-active" : ""}" type="button" data-action="customer-tab" data-tab="${h.escapeHtml(tab.id)}">
            ${h.escapeHtml(tab.label)}
          </button>
        `).join("")}
      </div>
    `;
  }

  function renderSalesPaths(customer, contacts, data, h) {
    const paths = salesPathsForCustomer(data, customer.id);
    const activePaths = paths.filter((path) => path.is_active !== false);
    const completedPaths = paths.filter((path) => path.is_active === false);

    return `
      <div class="sales-paths-panel sales-paths-panel--notion">
        <div class="sales-paths-head sales-paths-head--notion">
          <div>
            <span class="kicker">Vertriebswege</span>
            <h3>Wo stehen wir bei diesem Kunden?</h3>
          </div>
          <button class="button" type="button" data-action="sales-path-open-modal">+ Weg hinzufügen</button>
        </div>
        <div class="sales-path-viewbar">
          <span class="sales-path-viewbar__item is-active">Board</span>
          <span class="sales-path-viewbar__item">Alle Wege</span>
        </div>
        <div class="sales-path-stats">
          <span><strong>${activePaths.length}</strong> aktiv</span>
          <span><strong>${completedPaths.length}</strong> abgeschlossen</span>
          <span><strong>${paths.filter((path) => path.path_type === "linkedin").length}</strong> LinkedIn</span>
          <span><strong>${paths.filter((path) => path.path_type === "phone").length}</strong> Telefon</span>
          <span><strong>${paths.filter((path) => path.path_type === "email").length}</strong> E-Mail</span>
        </div>
        ${paths.length ? renderSalesPathBoard(paths, data, h) : `
          <div class="sales-path-empty">
            <strong>Noch kein Vertriebsweg gestartet</strong>
            <span>Starte zum Beispiel LinkedIn, Telefon, E-Mail oder Direktkontakt für einen vorhandenen Kontakt.</span>
            <button class="button" type="button" data-action="sales-path-open-modal">+ Weg hinzufügen</button>
          </div>
        `}
        ${renderSalesPathModal(customer, contacts, h)}
      </div>
    `;
  }

  function salesPathBoardColumn(path) {
    if (path.is_active === false) return "done";
    const type = salesPathTypes.find((item) => item.value === path.path_type);
    if (!path.status || path.status === "gestartet" || (type && path.active_card === type.startCard)) return "not_started";
    return "in_progress";
  }

  function renderSalesPathBoard(paths, data, h) {
    const columns = [
      { id: "not_started", label: "Nicht begonnen", tone: "neutral" },
      { id: "in_progress", label: "In Bearbeitung", tone: "blue" },
      { id: "done", label: "Fertig", tone: "green" }
    ];
    return `
      <div class="sales-path-board">
        ${columns.map((column) => {
          const rows = paths.filter((path) => salesPathBoardColumn(path) === column.id);
          return `
            <section class="sales-path-column sales-path-column--${h.escapeHtml(column.tone)}">
              <div class="sales-path-column__title">
                <span></span>
                <strong>${h.escapeHtml(column.label)}</strong>
                <em>${rows.length}</em>
              </div>
              <div class="sales-path-column__cards">
                ${rows.length ? rows.map((path) => renderSalesPathCard(path, data, h)).join("") : `<div class="sales-path-column__empty">Keine Wege</div>`}
                <button class="sales-path-add-inline" type="button" data-action="sales-path-open-modal">+ Neuer Weg</button>
              </div>
            </section>
          `;
        }).join("")}
      </div>
    `;
  }

  function renderSalesPathModal(customer, contacts, h) {
    if (!salesPathModalOpen) return "";
    const usableContacts = contacts.filter((contact) => contact.id && !String(contact.id).startsWith("draft_"));
    return `
      <div class="customer-sales-modal-backdrop" data-sales-path-modal>
        <div class="customer-sales-modal">
          <div class="modal__head">
            <div>
              <span class="kicker">Vertriebsweg</span>
              <div class="modal__title">Vertriebsweg hinzufügen</div>
            </div>
            <button class="icon-button" type="button" data-action="sales-path-close-modal">Schließen</button>
          </div>
          <div class="customer-form-grid">
            <label>
              <span>Weg</span>
              <select data-action="sales-path-type">
                ${optionTags(salesPathTypes, "linkedin", h)}
              </select>
            </label>
            <label>
              <span>Kontakt</span>
              <select data-action="sales-path-contact" ${usableContacts.length ? "" : "disabled"}>
                ${usableContacts.map((contact) => `
                  <option value="${h.escapeHtml(contact.id)}">${h.escapeHtml(contact.name || contact.email || contact.phone || "Kontakt ohne Namen")}</option>
                `).join("")}
              </select>
            </label>
          </div>
          ${usableContacts.length ? "" : `<div class="notice notice--plain">Bitte zuerst im Profil mindestens einen Kontakt speichern.</div>`}
          <div class="form-actions">
            <button class="button button--quiet" type="button" data-action="sales-path-close-modal">Abbrechen</button>
            <button class="button" type="button" data-action="sales-path-start" data-customer-id="${h.escapeHtml(customer.id)}" ${usableContacts.length ? "" : "disabled"}>Weg starten</button>
          </div>
        </div>
      </div>
    `;
  }

  function renderSalesPathCard(path, data, h) {
    const card = salesPathCards[path.active_card] || salesPathCards.closed;
    const events = salesEventsForPath(data, path.id);
    return `
      <article class="sales-path-card sales-path-card--notion" data-sales-path-card data-path-id="${h.escapeHtml(path.id)}">
        <div class="sales-path-card__head">
          <div>
            <h4>${h.escapeHtml(contactLabel(data, path.contact_id))}</h4>
            <span class="sales-path-type">${h.escapeHtml(pathTypeLabel(path.path_type))}</span>
          </div>
          ${h.badge(path.is_active === false ? "abgeschlossen" : path.status || "aktiv", path.is_active === false ? "muted" : h.toneForStatus(path.status || "aktiv"))}
        </div>
        <div class="sales-path-meta">
          <span><strong>Aktuelles Kästchen:</strong> ${h.escapeHtml(card.title)}</span>
          <span><strong>Nächste Aufgabe:</strong> ${h.escapeHtml(path.next_action || "-")}</span>
          <span><strong>Fällig:</strong> ${h.escapeHtml(formatDate(path.next_action_due))}</span>
        </div>
        ${path.is_active === false ? `
          <div class="notice notice--plain">Dieser Weg ist abgeschlossen.</div>
        ` : renderDecisionDropdown(path, card, h)}
        <details class="sales-card-more">
          <summary>Mehr</summary>
          <div class="sales-card-more__menu">
            <button class="icon-button" type="button" data-action="sales-path-note" data-path-id="${h.escapeHtml(path.id)}">Notiz hinzufügen</button>
            <button class="icon-button icon-button--danger" type="button" data-action="sales-path-complete" data-path-id="${h.escapeHtml(path.id)}">Weg abschließen</button>
          </div>
        </details>
        ${renderSalesPathEvents(events, data, h)}
      </article>
    `;
  }

  function renderDecisionCard(path, card, h) {
    const needsDate = (card.buttons || []).some((button) => button.customDue);
    return `
      <section class="sales-decision-card">
        <div class="sales-decision-card__title">${h.escapeHtml(card.title)}</div>
        ${needsDate ? `
          <label class="sales-decision-date">
            <span>Fälligkeit für geplante Schritte</span>
            <input type="date" data-action="sales-path-custom-due" value="${h.escapeHtml(path.next_action_due || addDays(7))}" />
          </label>
        ` : ""}
        <div class="sales-decision-buttons">
          ${(card.buttons || []).map((button) => `
            <button class="button button--quiet" type="button" data-action="sales-path-result" data-path-id="${h.escapeHtml(path.id)}" data-result-key="${h.escapeHtml(button.key)}">
              ${h.escapeHtml(button.label)}
            </button>
          `).join("")}
          <button class="button button--quiet" type="button" data-action="sales-path-note" data-path-id="${h.escapeHtml(path.id)}">Notiz</button>
        </div>
      </section>
    `;
  }

  function renderDecisionDropdown(path, card, h) {
    const buttons = card.buttons || [];
    const needsDate = buttons.some((button) => button.customDue);
    return `
      <section class="sales-decision-card sales-decision-card--dropdown">
        <div class="sales-decision-card__title">${h.escapeHtml(card.title)}</div>
        <div class="sales-decision-row">
          <label class="sales-decision-select">
            <span>Ergebnis / nächster Schritt</span>
            <select data-action="sales-path-result-select" data-path-id="${h.escapeHtml(path.id)}">
              <option value="">Bitte auswählen...</option>
              ${buttons.map((button) => `<option value="${h.escapeHtml(button.key)}">${h.escapeHtml(button.label)}</option>`).join("")}
            </select>
          </label>
          ${needsDate ? `
            <label class="sales-decision-date">
              <span>Fällig</span>
              <input type="date" data-action="sales-path-custom-due" value="${h.escapeHtml(path.next_action_due || addDays(7))}" />
            </label>
          ` : ""}
          <button class="button" type="button" data-action="sales-path-apply-result" data-path-id="${h.escapeHtml(path.id)}">Übernehmen</button>
        </div>
      </section>
    `;
  }

  function renderSalesPathEvents(events, data, h) {
    return `
      <details class="sales-path-history">
        <summary>Verlauf (${events.length})</summary>
        <div class="sales-path-history__list">
          ${events.length ? events.map((event) => `
            <div class="sales-path-event">
              <strong>${h.escapeHtml(event.selected_result || event.card_title || "Eintrag")}</strong>
              <span>${h.escapeHtml(event.created_at ? new Date(event.created_at).toLocaleString("de-DE") : "-")} · ${h.escapeHtml(event.created_by || "-")} · ${h.escapeHtml(pathTypeLabel(event.path_type))} · ${h.escapeHtml(contactLabel(data, event.contact_id))}</span>
              <span>Kästchen: ${h.escapeHtml(event.card_title || "-")}</span>
              ${event.next_action ? `<span>Nächste Aufgabe: ${h.escapeHtml(event.next_action)} · Fällig: ${h.escapeHtml(formatDate(event.next_action_due))}</span>` : ""}
              ${event.note ? `<p>${h.escapeHtml(event.note).replace(/\n/g, "<br>")}</p>` : ""}
            </div>
          `).join("") : `<div class="empty">Noch kein Verlauf.</div>`}
        </div>
      </details>
    `;
  }

  function createSalesPath(data, customerId, contactId, pathType, summary) {
    ensureSalesCollections(data);
    const type = salesPathTypes.find((item) => item.value === pathType) || salesPathTypes[0];
    const now = new Date().toISOString();
    const path = {
      id: window.OSM.state.uid("sp"),
      customer_id: customerId,
      contact_id: contactId,
      path_type: type.value,
      status: "gestartet",
      active_card: type.startCard,
      next_action: type.firstAction,
      next_action_due: todayIso(),
      is_active: true,
      created_at: now,
      updated_at: now,
      completed_at: ""
    };
    window.OSM.state.upsert(data, "sales_paths", path);
    addSalesPathEvent(data, path, "Vertriebsweg gestartet", "", type.firstAction, todayIso(), summary || "Weg gestartet");
    return path;
  }

  function addSalesPathEvent(data, path, result, note, nextAction, nextDue, cardTitleOverride) {
    ensureSalesCollections(data);
    const card = salesPathCards[path.active_card] || salesPathCards.closed;
    const event = {
      id: window.OSM.state.uid("spe"),
      sales_path_id: path.id,
      customer_id: path.customer_id,
      contact_id: path.contact_id,
      path_type: path.path_type,
      card_title: cardTitleOverride || card.title,
      selected_result: result,
      note: note || "",
      next_action: nextAction || "",
      next_action_due: nextDue || "",
      created_by: window.OSM.state.currentUser(data),
      created_at: new Date().toISOString()
    };
    window.OSM.state.upsert(data, "sales_path_events", event);
  }

  function applySalesPathResult(pathId, resultKey, customDue) {
    const data = window.OSM.data;
    ensureSalesCollections(data);
    const path = (data.sales_paths || []).find((item) => item.id === pathId);
    if (!path) return;
    const card = salesPathCards[path.active_card] || salesPathCards.closed;
    const result = (card.buttons || []).find((button) => button.key === resultKey);
    if (!result) return;

    const beforeCardTitle = card.title;
    const nextDue = dueForResult(result, customDue);
    const nextPath = Object.assign({}, path, {
      status: result.status || path.status,
      active_card: result.complete ? "closed" : result.nextCard || path.active_card,
      next_action: result.complete ? "" : result.nextAction || path.next_action,
      next_action_due: nextDue,
      is_active: result.complete ? false : true,
      completed_at: result.complete ? new Date().toISOString() : path.completed_at || "",
      updated_at: new Date().toISOString()
    });

    window.OSM.state.upsert(data, "sales_paths", nextPath);
    addSalesPathEvent(data, Object.assign({}, path, { active_card: path.active_card }), result.label, "", nextPath.next_action, nextPath.next_action_due, beforeCardTitle);

    if (result.startPathType) {
      createSalesPath(data, path.customer_id, path.contact_id, result.startPathType, `${pathTypeLabel(result.startPathType)} aus ${pathTypeLabel(path.path_type)} gestartet`);
    }

    customerDetailTab = "salesPaths";
    window.OSM.render();
  }

  function addSalesPathNote(pathId) {
    const data = window.OSM.data;
    ensureSalesCollections(data);
    const path = (data.sales_paths || []).find((item) => item.id === pathId);
    if (!path) return;
    const note = prompt("Notiz zum aktuellen Vertriebsweg:");
    if (note === null) return;
    addSalesPathEvent(data, path, "Notiz", clean(note), path.next_action, path.next_action_due);
    path.updated_at = new Date().toISOString();
    window.OSM.state.upsert(data, "sales_paths", path);
    customerDetailTab = "salesPaths";
    window.OSM.render();
  }

  function completeSalesPath(pathId) {
    const data = window.OSM.data;
    ensureSalesCollections(data);
    const path = (data.sales_paths || []).find((item) => item.id === pathId);
    if (!path) return;
    const nextPath = Object.assign({}, path, {
      status: "beendet",
      active_card: "closed",
      next_action: "",
      next_action_due: "",
      is_active: false,
      completed_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
    window.OSM.state.upsert(data, "sales_paths", nextPath);
    addSalesPathEvent(data, path, "Weg abgeschlossen", "", "", "");
    customerDetailTab = "salesPaths";
    window.OSM.render();
  }

  function relatedCount(data, collection, customerId) {
    return (data[collection] || []).filter((item) => item.customerId === customerId).length;
  }

  function renderSelectedCustomer(customer, data, h) {
    if (!customer) {
      return `
        <section class="customer-detail-panel">
          <div class="empty">Wähle links einen Kunden oder lege einen neuen Kunden an.</div>
        </section>
      `;
    }

    const contacts = (data.contacts || []).filter((contact) => contact.customerId === customer.id);
    const paths = salesPathsForCustomer(data, customer.id);
    const editing = editingCustomerId === customer.id;
    return `
      <section class="customer-detail-panel">
        <div class="customer-detail-toolbar">
          <div>
            <span class="kicker">Kundenakte</span>
            <h2>${h.escapeHtml(customer.name || "Neuer Kunde")}</h2>
          </div>
          <div class="customer-detail-actions">
            <button class="button" type="button" data-action="customer-save" ${editing ? "" : "disabled"}>Speichern</button>
            <button class="button button--quiet" type="button" data-action="customer-edit">Bearbeiten</button>
            <button class="button button--quiet" type="button" data-action="customer-archive">Archivieren</button>
            <button class="button button--danger" type="button" data-action="customer-delete">Löschen</button>
          </div>
        </div>
        <div class="customer-mini-stats">
          <span>${contacts.length} Kontakte</span>
          <span>${paths.filter((path) => path.is_active !== false).length} aktive Vertriebswege</span>
          <span>${relatedCount(data, "rfqs", customer.id)} RFQs</span>
          <span>${relatedCount(data, "orders", customer.id)} Aufträge</span>
        </div>
        ${renderCustomerTabs(customer, data, h)}
        ${customerDetailTab === "salesPaths"
          ? renderSalesPaths(customer, contacts, data, h)
          : editing ? renderCustomerEditor(customer, contacts, h) : renderCustomerReadonly(customer, contacts, h)}
      </section>
    `;
  }

  function saveCustomerFromForm(options = {}) {
    const form = document.querySelector("[data-customer-detail-form]");
    if (!form) return false;
    const data = window.OSM.data;
    const id = form.dataset.customerId;
    const existing = window.OSM.state.findById(data, "customers", id) || { id };
    const next = Object.assign({}, existing, {
      name: clean(form.elements.name.value),
      industry: clean(form.elements.industry.value),
      importance: clean(form.elements.importance.value) || "normal",
      status: clean(form.elements.status.value) || "lead",
      phone: clean(form.elements.phone.value),
      country: clean(form.elements.country.value),
      website: clean(form.elements.website.value),
      logoUrl: clean(form.elements.logoUrl.value),
      notes: clean(form.elements.notes.value)
    });

    if (!next.name) {
      alert("Bitte zuerst einen Kundennamen eingeben.");
      return false;
    }

    window.OSM.state.upsert(data, "customers", next);

    [...form.querySelectorAll("[data-contact-card]")].forEach((card) => {
      const contactId = card.dataset.contactId;
      const existingContact = contactId && !contactId.startsWith("draft_")
        ? window.OSM.state.findById(data, "contacts", contactId)
        : null;
      const contact = {
        id: existingContact ? existingContact.id : window.OSM.state.uid("con"),
        customerId: id,
        role: clean(card.querySelector("[data-contact-field='role']").value),
        name: clean(card.querySelector("[data-contact-field='name']").value),
        email: clean(card.querySelector("[data-contact-field='email']").value),
        phone: clean(card.querySelector("[data-contact-field='phone']").value),
        linkedin: clean(card.querySelector("[data-contact-field='linkedin']").value),
        notes: clean(card.querySelector("[data-contact-field='notes']").value)
      };
      const hasContent = contact.role || contact.name || contact.email || contact.phone || contact.linkedin || contact.notes;
      if (existingContact || hasContent) {
        window.OSM.state.upsert(data, "contacts", Object.assign({}, existingContact || {}, contact));
      }
    });

    selectedCustomerId = id;
    editingCustomerId = options.keepEditing ? id : "";
    if (!options.keepExtraSlots) extraContactSlots[id] = 0;
    if (options.renderAfter !== false) window.OSM.render();
    return true;
  }

  function createCustomer() {
    const id = window.OSM.state.uid("cus");
    const customer = {
      id,
      name: "Neuer Kunde",
      country: "",
      industry: "",
      importance: "normal",
      phone: "",
      website: "",
      status: "lead",
      notes: ""
    };
    window.OSM.state.upsert(window.OSM.data, "customers", customer);
    selectedCustomerId = id;
    editingCustomerId = id;
    window.OSM.render();
  }

  function bindCustomerHandlers() {
    if (window.OSM_CUSTOMER_IMPORT_BOUND) return;
    window.OSM_CUSTOMER_IMPORT_BOUND = true;

    document.addEventListener("click", (event) => {
      const importButton = event.target.closest("[data-action='customer-import']");
      if (importButton) {
        const input = document.querySelector("[data-action='customer-import-file']");
        if (input) input.click();
        return;
      }

      const newButton = event.target.closest("[data-action='customer-new']");
      if (newButton) {
        createCustomer();
        return;
      }

      const selectButton = event.target.closest("[data-action='select-customer']");
      if (selectButton) {
        selectedCustomerId = selectButton.dataset.id;
        editingCustomerId = "";
        salesPathModalOpen = false;
        window.OSM.render();
        return;
      }

      const tabButton = event.target.closest("[data-action='customer-tab']");
      if (tabButton) {
        customerDetailTab = tabButton.dataset.tab || "profile";
        salesPathModalOpen = false;
        window.OSM.render();
        return;
      }

      if (event.target.closest("[data-action='sales-path-open-modal']")) {
        customerDetailTab = "salesPaths";
        salesPathModalOpen = true;
        window.OSM.render();
        return;
      }

      if (event.target.closest("[data-action='sales-path-close-modal']")) {
        salesPathModalOpen = false;
        window.OSM.render();
        return;
      }

      const startPathButton = event.target.closest("[data-action='sales-path-start']");
      if (startPathButton) {
        const modal = startPathButton.closest("[data-sales-path-modal]");
        const pathType = modal ? modal.querySelector("[data-action='sales-path-type']").value : "linkedin";
        const contactId = modal ? modal.querySelector("[data-action='sales-path-contact']").value : "";
        if (!contactId) {
          alert("Bitte zuerst einen vorhandenen Kontakt auswählen.");
          return;
        }
        createSalesPath(window.OSM.data, selectedCustomerId, contactId, pathType);
        salesPathModalOpen = false;
        customerDetailTab = "salesPaths";
        window.OSM.render();
        return;
      }

      const resultButton = event.target.closest("[data-action='sales-path-result']");
      if (resultButton) {
        const card = resultButton.closest("[data-sales-path-card]");
        const dueInput = card ? card.querySelector("[data-action='sales-path-custom-due']") : null;
        applySalesPathResult(resultButton.dataset.pathId, resultButton.dataset.resultKey, dueInput ? dueInput.value : "");
        return;
      }

      const applyResultButton = event.target.closest("[data-action='sales-path-apply-result']");
      if (applyResultButton) {
        const card = applyResultButton.closest("[data-sales-path-card]");
        const select = card ? card.querySelector("[data-action='sales-path-result-select']") : null;
        const dueInput = card ? card.querySelector("[data-action='sales-path-custom-due']") : null;
        if (!select || !select.value) {
          alert("Bitte zuerst ein Ergebnis auswählen.");
          return;
        }
        applySalesPathResult(applyResultButton.dataset.pathId, select.value, dueInput ? dueInput.value : "");
        return;
      }

      const noteButton = event.target.closest("[data-action='sales-path-note']");
      if (noteButton) {
        addSalesPathNote(noteButton.dataset.pathId);
        return;
      }

      const completePathButton = event.target.closest("[data-action='sales-path-complete']");
      if (completePathButton) {
        if (!confirm("Diesen Vertriebsweg wirklich abschließen?")) return;
        completeSalesPath(completePathButton.dataset.pathId);
        return;
      }

      if (event.target.closest("[data-action='customer-edit']")) {
        if (selectedCustomerId) editingCustomerId = selectedCustomerId;
        customerDetailTab = "profile";
        window.OSM.render();
        return;
      }

      if (event.target.closest("[data-action='customer-edit-contacts']")) {
        if (selectedCustomerId) editingCustomerId = selectedCustomerId;
        customerDetailTab = "profile";
        salesPathModalOpen = false;
        window.OSM.render();
        return;
      }

      if (event.target.closest("[data-action='customer-save']")) {
        saveCustomerFromForm();
        return;
      }

      if (event.target.closest("[data-action='customer-add-contact']")) {
        if (!selectedCustomerId) return;
        if (editingCustomerId !== selectedCustomerId) {
          editingCustomerId = selectedCustomerId;
          window.OSM.render();
          return;
        }
        saveCustomerFromForm({ keepEditing: true, renderAfter: false, keepExtraSlots: true });
        extraContactSlots[selectedCustomerId] = (extraContactSlots[selectedCustomerId] || 0) + 1;
        window.OSM.render();
        return;
      }

      const removeContact = event.target.closest("[data-action='customer-remove-contact']");
      if (removeContact) {
        if (!confirm("Diesen Kontakt wirklich entfernen?")) return;
        window.OSM.state.remove(window.OSM.data, "contacts", removeContact.dataset.id);
        window.OSM.render();
        return;
      }

      if (event.target.closest("[data-action='customer-archive']")) {
        const customer = window.OSM.state.findById(window.OSM.data, "customers", selectedCustomerId);
        if (!customer) return;
        window.OSM.state.upsert(window.OSM.data, "customers", Object.assign({}, customer, { status: "archiv" }));
        editingCustomerId = "";
        window.OSM.render();
        return;
      }

      if (event.target.closest("[data-action='customer-delete']")) {
        const customer = window.OSM.state.findById(window.OSM.data, "customers", selectedCustomerId);
        if (!customer) return;
        if (!confirm(`Kunde "${customer.name}" und seine Kontakte wirklich löschen?`)) return;
        (window.OSM.data.contacts || [])
          .filter((contact) => contact.customerId === selectedCustomerId)
          .forEach((contact) => window.OSM.state.remove(window.OSM.data, "contacts", contact.id));
        (window.OSM.data.sales_paths || [])
          .filter((path) => path.customer_id === selectedCustomerId)
          .forEach((path) => window.OSM.state.remove(window.OSM.data, "sales_paths", path.id));
        (window.OSM.data.sales_path_events || [])
          .filter((eventItem) => eventItem.customer_id === selectedCustomerId)
          .forEach((eventItem) => window.OSM.state.remove(window.OSM.data, "sales_path_events", eventItem.id));
        window.OSM.state.remove(window.OSM.data, "customers", selectedCustomerId);
        selectedCustomerId = "";
        editingCustomerId = "";
        window.OSM.render();
      }
    });

    document.addEventListener("change", async (event) => {
      if (event.target.dataset.action === "customer-import-file") {
        const file = event.target.files && event.target.files[0];
        await processImportFile(file);
        event.target.value = "";
        return;
      }

      if (event.target.dataset.action === "customer-logo-file") {
        const file = event.target.files && event.target.files[0];
        if (!file || !selectedCustomerId) return;
        if (file.size > 1400000) {
          alert("Das Logo ist zu groß. Bitte ein kleines Logo unter ca. 1,4 MB wählen.");
          event.target.value = "";
          return;
        }
        saveCustomerFromForm({ keepEditing: true, renderAfter: false, keepExtraSlots: true });
        const reader = new FileReader();
        reader.onload = () => {
          const customer = window.OSM.state.findById(window.OSM.data, "customers", selectedCustomerId);
          if (customer) {
            window.OSM.state.upsert(window.OSM.data, "customers", Object.assign({}, customer, { logoDataUrl: String(reader.result || "") }));
          }
          editingCustomerId = selectedCustomerId;
          window.OSM.render();
        };
        reader.readAsDataURL(file);
        event.target.value = "";
      }
    });

    document.addEventListener("dragover", (event) => {
      const zone = event.target.closest("[data-action='customer-drop-zone']");
      if (!zone) return;
      event.preventDefault();
      zone.classList.add("is-dragover");
    });

    document.addEventListener("dragleave", (event) => {
      const zone = event.target.closest("[data-action='customer-drop-zone']");
      if (!zone) return;
      zone.classList.remove("is-dragover");
    });

    document.addEventListener("drop", async (event) => {
      const zone = event.target.closest("[data-action='customer-drop-zone']");
      if (!zone) return;
      event.preventDefault();
      zone.classList.remove("is-dragover");
      const file = event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files[0];
      await processImportFile(file);
    });

    document.addEventListener("input", (event) => {
      if (event.target.dataset.action !== "customer-search") return;
      customerSearch = event.target.value;
      window.OSM.render();
      const input = document.querySelector("[data-action='customer-search']");
      if (input) input.focus();
    });
  }

  bindCustomerHandlers();

  window.OSM.registerModule({
    id: "customers",
    group: "Vertrieb & CRM",
    icon: "K",
    title: "Kunden",
    description: "Kundenakten mit Firma, Wichtigkeit, Kontakten, Logo und Historie.",
    collection: "customers",
    prefix: "cus",
    fields: [
      { key: "name", label: "Firmenname", required: true },
      { key: "industry", label: "Branche" },
      { key: "importance", label: "Wichtigkeit", type: "select", options: importanceOptions, default: "normal" },
      { key: "phone", label: "Telefon Firma" },
      { key: "country", label: "Land" },
      { key: "website", label: "Website" },
      { key: "status", label: "Status", type: "select", options: statusOptions, default: "lead" },
      { key: "notes", label: "Notizen", type: "textarea", wide: true }
    ],
    columns: [
      { key: "name", label: "Kunde" },
      { key: "industry", label: "Branche" },
      { key: "importance", label: "Wichtigkeit", render: (row, data, h) => h.badge(row.importance || "normal", importanceTone(row.importance)) },
      { key: "phone", label: "Telefon" },
      { key: "status", label: "Status", render: (row, data, h) => h.badge(row.status, h.toneForStatus(row.status)) }
    ],
    render(data, h) {
      const rows = (data.customers || [])
        .filter((row) => JSON.stringify(row).toLowerCase().includes(customerSearch.toLowerCase()))
        .sort((a, b) => importanceRank(a.importance) - importanceRank(b.importance) || clean(a.name).localeCompare(clean(b.name), "de"));
      const allCustomers = data.customers || [];
      if (!selectedCustomerId || !allCustomers.some((customer) => customer.id === selectedCustomerId)) {
        selectedCustomerId = rows[0] ? rows[0].id : "";
      }
      const selected = allCustomers.find((customer) => customer.id === selectedCustomerId);

      if (sessionStorage.getItem("osmCustomerImportFocus") === "1") {
        sessionStorage.removeItem("osmCustomerImportFocus");
        setTimeout(() => {
          const panel = document.querySelector(".customer-import-panel");
          if (!panel) return;
          panel.classList.add("is-highlighted");
          panel.scrollIntoView({ behavior: "smooth", block: "center" });
          setTimeout(() => panel.classList.remove("is-highlighted"), 1800);
        }, 0);
      }

      return `
        <div class="topbar">
          <div>
            <div class="breadcrumb">
              <a href="#dashboard">Hauptseite</a>
              <span>/</span>
              <a href="#area-sales">Vertrieb & CRM</a>
            </div>
            <h1 class="topbar__title">Kunden</h1>
            <p class="topbar__text">Kundenliste links, vollständige Kundenakte rechts: Firma, Kontakte, Logo, Notizen und Historie über Speichern.</p>
          </div>
          <div class="page-actions">
            <a class="button button--quiet" href="#area-sales">Zurück</a>
            <button class="button" type="button" data-action="customer-new">+ Neuer Kunde</button>
          </div>
        </div>
        ${renderImportPanel(h)}
        <div class="customer-workspace">
          <section class="customer-list-panel">
            <div class="customer-list-panel__head">
              <div>
                <span class="kicker">Übersicht</span>
                <h2>Kunden</h2>
              </div>
              <span class="small muted">${rows.length} Einträge</span>
            </div>
            <input class="search customer-search" data-action="customer-search" value="${h.escapeHtml(customerSearch)}" placeholder="Kunden suchen..." />
            ${renderCustomerList(rows, selected, h)}
          </section>
          ${renderSelectedCustomer(selected, data, h)}
        </div>
      `;
    }
  });
})();
