const template = document.createElement("template");

template.innerHTML = `
  <style>
    :host {
      display: inline-block;
      box-sizing: border-box;
    }

    *, *::before, *::after {
      box-sizing: inherit;
    }

    .card {
      width: var(--card-width, 200px);
      height: var(--card-height, 120px);
      padding: var(--card-padding, 16px);

      border: 1px solid #d6af4b;
      border-radius: 12px;
      background: #e4cf9e;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);

      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
    }
  </style>

  <div class="card">
    <slot></slot>
  </div>
`;

class MiCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" }); // encapsulamos el HTML y CSS del componente
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }
}

customElements.define("mi-card", MiCard);