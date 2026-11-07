/**
 * Tech Faculty class video access (Google Apps Script web app).
 *
 * Deploy in the Tech Faculty Google account that owns (or can share) the class
 * videos. The website calls it with a shared secret to add ONE student's email
 * as a Viewer on the Drive files of the classes they have reached. Videos and
 * folders stay "Restricted"; nobody is given a folder.
 *
 * Setup (once):
 *   1. script.google.com > New project > paste this file and appsscript.json.
 *   2. Project Settings > Script properties: SECRET = a long random string.
 *   3. Deploy > New deployment > Web app: Execute as "Me", Who has access
 *      "Anyone". Copy the /exec URL.
 *   4. Website secrets: DRIVE_SHARE_URL = that URL, DRIVE_SHARE_SECRET = SECRET.
 *
 * Actions (POST JSON body, text/plain):
 *   { secret, action: "grant", email, fileIds: [...], label }
 *   { secret, action: "migrateFolder", folderId, keep: [staff emails], dryRun }
 *     Moves students off a shared folder without losing anything: each person
 *     the folder is shared with (except owner and `keep`) gets Viewer on every
 *     file already in the folder, then is removed from the folder. New uploads
 *     after that reach students only through the website, one class at a time.
 * Every grant/removal is logged to a "Class video access log" sheet.
 *
 * Auto-attach new uploads (watchFolders, run hourly by a time trigger):
 *   Script properties SITE_INGEST_URL = https://techfaculty.ng/api/class-videos/ingest,
 *   optional WATCH_FOLDERS = comma-separated folder IDs (Dave's first two
 *   folders), optional TUTOR_SHEET = spreadsheet ID holding the "Tutor folders"
 *   tab (defaults to the class video catalogue sheet).
 *   Run setupWatcher() once from the editor. Each new video named like
 *   month1week3day2_topic.mp4 is sent to the website, which attaches it to the
 *   right class; students get it when they reach that class.
 *
 * Adding a tutor (no code change): the tutor shares their class folder with
 *   this account as Editor, then add a row to the "Tutor folders" tab:
 *   Folder link | Website course name (exactly as on the site) | Tutor | (leave blank).
 *   On the next hourly run every video already in that folder (and its
 *   subfolders) is attached, the 4th column is stamped, and later uploads are
 *   attached as they arrive.
 */

function doPost(e) {
  var out;
  try {
    var body = JSON.parse((e && e.postData && e.postData.contents) || "{}");
    var secret = PropertiesService.getScriptProperties().getProperty("SECRET");
    if (!secret || body.secret !== secret) throw new Error("unauthorised");
    if (body.action === "grant") out = grant_(body);
    else if (body.action === "migrateFolder") out = migrateFolder_(body);
    else throw new Error("unknown action");
    out.ok = true;
  } catch (err) {
    out = { ok: false, error: String((err && err.message) || err) };
  }
  return ContentService.createTextOutput(JSON.stringify(out)).setMimeType(
    ContentService.MimeType.JSON
  );
}

function grant_(body) {
  var email = String(body.email || "").trim().toLowerCase();
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) throw new Error("bad email");
  var ids = (body.fileIds || []).filter(function (id) {
    return /^[A-Za-z0-9_-]{10,}$/.test(id);
  });
  if (!ids.length || ids.length > 50) throw new Error("bad fileIds");
  var granted = 0;
  var failed = [];
  ids.forEach(function (id) {
    try {
      addViewer_(id, email);
      granted++;
      log_("grant", email, id, body.label || "");
    } catch (err) {
      failed.push(id + ": " + err.message);
      log_("grant failed", email, id, err.message);
    }
  });
  return { granted: granted, failed: failed };
}

/** Viewer on one file, no email for Google accounts (Drive must email others). */
function addViewer_(fileId, email) {
  var perm = { role: "reader", type: "user", emailAddress: email };
  try {
    Drive.Permissions.create(perm, fileId, {
      sendNotificationEmail: false,
      supportsAllDrives: true,
    });
  } catch (err) {
    // Non-Google emails can only be invited with a notification.
    Drive.Permissions.create(perm, fileId, {
      sendNotificationEmail: true,
      emailMessage:
        "Your Tech Faculty class video. Sign in with this email to watch it.",
      supportsAllDrives: true,
    });
  }
}

function migrateFolder_(body) {
  var folder = DriveApp.getFolderById(body.folderId);
  var keep = (body.keep || []).map(function (k) {
    return String(k).toLowerCase();
  });
  var owner = folder.getOwner() ? folder.getOwner().getEmail().toLowerCase() : "";
  keep.push(owner, Session.getEffectiveUser().getEmail().toLowerCase());

  var people = folder
    .getViewers()
    .concat(folder.getEditors())
    .map(function (u) {
      return u.getEmail().toLowerCase();
    })
    .filter(function (em, i, a) {
      return em && a.indexOf(em) === i && keep.indexOf(em) < 0;
    });

  var files = [];
  var walk = function (f) {
    var it = f.getFiles();
    while (it.hasNext()) files.push(it.next());
    var sub = f.getFolders();
    while (sub.hasNext()) walk(sub.next());
  };
  walk(folder);

  if (body.dryRun) {
    return {
      folder: folder.getName(),
      students: people,
      files: files.map(function (f) {
        return f.getName();
      }),
    };
  }
  // Remove the folder access FIRST, then add each file. While the folder
  // access exists Drive treats a file grant as already covered and drops it
  // when the folder access is removed.
  people.forEach(function (em) {
    try {
      folder.removeViewer(em);
    } catch (e1) {}
    try {
      folder.removeEditor(em);
    } catch (e2) {}
    log_("removed from folder", em, folder.getId(), folder.getName());
    files.forEach(function (f) {
      try {
        addViewer_(f.getId(), em);
        log_("grant", em, f.getId(), f.getName());
      } catch (err) {
        log_("migrate grant failed", em, f.getId(), err.message);
      }
    });
  });
  return { folder: folder.getName(), students: people, filesKept: files.length };
}

function log_(what, email, id, note) {
  var props = PropertiesService.getScriptProperties();
  var sheetId = props.getProperty("LOG_SHEET");
  var ss;
  if (sheetId) {
    ss = SpreadsheetApp.openById(sheetId);
  } else {
    ss = SpreadsheetApp.create("Class video access log");
    ss.getSheets()[0].appendRow(["When", "What", "Email", "File/folder", "Note"]);
    props.setProperty("LOG_SHEET", ss.getId());
  }
  ss.getSheets()[0].appendRow([new Date(), what, email, id, note]);
}

/** Run once from the editor: hourly trigger for watchFolders. */
function setupWatcher() {
  ScriptApp.getProjectTriggers().forEach(function (t) {
    if (t.getHandlerFunction() === "watchFolders") ScriptApp.deleteTrigger(t);
  });
  ScriptApp.newTrigger("watchFolders").timeBased().everyHours(1).create();
  PropertiesService.getScriptProperties().setProperty("LAST_WATCH", String(Date.now()));
}

var CATALOGUE_SHEET = "1PzAU1zgJW-K8A0c2kEZS_QYFp_PJuRZce26mewAHA-Q";
var TUTOR_TAB = "Tutor folders";

function folderId_(v) {
  v = String(v || "").trim();
  var m = v.match(/\/folders\/([A-Za-z0-9_-]{10,})/) || v.match(/[?&]id=([A-Za-z0-9_-]{10,})/);
  if (m) return m[1];
  return /^[A-Za-z0-9_-]{10,}$/.test(v) ? v : "";
}

/** The "Tutor folders" tab (created with a header row if missing). */
function tutorTab_() {
  var id = PropertiesService.getScriptProperties().getProperty("TUTOR_SHEET") || CATALOGUE_SHEET;
  var ss = SpreadsheetApp.openById(id);
  var tab = ss.getSheetByName(TUTOR_TAB);
  if (!tab) {
    tab = ss.insertSheet(TUTOR_TAB);
    tab.appendRow(["Folder link", "Website course name", "Tutor", "Attached since (filled by script)"]);
    tab.setFrozenRows(1);
  }
  return tab;
}

/** Every file in a folder and its subfolders (3 levels). */
function filesIn_(folder, depth, out) {
  var it = folder.getFiles();
  while (it.hasNext()) out.push(it.next());
  if (depth <= 0) return out;
  var subs = folder.getFolders();
  while (subs.hasNext()) filesIn_(subs.next(), depth - 1, out);
  return out;
}

/** Sends each new video in every watched folder to the website to attach. */
function watchFolders() {
  var lock = LockService.getScriptLock();
  if (!lock.tryLock(1000)) return;
  try {
    var props = PropertiesService.getScriptProperties();
    var url = props.getProperty("SITE_INGEST_URL");
    var secret = props.getProperty("SECRET");
    var since = Number(props.getProperty("LAST_WATCH") || Date.now());
    var now = Date.now();
    if (!url || !secret) return;

    // [{ id, course, row, all }] from WATCH_FOLDERS and the Tutor folders tab.
    var watch = [];
    var seen = {};
    String(props.getProperty("WATCH_FOLDERS") || "").split(",").forEach(function (v) {
      var id = folderId_(v);
      if (id && !seen[id]) { seen[id] = true; watch.push({ id: id, course: "", row: 0, all: false }); }
    });
    var tab = tutorTab_();
    var rows = tab.getLastRow() > 1 ? tab.getRange(2, 1, tab.getLastRow() - 1, 4).getValues() : [];
    rows.forEach(function (r, i) {
      var id = folderId_(r[0]);
      if (!id) return;
      var course = String(r[1] || "").trim();
      var fresh = !String(r[3] || "").trim();
      if (seen[id]) {
        watch.forEach(function (w) { if (w.id === id) { w.course = course; w.row = i + 2; w.all = fresh; } });
        return;
      }
      seen[id] = true;
      watch.push({ id: id, course: course, row: i + 2, all: fresh });
    });

    watch.forEach(function (w) {
      var all;
      try {
        all = filesIn_(DriveApp.getFolderById(w.id), 3, []);
      } catch (err) {
        log_("auto-attach", "", w.id, "cannot open folder (share it with this account as Editor): " + err.message);
        if (w.row) tab.getRange(w.row, 4).setValue("Cannot open folder: share it with this account as Editor");
        return;
      }
      var siblings = all.map(function (f) { return { fileId: f.getId(), name: f.getName() }; }).slice(0, 300);
      var sent = 0;
      all.forEach(function (f) {
        if (!w.all && f.getDateCreated().getTime() <= since) return;
        if (String(f.getMimeType()).indexOf("video/") !== 0) return;
        var res = UrlFetchApp.fetch(url, {
          method: "post",
          contentType: "application/json",
          headers: { "x-drive-share-secret": secret },
          payload: JSON.stringify({ fileId: f.getId(), name: f.getName(), course: w.course, siblings: siblings }),
          muteHttpExceptions: true,
        });
        sent++;
        log_("auto-attach", "", f.getId(), f.getName() + " -> " + res.getContentText().slice(0, 200));
      });
      if (w.row && w.all) tab.getRange(w.row, 4).setValue(new Date() + " (" + sent + " videos sent)");
    });
    props.setProperty("LAST_WATCH", String(now));
  } finally {
    lock.releaseLock();
  }
}
