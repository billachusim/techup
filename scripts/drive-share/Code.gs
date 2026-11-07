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
  people.forEach(function (em) {
    files.forEach(function (f) {
      try {
        addViewer_(f.getId(), em);
      } catch (err) {
        log_("migrate grant failed", em, f.getId(), err.message);
      }
    });
    try {
      folder.removeViewer(em);
    } catch (e1) {}
    try {
      folder.removeEditor(em);
    } catch (e2) {}
    log_("removed from folder", em, folder.getId(), folder.getName());
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
