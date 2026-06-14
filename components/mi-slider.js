class MiSliderLabel extends HTMLElement {}
customElements.define('mi-slider-label', MiSliderLabel);

const templateSlider = document.createElement('template');
templateSlider.innerHTML = `
  <style>
    :host {
      display: inline-block;
      box-sizing: border-box;
      font-family: Arial, sans-serif;
      width: 100%;
    }
    *, *::before, *::after { box-sizing: inherit; }

    .container {
      padding: 12px 16px 16px;
      border: 1px solid #fbd478;
      border-radius: 10px;
      background: #faf3e2;
      box-shadow: 0 2px 6px rgba(0,0,0,0.12);
    }

    input[type="range"] {
      width: 100%;
      cursor: pointer;
      accent-color: #d6af4b;
      margin: 0;
    }

    .labels-container {
      position: relative;
      height: 20px;
      margin-top: 4px;
    }

    .label-item {
      position: absolute;
      transform: translateX(-50%);
      font-size: 12px;
      color: #666;
      white-space: nowrap;
    }

    /* Ocultar el slot: solo lo usamos para leer los datos */
    slot { display: none; }
  </style>

  <div class="container">
    <input type="range" />
    <div class="labels-container"></div>
    <slot></slot>
  </div>
`;

class MiSlider extends HTMLElement {
  static get observedAttributes() {
    return ['min', 'max', 'value', 'step'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(templateSlider.content.cloneNode(true));

    this._input          = this.shadowRoot.querySelector('input[type="range"]');
    this._labelsContainer = this.shadowRoot.querySelector('.labels-container');
    this._slot           = this.shadowRoot.querySelector('slot');

    this._handleInput      = this._handleInput.bind(this);
    this._handleSlotChange = this._handleSlotChange.bind(this);
  }

  connectedCallback() {
    this._syncAttributes();
    this._input.addEventListener('input', this._handleInput);
    this._slot.addEventListener('slotchange', this._handleSlotChange);
  }

  disconnectedCallback() {
    this._input.removeEventListener('input', this._handleInput);
    this._slot.removeEventListener('slotchange', this._handleSlotChange);
  }

  attributeChangedCallback() {
    if (this._input) this._syncAttributes();
  }

  get value() { return Number(this.getAttribute('value') ?? 50); }
  get min()   { return Number(this.getAttribute('min')   ?? 0);  }
  get max()   { return Number(this.getAttribute('max')   ?? 100);}
  get step()  { return Number(this.getAttribute('step')  ?? 1);  }

  _syncAttributes() {
    this._input.min   = this.min;
    this._input.max   = this.max;
    this._input.value = this.value;
    this._input.step  = this.step;
  }

  _handleInput() {
    this.setAttribute('value', this._input.value);
    this.dispatchEvent(new CustomEvent('value-change', {
      detail: { value: Number(this._input.value) },
      bubbles: true
    }));
  }

  _handleSlotChange() {
    this._renderLabels();
  }

  _renderLabels() {
    const labelEls = this._slot.assignedElements({ flatten: true });
    this._labelsContainer.innerHTML = '';

    labelEls.forEach(el => {
      if (el.tagName.toLowerCase() !== 'mi-slider-label') return;

      const posAttr  = el.getAttribute('position');
      const position = posAttr !== null ? Number(posAttr) : 0;

      const div = document.createElement('div');
      div.className  = 'label-item';
      div.style.left = `${position}%`;
      div.textContent = el.textContent.trim();
      this._labelsContainer.appendChild(div);
    });
  }
}
customElements.define('mi-slider', MiSlider);