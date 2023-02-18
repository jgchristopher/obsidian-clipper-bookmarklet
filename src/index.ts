import TurndownService from "turndown";
import { MarkdownTables } from "./tables";
((vault: string) => {
  const vaultName = encodeURIComponent(vault);
  const markdownService = new TurndownService({
    headingStyle: "atx",
    hr: "---",
    bulletListMarker: "-",
    codeBlockStyle: "fenced",
    emDelimiter: "*",
  });
  let tables = new MarkdownTables();
  markdownService.use(tables.tables);
  markdownService.addRule("heading_1_to_2", {
    filter: ["h1"],
    replacement: function (content) {
      console.log("Moving H1 to H2 Markdown");
      return `## ${content}`;
    },
  });

  function getSelectionHtml(): string {
    let html = "";
    if (typeof window.getSelection != "undefined") {
      let sel = window.getSelection();
      if (sel && sel.rangeCount) {
        let container = document.createElement("div");
        for (let i = 0, len = sel.rangeCount; i < len; ++i) {
          container.appendChild(sel.getRangeAt(i).cloneContents());
        }
        html = container.innerHTML;
      }
    }
    return html;
  }

  function sendToObsidian(url: string, title: string, content: string): void {
    // This requires the advanced-uri plugin to be installed
    const obsidianUrl = `obsidian://obsidian-clipper?vault=${vaultName}&url=${encodeURIComponent(
      url
    )}&title=${encodeURIComponent(title)}&highlightdata=${encodeURIComponent(
      content
    )}`;

    document.location.href = obsidianUrl;
  }

  sendToObsidian(
    document.URL,
    document.title,
    markdownService.turndown(getSelectionHtml())
  );
})("~VaultNameFiller~");
