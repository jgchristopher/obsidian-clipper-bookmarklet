import TurndownService from 'turndown';

(() => {
  const markdownService = new TurndownService({
    headingStyle: 'atx',
    hr: '---',
    bulletListMarker: '-',
    codeBlockStyle: 'fenced',
    emDelimiter: '*',
  });

  function convertDate(date) {
    let dateString = '';

    function padLeftZero(value) {
      console.log(value)
      let arr = value.split('');
      return (arr[1] ? value : "0" + arr[0])
    }
    
    if (date) {
      let year = date.getFullYear().toString();
      let mm = padLeftZero((date.getMonth() + 1).toString());
      let dd = padLeftZero(date.getDate().toString());
      dateString = `${year}-${mm}-${dd}`;
    }
    return dateString;
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

  function sendToObsidian(content, heading, vault) {
    let data = encodeURIComponent(content);
    let header = encodeURIComponent(heading);

    // This uses the built in obsidian url support
    // let defaultUrl =  `obsidian://new?file=${encodeURIComponent(daily_notes + convertDate(new Date()))}&content=${encodeURIComponent(content)}&append=true&vault=${vaultName}`;
    //document.location.href = defaultUrl;

    // This requires the advanced-uri plugin to be installed
    let url = `obsidian://advanced-uri?vault=${vault}&daily=true&heading=${header}&data=${data}&mode=prepend`;
    document.location.href = url;
  }

  const vaultName = encodeURIComponent("Personal");
  const daily_notes = "daily_notes/";
  const heading = "Daily Log";
  const tags = "#bookmark-clipper";
  const content = `- [${document.title}](${document.URL}) ${tags}\n${markdownService.turndown(getSelectionHtml())}\n\n---\n\n`
  sendToObsidian(content, heading, vaultName);
})();
