(() => {
    const self = reg_ns("editor", ["markdown"]);

    // create_editor
    self.define(
        "create_editor",
        function (imports, value) {
            globalThis.editor = CodeMirror(
                document.getElementById("text_tab"),
                {
                    value: value || "",
                    mode: "markdown",
                    lineWrapping: true,
                    autoCloseBrackets: true,
                    autofocus: true,
                    viewportMargin: Infinity,
                    lineWrapping: true,
                    inputStyle: "contenteditable",
                    highlightFormatting: false,
                    fencedCodeBlockHighlighting: false,
                    xml: false,
                    smartIndent: false,
                    extraKeys: {
                        Home: "goLineLeft",
                        End: "goLineRight",
                        Enter: (cm) => {
                            cm.replaceSelection("\n");
                        },
                    },
                },
            );

            // ...
            document
                .querySelector(".CodeMirror-code")
                .setAttribute("spellcheck", "true");
        },
        ["string"],
    );

    // tabs
    self.define("init_tabs", ({ markdown }) => {
        const text_button = document.getElementById("text_button");
        const text_tab = document.getElementById("text_tab");

        const preview_button = document.getElementById("preview_button");
        const preview_tab = document.getElementById("preview_tab");

        if (text_button && preview_button) {
            text_button.addEventListener("click", () => {
                preview_button.classList.add("secondary");
                text_button.classList.remove("secondary");

                preview_tab.style.display = "none";
                text_tab.style.display = "block";
            });

            preview_button.addEventListener("click", async () => {
                text_button.classList.add("secondary");
                preview_button.classList.remove("secondary");

                text_tab.style.display = "none";
                preview_tab.style.display = "block";

                // render
                preview_tab.innerHTML = "";
                preview_tab.innerHTML = await (
                    await fetch("/api/render", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            content: globalThis.editor.getValue(),
                        }),
                    })
                ).text();

                markdown.fix_markdown("preview_tab"); // fix markdown
            });
        }
    });
})();
