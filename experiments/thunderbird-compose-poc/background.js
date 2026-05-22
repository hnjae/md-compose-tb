// SPDX-FileCopyrightText: 2026 KIM Hyunjae
// SPDX-License-Identifier: AGPL-3.0-or-later

const BLOCK_ELEMENTS = new Set([
	"ADDRESS",
	"ARTICLE",
	"ASIDE",
	"BLOCKQUOTE",
	"DIV",
	"DL",
	"FIELDSET",
	"FIGCAPTION",
	"FIGURE",
	"FOOTER",
	"FORM",
	"H1",
	"H2",
	"H3",
	"H4",
	"H5",
	"H6",
	"HEADER",
	"HR",
	"LI",
	"MAIN",
	"NAV",
	"OL",
	"P",
	"PRE",
	"SECTION",
	"TABLE",
	"UL",
]);

browser.compose.onBeforeSend.addListener(async (_tab, details) => {
	try {
		const source = getMarkdownSource(details);
		const html = renderMarkdown(source);

		console.log("md-compose-tb PoC onBeforeSend", {
			type: details.type,
			isPlainText: details.isPlainText,
			sourceField:
				typeof details.plainTextBody === "string" ? "plainTextBody" : "body",
			sourceLength: source.length,
			htmlLength: html.length,
		});

		return {
			details: {
				body: html,
				plainTextBody: source,
				deliveryFormat: "both",
			},
		};
	} catch (error) {
		console.error("md-compose-tb PoC failed before send", error);
		return { cancel: true };
	}
});

function getMarkdownSource(details) {
	if (
		typeof details.plainTextBody === "string" &&
		details.plainTextBody.trim() !== ""
	) {
		return normalizeLineEndings(details.plainTextBody);
	}

	if (typeof details.body === "string") {
		return normalizeLineEndings(htmlToText(details.body));
	}

	return "";
}

function htmlToText(html) {
	const document = new DOMParser().parseFromString(html, "text/html");
	const chunks = [];

	appendNodeText(document.body, chunks);

	return chunks
		.join("")
		.replace(/[ \t]+\n/g, "\n")
		.replace(/\n{3,}/g, "\n\n")
		.trim();
}

function appendNodeText(node, chunks) {
	if (node.nodeType === Node.TEXT_NODE) {
		chunks.push(node.nodeValue);
		return;
	}

	if (
		node.nodeType !== Node.ELEMENT_NODE &&
		node.nodeType !== Node.DOCUMENT_FRAGMENT_NODE
	) {
		return;
	}

	const tagName = node.tagName;

	if (tagName === "BR") {
		chunks.push("\n");
		return;
	}

	if (
		BLOCK_ELEMENTS.has(tagName) &&
		chunks.length > 0 &&
		!lastChunkEndsWithNewline(chunks)
	) {
		chunks.push("\n");
	}

	for (const child of node.childNodes) {
		appendNodeText(child, chunks);
	}

	if (BLOCK_ELEMENTS.has(tagName) && !lastChunkEndsWithNewline(chunks)) {
		chunks.push("\n");
	}
}

function lastChunkEndsWithNewline(chunks) {
	const lastChunk = chunks[chunks.length - 1] ?? "";
	return lastChunk.endsWith("\n");
}

function normalizeLineEndings(value) {
	return value.replace(/\r\n?/g, "\n").trim();
}

function renderMarkdown(source) {
	const blocks = source.split(/\n{2,}/);
	const renderedBlocks = blocks.map(renderBlock).filter(Boolean).join("\n");

	return [
		'<div data-md-compose-poc="true" style="font-family: system-ui, sans-serif; line-height: 1.5;">',
		renderedBlocks,
		"</div>",
	].join("\n");
}

function renderBlock(block) {
	const lines = block.split("\n");
	const firstLine = lines[0] ?? "";
	const heading = /^(#{1,6})\s+(.+)$/.exec(firstLine);

	if (heading && lines.length === 1) {
		const level = heading[1].length;
		return `<h${level}>${renderInline(heading[2])}</h${level}>`;
	}

	if (lines.every((line) => /^-\s+/.test(line))) {
		const items = lines
			.map((line) => line.replace(/^-\s+/, ""))
			.map((line) => `<li>${renderInline(line)}</li>`)
			.join("");
		return `<ul>${items}</ul>`;
	}

	const paragraph = lines.map(renderInline).join("<br>");
	return `<p>${paragraph}</p>`;
}

function renderInline(value) {
	return escapeHtml(value)
		.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
		.replace(/`([^`]+)`/g, "<code>$1</code>");
}

function escapeHtml(value) {
	return value
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;");
}
