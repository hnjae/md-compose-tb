// SPDX-FileCopyrightText: 2026 KIM Hyunjae
// SPDX-License-Identifier: AGPL-3.0-or-later

browser.runtime.onInstalled.addListener((details) => {
  console.info("md-compose-tb installed", { reason: details.reason });
});
