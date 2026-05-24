# Thunderbird Compose PoC

This is a minimal Thunderbird MailExtension for validating whether `browser.compose.onBeforeSend` can replace a Markdown compose body with HTML plus a plain-text fallback immediately before send.

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

## Test Body

```markdown
# Markdown compose PoC

This should become **HTML**.

- First item
- Second item

Plain fallback should keep this Markdown source.
```

Send the message to a test mailbox and inspect the received message source. The PoC logs the compose type, plain-text state, source length, and rendered HTML length to the extension console.

## Expected Check

- HTML compose should call `onBeforeSend`.
- The sent HTML body should contain a `data-md-compose-poc="true"` wrapper.
- The plain-text body should keep the original Markdown source.
- `deliveryFormat: "both"` should request HTML and plain-text delivery for HTML compose messages.

Plain-text compose behavior is intentionally part of the experiment. Thunderbird documents `deliveryFormat` as ignored on plain-text messages, so record the actual behavior in `docs/research/thunderbird-compose-send-pipeline.md`.
