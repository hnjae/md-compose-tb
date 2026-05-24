# Thunderbird Compose PoC

This is a minimal Thunderbird MailExtension for validating whether `browser.compose.onBeforeSend` can replace a compose body with controlled HTML plus a controlled plain-text fallback immediately before send.

The current default mode is `sentinel`. It deliberately returns different hard-coded HTML and plain-text bodies so the final MIME message can show whether Thunderbird preserves `plainTextBody` or regenerates the plain part from HTML.

## Load Temporarily

1. Open Thunderbird.
2. Open Add-ons Manager.
3. Open the debug add-on loading page from the add-on manager tools menu.
4. Select `experiments/thunderbird-compose-poc/manifest.json`.

## Package For Install From File

`Install Add-on From File...` expects an XPI package, not `manifest.json` directly. Create a temporary XPI from the files inside the PoC directory:

```sh
cd experiments/thunderbird-compose-poc
zip -r -X /tmp/thunderbird-compose-poc.xpi manifest.json background.js
```

Then select `/tmp/thunderbird-compose-poc.xpi` from `Install Add-on From File...`.

## Sentinel Test Body

The compose body can contain any short text. The extension ignores it for the final output while `POC_MODE` is `sentinel`.

Send the message to a test mailbox and inspect the received message source. The PoC logs the compose type, plain-text state, source length, response HTML length, and response plain-text length to the extension console.

## Expected Sentinel Check

- HTML compose should call `onBeforeSend`.
- The sent HTML body should contain `HTML_SENTINEL`.
- The sent HTML body should contain a `data-md-compose-poc="true"` wrapper.
- The sent plain-text body should contain `PLAIN_SENTINEL_7f3a` if Thunderbird preserves the returned `plainTextBody`.
- The sent plain-text body should contain `# SHOULD_SURVIVE`, `**BOLD_MARKER**`, and `- LIST_MARKER` verbatim if Thunderbird preserves Markdown-like marker text in the returned `plainTextBody`.
- If the plain-text body contains only `HTML_SENTINEL` or `HTML body only`, Thunderbird probably regenerated the plain part from `body` instead of preserving `plainTextBody`.
- `deliveryFormat: "both"` should request HTML and plain-text delivery for HTML compose messages.

## Markdown Source Test Body

Set `POC_MODE` in `background.js` to `markdown-source` to retest source extraction and Markdown rendering:

```markdown
# Markdown compose PoC

This should become **HTML**.

- First item
- Second item

Plain fallback should keep this Markdown source.
```

## Expected Markdown Source Check

- HTML compose should call `onBeforeSend`.
- The sent HTML body should contain a `data-md-compose-poc="true"` wrapper.
- The plain-text body should keep the original Markdown source.
- `deliveryFormat: "both"` should request HTML and plain-text delivery for HTML compose messages.

Plain-text compose behavior is intentionally part of the experiment. Thunderbird documents `deliveryFormat` as ignored on plain-text messages, so record the actual behavior in `docs/research/thunderbird-compose-send-pipeline.md`.
