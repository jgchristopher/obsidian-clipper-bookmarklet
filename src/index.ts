import TurndownService from "turndown";
import { MarkdownTables } from "./tables";
(() => {
  const useAdvancedUri = true;
  const vaultName = encodeURIComponent("Personal");
  const daily_notes = "daily_notes/";
  const heading = "Daily Log";
  const tags = "#bookmark-clipper";

  const markdownService = new TurndownService({
    headingStyle: "atx",
    hr: "---",
    bulletListMarker: "-",
    codeBlockStyle: "fenced",
    emDelimiter: "*",
  });
  let tables = new MarkdownTables();
  markdownService.use(tables.tables);

  function convertDate(date: Date): string {
    let dateString = "";

    function padLeftZero(value: string): string {
      let arr = value.split("");
      return arr[1] ? value : "0" + arr[0];
    }

    if (date) {
      let year = date.getFullYear().toString();
      let mm = padLeftZero((date.getMonth() + 1).toString());
      let dd = padLeftZero(date.getDate().toString());
      dateString = `${year}-${mm}-${dd}`;
    }
    return dateString;
  }

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

  function sendToObsidian(
    content: string,
    heading: string,
    vault: string
  ): void {
    let data = encodeURIComponent(content);
    let header = encodeURIComponent(heading);
    let url: string;

    if (useAdvancedUri) {
      // This requires the advanced-uri plugin to be installed
      url = `obsidian://advanced-uri?vault=${encodeURIComponent(
        vault
      )}&daily=true&heading=${encodeURIComponent(
        header
      )}&data=${encodeURIComponent(data)}&mode=prepend`;
    } else {
      // This uses the built in obsidian url support
      url = `obsidian://new?file=${encodeURIComponent(
        daily_notes + convertDate(new Date())
      )}&content=${data}&append=true&vault=${vaultName}`;
    }

    document.location.href = url;
  }

  const content = `- [${document.title}](${
    document.URL
  }) ${tags}\n${markdownService.turndown(getSelectionHtml())}\n\n---\n\n`;
  sendToObsidian(content, heading, vaultName);
})();
