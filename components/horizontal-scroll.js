const template = document.createElement("template");

template.innerHTML = `
  <style>
    :host {
      display: block;
      box-sizing: border-box;
    }

    *, *::before, *::after {
      box-sizing: inherit;
    }

    .scroll-container {
      display: flex;
      gap: var(--scroll-gap, 16px);
      overflow-x: auto;
      padding: 12px;
      border: 1px solid #fbd478;
      border-radius: 12px;
      background:  #faf3e2;
      max-width: 100%;
      scroll-snap-type: x mandatory;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.12);
    }

    ::slotted(*) {
      flex: 0 0 auto;
      scroll-snap-align: start;
    }
  </style>

  <div class="scroll-container">
    <slot></slot>
  </div>
`;

class HorizontalScroll extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }
}

customElements.define("horizontal-scroll", HorizontalScroll);