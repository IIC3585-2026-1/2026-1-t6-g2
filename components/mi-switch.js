const template = document.createElement("template");

template.innerHTML = `
    <style>
        :host {
            display: inline-block;
            box-sizing: border-box;
            font-family: Arial, sans-serif;
        }

        *, *::before, *::after {
            box-sizing: inherit;
        }

        .container {
            display: inline-flex;
            align-items: center;
            gap: 10px;
            padding: 10px;
            border: 1px solid #fbd478;
            border-radius: 10px;
            background:  #faf3e2;
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.12);
        }

        .label {
            font-weight: bold;
        }

        .switch {
            width: 54px;
            height: 30px;
            border: none;
            border-radius: 999px;
            background: #988a69;
            position: relative;
            cursor: pointer;
            padding: 0;
        }

        .thumb {
            width: 24px;
            height: 24px;
            border-radius: 50%;
            background: white;
            position: absolute;
            top: 3px;
            left: 3px;
            transition: transform 0.2s ease;
            box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
        }

        :host([checked]) .switch {
            background: #17c017;
        }

        :host([checked]) .thumb {
            transform: translateX(24px);
        }

        .checked-message {
            display: none;
        }

        .unchecked-message {
            display: inline;
        }

        :host([checked]) .checked-message {
            display: inline;
        }

        :host([checked]) .unchecked-message {
            display: none;
        }
    </style>

    <div class="container">
        <span class="label">
            <slot></slot>
        </span>

        <button class="switch" type="button" role="switch" aria-checked="false">
            <span class="thumb"></span>
        </button>

        <span class="checked-message">
            <slot name="checked-message">On</slot>
        </span>

        <span class="unchecked-message">
            <slot name="unchecked-message">Off</slot>
        </span>
    </div>
`;

class MiSwitch extends HTMLElement {
    static get observedAttributes() {
        return ["checked"];
    }

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(template.content.cloneNode(true));

        this.button = this.shadowRoot.querySelector(".switch");

        this.handleClick = this.handleClick.bind(this);
    }

    connectedCallback() {
        this.button.addEventListener("click", this.handleClick);
        this.updateSwitch();
    }

    disconnectedCallback() {
        this.button.removeEventListener("click", this.handleClick);
    }

    attributeChangedCallback() {
        if (this.button) {
            this.updateSwitch();
        }
    }

    get checked() {
        return this.hasAttribute("checked");
    }

    set checked(value) {
        if (value) {
            this.setAttribute("checked", "");
        } else {
            this.removeAttribute("checked");
        }
    }

    handleClick() {
        this.checked = !this.checked;

        this.dispatchEvent(
            new CustomEvent("change", {
                detail: { checked: this.checked },
                bubbles: true
            })
        );
    }

    updateSwitch() {
        this.button.setAttribute("aria-checked", String(this.checked));
    }
}

customElements.define("mi-switch", MiSwitch);