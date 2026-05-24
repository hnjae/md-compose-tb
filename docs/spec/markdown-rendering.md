---
updated: 2026-05-24
---

# Markdown Rendering Specification

## Summary

The extension interprets message source text as GitHub Flavored Markdown (GFM) and sends the generated message as email-safe HTML. GFM is treated as the product Markdown dialect because it is a strict superset of CommonMark and includes widely expected extensions such as tables, strikethrough, autolinks, and task lists.

## User-Visible Behavior

- Markdown input is parsed as GFM.
- Rendered HTML is constrained by the extension's email-safe HTML policy and may differ from GitHub's web rendering.
- Raw HTML in Markdown input is not part of the initial supported behavior and must not bypass the email-safe HTML policy.
- Generated links must not preserve unsafe URL protocols.
- Generated images, task list controls, tables, and other GFM-derived output may be restricted or normalized when required for email safety and Thunderbird compatibility.
- Fenced code blocks with a recognized language may receive static syntax highlighting.
- Syntax highlighting uses class-based token markup. Highlight colors are best-effort because recipient email clients may remove or ignore CSS, but highlighted code blocks must remain readable as ordinary preformatted text without token CSS.
- The extension generates HTML output before Thunderbird sends the message.
- When Thunderbird supports multipart HTML/plain-text delivery for the current compose context, the extension should request both rendered HTML and plain-text delivery.
- The extension does not currently guarantee that the `text/plain` MIME part preserves the original Markdown source. In Thunderbird 140.10.2esr on Linux via Flathub, a PoC showed that HTML body replacement and multipart delivery worked, but the final `text/plain` part was derived or normalized by Thunderbird rather than preserving the returned Markdown source verbatim.
- Exact Markdown-source fallback in `text/plain` is unsupported unless a future implementation proves a non-hacky Thunderbird public API path for preserving it.

## Compatibility Scope

The extension targets predictable email output rather than pixel-identical GitHub rendering. Syntax support follows GFM, while final HTML is governed by the extension's sanitizer, URL policy, and email compatibility constraints.

## References

- GitHub Flavored Markdown Specification: <https://github.github.com/gfm/>
