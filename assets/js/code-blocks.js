(() => {
  const languageNames = {
    bash: "SHELL",
    sh: "SHELL",
    shell: "SHELL",
    console: "CONSOLE",
    gitconfig: "GIT CONFIG",
    vim: "VIM",
    vimconfig: "VIM",
    batch: "BATCH",
    bat: "BATCH",
    dos: "BATCH",
    plaintext: "TEXT",
    text: "TEXT"
  };

  const copyWithSelection = (text) => {
    const activeElement = document.activeElement;
    const selection = window.getSelection();
    const ranges = selection
      ? Array.from({ length: selection.rangeCount }, (_, index) => selection.getRangeAt(index).cloneRange())
      : [];
    const buffer = document.createElement("textarea");
    buffer.value = text;
    buffer.className = "clipboard-buffer";
    buffer.setAttribute("readonly", "");
    document.body.append(buffer);
    buffer.select();
    let copied = false;
    try {
      copied = document.execCommand("copy");
    } catch {
      copied = false;
    } finally {
      buffer.remove();
      if (activeElement instanceof HTMLElement) activeElement.focus({ preventScroll: true });
      if (selection) {
        selection.removeAllRanges();
        ranges.forEach((range) => selection.addRange(range));
      }
    }
    return copied;
  };

  document.querySelectorAll(".post-content pre").forEach((pre) => {
    const code = pre.querySelector("code");
    if (!code || pre.closest(".code-block")) return;

    const sourceText = code.textContent;
    const languageElement = code.closest('[class*="language-"]');
    const languageClass = languageElement
      ? Array.from(languageElement.classList).find((name) => name.startsWith("language-"))
      : null;
    const language = languageClass ? languageClass.slice(9) : code.dataset.lang || "text";
    const highlighted = pre.closest(".highlighter-rouge, figure.highlight");
    const target = highlighted || pre;
    const block = document.createElement("div");
    block.className = "code-block";
    const toolbar = document.createElement("div");
    toolbar.className = "code-toolbar";
    const label = document.createElement("span");
    label.className = "code-language";
    label.textContent = languageNames[language.toLowerCase()] || language.toUpperCase();
    const actions = document.createElement("div");
    actions.className = "code-actions";
    const wrapButton = document.createElement("button");
    wrapButton.type = "button";
    wrapButton.textContent = "줄바꿈";
    wrapButton.setAttribute("aria-label", "코드 자동 줄바꿈");
    wrapButton.setAttribute("aria-pressed", "false");
    wrapButton.addEventListener("click", () => {
      const enabled = block.classList.toggle("is-wrapped");
      wrapButton.setAttribute("aria-pressed", String(enabled));
    });
    const copyButton = document.createElement("button");
    copyButton.type = "button";
    copyButton.textContent = "복사";
    copyButton.setAttribute("aria-label", "코드 복사");
    const status = document.createElement("span");
    status.className = "sr-only";
    status.setAttribute("role", "status");
    let resetTimer;
    copyButton.addEventListener("click", async () => {
      copyButton.disabled = true;
      let copied = false;
      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(sourceText);
          copied = true;
        }
      } catch {
        copied = false;
      }
      if (!copied) copied = copyWithSelection(sourceText);
      if (!copied) {
        const range = document.createRange();
        range.selectNodeContents(code);
        const selection = window.getSelection();
        if (selection) {
          selection.removeAllRanges();
          selection.addRange(range);
        }
      }
      clearTimeout(resetTimer);
      copyButton.textContent = copied ? "복사됨" : "선택됨";
      status.textContent = copied ? "코드를 복사했습니다." : "코드를 선택했습니다. 복사 단축키를 사용해 주세요.";
      copyButton.disabled = false;
      resetTimer = setTimeout(() => {
        copyButton.textContent = "복사";
        status.textContent = "";
      }, 2000);
    });

    pre.tabIndex = 0;
    pre.setAttribute("aria-label", `${label.textContent} 코드`);
    actions.append(wrapButton, copyButton);
    toolbar.append(label, actions);
    target.before(block);
    block.append(toolbar, target, status);
  });
})();
