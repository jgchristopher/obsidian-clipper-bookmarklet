import TurndownService from 'turndown';

(() => {
  /* Optional vault name */
  const vault = "";
  const daily_notes = "daily_notes/";
  /* Optional tags  */
  const tags = "#bookmark-clipper";

  function convertDate(date) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}-${month}-${day}`;
  }

  function getSelectionHtml() {
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

  const selection = getSelectionHtml();
  const markdownify = selection ? selection : "";
  const vaultName = vault ? `&vault=${encodeURIComponent(vault)}` : '';
  const today = convertDate(new Date());
  const sendToObsidian = (content) => {
    document.location.href = `obsidian://new?file=${encodeURIComponent(daily_notes + today)}&content=${encodeURIComponent(content)}&append=true${vaultName}`;
  }
  const markdownBody = new TurndownService({
    headingStyle: 'atx',
    hr: '---',
    bulletListMarker: '-',
    codeBlockStyle: 'fenced',
    emDelimiter: '*',
  }).turndown(markdownify);
  sendToObsidian(`- [${document.title}](${document.URL}) ${tags}\n${markdownBody}\n\n---\n\n`);
})();
