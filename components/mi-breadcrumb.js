const templateBreadcrumbItem = document.createElement('template');
templateBreadcrumbItem.innerHTML = `
  <style>
    :host {
      display: inline-flex;
      align-items: center;
      font-family: Arial, sans-serif;
    }

    a {
      color: #8a6a00;
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }
    /* Ítem sin href = ubicación actual: no es un enlace clickeable */
    a:not([href]) {
      color: #444;
      cursor: default;
      font-weight: bold;
      pointer-events: none;
    }

    .separator {
      margin: 0 8px;
      color: #aaa;
      user-select: none;
    }

    /* Último ítem: no muestra separador */
    :host(:last-child) .separator {
      display: none;
    }
  </style>

  <a><slot></slot></a>
  <span class="separator" aria-hidden="true">›</span>
`;

class MiBreadcrumbItem extends HTMLElement {
  static get observedAttributes() { return ['href']; }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(templateBreadcrumbItem.content.cloneNode(true));
    this._link = this.shadowRoot.querySelector('a');
  }

  connectedCallback()            { this._updateLink(); }
  attributeChangedCallback()     { this._updateLink(); }

  _updateLink() {
    const href = this.getAttribute('href');
    if (href !== null) {
      this._link.setAttribute('href', href);
    } else {
      this._link.removeAttribute('href');
    }
  }
}
customElements.define('mi-breadcrumb-item', MiBreadcrumbItem);


const templateBreadcrumb = document.createElement('template');
templateBreadcrumb.innerHTML = `
  <style>
    :host {
      display: block;
      font-family: Arial, sans-serif;
    }
    nav {
      display: inline-flex;
      align-items: center;
      flex-wrap: wrap;
      padding: 10px 16px;
      border: 1px solid #fbd478;
      border-radius: 10px;
      background: #faf3e2;
      box-shadow: 0 2px 6px rgba(0,0,0,0.12);
    }
  </style>

  <nav aria-label="breadcrumb">
    <slot></slot>
  </nav>
`;

class MiBreadcrumb extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(templateBreadcrumb.content.cloneNode(true));
  }
}
customElements.define('mi-breadcrumb', MiBreadcrumb);