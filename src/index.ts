import $ from 'jquery';
import { submitSelection } from './request';

// Inject styles for the UI
function injectStyles() {
  const css = `
  .lgjump-button {
    background: #fff;
    color: #121212;
    border: 1px solid #313131;
    border-radius: 5px;
    cursor: pointer;
    font-size: 1.4rem;
    padding: .5em 1em;
  }

  .lgjump-overlay {
    position: fixed;
    inset: 0;
    background: rgba(10,10,10,0.8);
    display: none;
    align-items: center;
    justify-content: center;
    z-index: 9998;
    padding: 20px;
  }

  .lgjump-modal {
    background: #fff;
    border-radius: 2px;
    width: min(520px, 100%);
    max-width: 100%;
    box-shadow: 0 16px 50px rgba(13,24,48,0.25);
    transform: translateY(12px) scale(.995);
    opacity: 0;
    transition: transform .18s cubic-bezier(.2,.9,.3,1), opacity .14s ease;
    overflow: hidden;
  }

  .lgjump-overlay.show { display: flex; }
  .lgjump-overlay.show .lgjump-modal { transform: translateY(0) scale(1); opacity: 1; }

  .lgjump-header {
    padding: 18px 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #eef2f7;
  }

  .lgjump-title { font-size: 16px; font-weight: 700; color: #0d1b2a; }

  .lgjump-body { padding: 18px 20px; }

  .lgjump-select {
    width: 100%;
    padding: 10px 12px;
    border-radius: 8px;
    border: 1px solid #e6eef8;
    background: #fbfdff;
    font-size: 14px;
    outline: none;
    box-sizing: border-box;
  }

  .lgjump-actions { padding: 14px 20px; display: flex; gap: 10px; justify-content: flex-end; border-top: 1px solid #f2f6fb; }

  .lgjump-btn { padding: 10px 14px; border-radius: 8px; border: none; cursor: pointer; font-weight: 600; }

  .lgjump-btn.primary { background: #121212; color: white; }
  .lgjump-btn.ghost { background: transparent; color: #213044; }

  .lgjump-close { background: transparent; border: none; cursor: pointer; color: #8b97a8; font-size: 16px; }
  `;

  const style = document.createElement('style');
  style.setAttribute('data-lgjump-style', 'true');
  style.appendChild(document.createTextNode(css));
  document.head.appendChild(style);
}

// Build HTML and inject into body
function injectHtml() {
  const html = `
  <button class="lgjump-button" id="lgjump-button" aria-haspopup="dialog" aria-controls="lgjump-modal">Jump</button>

  <div class="lgjump-overlay" id="lgjump-overlay" role="dialog" aria-modal="true" aria-hidden="true">
    <div class="lgjump-modal" id="lgjump-modal">
      <div class="lgjump-header">
        <div class="lgjump-title">Choose Difficulty</div>
        <button class="lgjump-close" id="lgjump-close" aria-label="Close">✕</button>
      </div>
      <div class="lgjump-body">
        <p>Currently only Luogu cuz of laziness XD</p>
        <select id="lgjump-select" class="lgjump-select" aria-label="Please select">
          <option value="" selected disabled>---</option>
          <option value="0">暂无评定</option>
          <option value="1">入门</option>
          <option value="2">普及-</option>
          <option value="3">普及/提高-</option>
          <option value="4">普及+/提高</option>
          <option value="5">提高+/省选-</option>
          <option value="6">省选/NOI-</option>
          <option value="7">NOI/NOI+/CTSC</option>
        </select>
      </div>
      <div class="lgjump-actions">
        <button class="lgjump-btn ghost" id="lgjump-cancel">Cancel</button>
        <button class="lgjump-btn primary" id="lgjump-submit" disabled>Submit</button>
      </div>
    </div>
  </div>
  `;

  $('#app-old > .lg-index-content > div:nth-child(2) > div:nth-child(1) > div > p').append(html);
}

function setupBehavior() {
  const $button = $('#lgjump-button');
  const $overlay = $('#lgjump-overlay');
  const $close = $('#lgjump-close');
  const $cancel = $('#lgjump-cancel');
  const $submit = $('#lgjump-submit');
  const $select = $('#lgjump-select');

  function openModal() {
    $overlay.attr('aria-hidden', 'false').addClass('show');
    // move focus to select for accessibility
    setTimeout(() => { $select.focus(); }, 80);
  }

  function closeModal() {
    $overlay.attr('aria-hidden', 'true').removeClass('show');
    // $button.focus();
  }

  $button.on('click', () => {
    openModal();
  });

  $close.on('click', closeModal);
  $cancel.on('click', closeModal);

  $overlay.on('click', e => {
    if (e.target === $overlay.get(0)) closeModal();
  });

  $(document).on('keydown', e => {
    if (e.key === 'Escape') closeModal();
  });

  $select.on('change', () => {
    const val = ($select.val() as string) || '';
    if (val) $submit.prop('disabled', false);
    else $submit.prop('disabled', true);
  });

  $submit.on('click', async () => {
    const val = ($select.val() as string) || '';
    if (!val) return;
    $submit.prop('disabled', true).text('Please wait...');
    try {
      await submitSelection(val);
      $submit.text('Submit');
      setTimeout(closeModal, 600);
    } catch (err) {
      console.error('submitSelection error', err);
      $submit.text('Error');
      setTimeout(() => $submit.text('Submit').prop('disabled', false), 1200);
    }
  });
}

const mutationObserver = new MutationObserver(() => {
  const targetNode = document.querySelector('#app-old > .lg-index-content > div:nth-child(2) > div:nth-child(1) > div > p');
  if (targetNode) {
    if (!document.querySelector('#lgjump-button')) {
      injectStyles();
      injectHtml();
      setupBehavior();
    }
  }
});


// Initialize on document ready
$(() => {
  mutationObserver.observe(document.body, { childList: true, subtree: true });
});

export {};
