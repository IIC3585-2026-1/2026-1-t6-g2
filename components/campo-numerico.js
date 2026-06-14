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
            gap: 8px;
            padding: 10px;
            border: 1px solid #fbd478;
            border-radius: 10px;
            background:  #faf3e2;
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.12);
        }

        .label {
            font-weight: bold;
        }

        input {
            width: 70px;
            padding: 6px 8px;
            border: 1px solid #fbd478;
            border-radius: 6px;
            font: inherit;
            text-align: center;
        }

        .buttons {
            display: flex;
            flex-direction: column;
            gap: 3px;
        }

        button {
            width: 28px;
            height: 24px;
            border: 1px solid #fbd478;
            border-radius: 6px;
            background:  #faf3e2;
            cursor: pointer;
            font: inherit;
            line-height: 1;
        }

        button:hover {
            background: #fadd9a;
        }
    </style>

    <div class="container">
        <span class="label">
        <slot>Number:</slot>
        </span>

        <input class="input" type="number" />

        <div class="buttons">
        <button class="increment" type="button" aria-label="Aumentar">+</button>
        <button class="decrement" type="button" aria-label="Disminuir">-</button>
        </div>
    </div>
`;

class CampoNumerico extends HTMLElement {
    static get observedAttributes() {
        return ["value", "min", "max", "step"];
    }

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(template.content.cloneNode(true));

        this.input = this.shadowRoot.querySelector(".input");
        this.incrementButton = this.shadowRoot.querySelector(".increment");
        this.decrementButton = this.shadowRoot.querySelector(".decrement");

        this.handleIncrement = this.handleIncrement.bind(this);
        this.handleDecrement = this.handleDecrement.bind(this);
        this.handleInput = this.handleInput.bind(this);
    }

    connectedCallback() {
        this.updateInputFromAttributes();

        this.incrementButton.addEventListener("click", this.handleIncrement);
        this.decrementButton.addEventListener("click", this.handleDecrement);
        this.input.addEventListener("input", this.handleInput);
    }

    disconnectedCallback() {
        this.incrementButton.removeEventListener("click", this.handleIncrement);
        this.decrementButton.removeEventListener("click", this.handleDecrement);
        this.input.removeEventListener("input", this.handleInput);
    }

    attributeChangedCallback() {
        if (this.input) {
            this.updateInputFromAttributes();
        }
    }

    get value() {
        return Number(this.getAttribute("value") ?? 0);
    }

    get step() {
        return Number(this.getAttribute("step") ?? 1);
    }

    get min() {
        const min = this.getAttribute("min");
        return min === null ? -Infinity : Number(min);
    }

    get max() {
        const max = this.getAttribute("max");
        return max === null ? Infinity : Number(max);
    }

    setValue(newValue) {
        let value = Number(newValue);

        if (Number.isNaN(value)) {
            value = 0;
        }

        if (value < this.min) {
            value = this.min;
        }

        if (value > this.max) {
            value = this.max;
        }

        this.setAttribute("value", value);
        this.input.value = value;

        this.dispatchEvent(
            new CustomEvent("value-change", {
                detail: { value },
                bubbles: true
            })
        );
    }

    updateInputFromAttributes() {
        this.input.value = this.value;

        this.input.setAttribute("step", this.step);

        if (this.hasAttribute("min")) {
            this.input.setAttribute("min", this.min);
        } else {
            this.input.removeAttribute("min");
        }

        if (this.hasAttribute("max")) {
            this.input.setAttribute("max", this.max);
        } else {
            this.input.removeAttribute("max");
        }
    }

    handleIncrement() {
        this.setValue(this.value + this.step);
    }

    handleDecrement() {
        this.setValue(this.value - this.step);
    }

    handleInput() {
        this.setValue(this.input.value);
    }
}

customElements.define("campo-numerico", CampoNumerico);