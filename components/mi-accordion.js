const templateAccordionItem = document.createElement('template');
templateAccordionItem.innerHTML = `
  <style>
    :host {
      display: block;
      font-family: Arial, sans-serif;
    }

    .header {
      width: 100%;
      padding: 12px 16px;
      background: #faf3e2;
      border: none;
      border-bottom: 1px solid #fbd478;
      cursor: pointer;
      text-align: left;
      font: inherit;
      font-weight: bold;
      display: flex;
      justify-content: space-between;
      align-items: center;
      transition: background 0.2s;
    }
    .header:hover { background: #fadd9a; }

    .arrow {
      display: inline-block;
      font-size: 12px;
      transition: transform 0.3s ease;
    }
    :host([open]) .arrow { transform: rotate(180deg); }

    /* Panel: animación con max-height */
    .panel {
      overflow: hidden;
      max-height: 0;
      transition: max-height 0.3s ease;
      background: #fff9ee;
    }
    :host([open]) .panel {
      max-height: 500px;
      border-bottom: 1px solid #fbd478;
    }
    .panel-inner { padding: 12px 16px; }

    /* Último ítem: no dobles bordes con el contenedor */
    :host(:last-child) .header       { border-bottom: none; }
    :host([open]:last-child) .header { border-bottom: 1px solid #fbd478; }
    :host([open]:last-child) .panel  { border-bottom: none; }
  </style>

  <button class="header" type="button" aria-expanded="false">
    <slot name="heading">Item</slot>
    <span class="arrow">▼</span>
  </button>
  <div class="panel">
    <div class="panel-inner">
      <slot></slot>
    </div>
  </div>
`;

class MiAccordionItem extends HTMLElement {
  static get observedAttributes() { return ['open']; }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(templateAccordionItem.content.cloneNode(true));
    this._header = this.shadowRoot.querySelector('.header');
    this._handleClick = this._handleClick.bind(this);
  }

  connectedCallback() {
    this._header.addEventListener('click', this._handleClick);
    this._updateAria();
  }

  disconnectedCallback() {
    this._header.removeEventListener('click', this._handleClick);
  }

  attributeChangedCallback() {
    if (this._header) this._updateAria();
  }

  get open()     { return this.hasAttribute('open'); }
  set open(val)  { val ? this.setAttribute('open', '') : this.removeAttribute('open'); }

  _handleClick() {
    this.open = !this.open;
    // El evento sube por el DOM y lo captura mi-accordion
    this.dispatchEvent(new CustomEvent('accordion-toggle', {
      detail: { open: this.open, item: this },
      bubbles: true
    }));
  }

  _updateAria() {
    this._header.setAttribute('aria-expanded', String(this.open));
  }
}
customElements.define('mi-accordion-item', MiAccordionItem);


const templateAccordion = document.createElement('template');
templateAccordion.innerHTML = `
  <style>
    :host {
      display: block;
      font-family: Arial, sans-serif;
      border: 1px solid #fbd478;
      border-radius: 10px;
      overflow: hidden;
      box-shadow: 0 2px 6px rgba(0,0,0,0.12);
      background: #faf3e2;
    }
  </style>
  <slot></slot>
`;

class MiAccordion extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(templateAccordion.content.cloneNode(true));
    this._handleToggle = this._handleToggle.bind(this);
  }

  connectedCallback()    { this.addEventListener('accordion-toggle', this._handleToggle); }
  disconnectedCallback() { this.removeEventListener('accordion-toggle', this._handleToggle); }

  // Cierra todos los ítems excepto el que acaba de abrirse
  _handleToggle(e) {
    if (!e.detail.open) return;
    this.querySelectorAll('mi-accordion-item').forEach(item => {
      if (item !== e.detail.item) item.open = false;
    });
  }
}
customElements.define('mi-accordion', MiAccordion);