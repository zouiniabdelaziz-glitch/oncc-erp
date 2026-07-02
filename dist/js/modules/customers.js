(function () {
  let customerSearch = "";
  let importMessage = "";

  const statusOptions = [
    { value: "lead", label: "Lead" },
    { value: "aktiv", label: "Aktiv" },
    { value: "ruhend", label: "Ruhend" },
    { value: "intern", label: "Intern" }
  ];

  const aliases = {
    name: ["name", "firma", "firmenname", "unternehmen", "kunde", "customer", "company", "companyname", "azienda", "ragionesociale"],
    country: ["land", "country", "staat", "paese", "nazione"],
    industry: ["branche", "industry", "sektor", "sector", "settore", "bereich"],
    status: ["status", "zustand", "phase"],
    notes: ["notiz", "notizen", "notes", "bemerkung", "bemerkungen", "kommentar", "beschreibung", "description", "website", "webseite", "email", "e-mail", "mail", "telefon", "phone", "ansprechpartner"]
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

  function rowsToCustomers(rows, fileName) {
    if (rows.length < 2) return [];
    const headers = rows[0].map(clean);
    const indexes = {
      name: findColumn(headers, "name"),
      country: findColumn(headers, "country"),
      industry: findColumn(headers, "industry"),
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
      const status = clean(row[indexes.status]).toLowerCase();
      const allowedStatus = ["lead", "aktiv", "ruhend", "intern"].includes(status) ? status : "lead";
      const notes = [
        clean(row[indexes.notes]),
        unknownNotes.join(" | "),
        `Import: ${fileName}`
      ].filter(Boolean).join("\n");

      return {
        name: clean(row[indexes.name]),
        country: indexes.country >= 0 ? clean(row[indexes.country]) : "",
        industry: indexes.industry >= 0 ? clean(row[indexes.industry]) : "",
        status: allowedStatus,
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
        ["country", "industry", "status", "notes"].forEach((key) => {
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
      <section class="customer-import-panel">
        <div class="customer-import-panel__text">
          <span class="kicker">Import</span>
          <h2>Kunden aus Excel oder CSV importieren</h2>
          <p>Ziehe eine Datei hierher oder wähle sie aus. Unterstützt werden XLSX, CSV, TSV und TXT. Alte XLS-Dateien bitte vorher in Excel als XLSX speichern.</p>
          <div class="import-chips">
            <span>Firma</span>
            <span>Firmenname</span>
            <span>Kunde</span>
            <span>Company</span>
            <span>Land</span>
            <span>Branche</span>
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

  function renderCustomersTable(rows, h) {
    if (!rows.length) return `<div class="empty">Keine Kunden gefunden.</div>`;
    return `
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Kunde</th>
              <th>Land</th>
              <th>Branche</th>
              <th>Status</th>
              <th>Notiz</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            ${rows.map((row) => `
              <tr>
                <td>${h.escapeHtml(row.name)}</td>
                <td>${h.escapeHtml(row.country || "-")}</td>
                <td>${h.escapeHtml(row.industry || "-")}</td>
                <td>${h.badge(row.status, h.toneForStatus(row.status))}</td>
                <td>${h.escapeHtml(h.displayText(row.notes || ""))}</td>
                <td>
                  <div class="row-actions">
                    <button class="icon-button" data-action="edit" data-module="customers" data-id="${h.escapeHtml(row.id)}">Bearbeiten</button>
                    <button class="icon-button icon-button--danger" data-action="delete" data-module="customers" data-id="${h.escapeHtml(row.id)}">Löschen</button>
                  </div>
                </td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    `;
  }

  function bindImportHandlers() {
    if (window.OSM_CUSTOMER_IMPORT_BOUND) return;
    window.OSM_CUSTOMER_IMPORT_BOUND = true;

    document.addEventListener("click", (event) => {
      const button = event.target.closest("[data-action='customer-import']");
      if (!button) return;
      const input = document.querySelector("[data-action='customer-import-file']");
      if (input) input.click();
    });

    document.addEventListener("change", async (event) => {
      if (event.target.dataset.action !== "customer-import-file") return;
      const file = event.target.files && event.target.files[0];
      await processImportFile(file);
      event.target.value = "";
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

  bindImportHandlers();

  window.OSM.registerModule({
    id: "customers",
    group: "Vertrieb & CRM",
    icon: "K",
    title: "Kunden",
    description: "Firmen, Zielkunden und interne Organisationen.",
    collection: "customers",
    prefix: "cus",
    fields: [
      { key: "name", label: "Firmenname", required: true },
      { key: "country", label: "Land" },
      { key: "industry", label: "Branche" },
      { key: "status", label: "Status", type: "select", options: statusOptions, default: "lead" },
      { key: "notes", label: "Notizen", type: "textarea", wide: true }
    ],
    columns: [
      { key: "name", label: "Kunde" },
      { key: "country", label: "Land" },
      { key: "industry", label: "Branche" },
      { key: "status", label: "Status", render: (row, data, h) => h.badge(row.status, h.toneForStatus(row.status)) },
      { key: "notes", label: "Notiz" }
    ],
    render(data, h) {
      const rows = (data.customers || []).filter((row) =>
        JSON.stringify(row).toLowerCase().includes(customerSearch.toLowerCase())
      );
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
            <p class="topbar__text">Firmen, Zielkunden und interne Organisationen. Import für Excel/CSV ist direkt hier.</p>
          </div>
          <div class="page-actions">
            <a class="button button--quiet" href="#area-sales">Zurück</a>
            <button class="button" data-action="add" data-module="customers">+ Neu</button>
          </div>
        </div>
        ${renderImportPanel(h)}
        <div class="toolbar">
          <input class="search" data-action="customer-search" value="${h.escapeHtml(customerSearch)}" placeholder="Kunden suchen..." />
          <div class="muted small">${rows.length} Einträge</div>
        </div>
        <section class="panel">
          ${renderCustomersTable(rows, h)}
        </section>
      `;
    }
  });
})();
