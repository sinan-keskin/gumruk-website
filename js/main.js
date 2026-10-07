/* ==========================================================================
   Topraklar Gümrük Müşavirliği & Dış Ticaret Danışmanlığı - Main Controller
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // Helper for current language
  function getLang() {
    return localStorage.getItem('topraklar_lang') || localStorage.getItem('vanguard_lang') || 'tr';
  }

  // 1. Sticky Header Scroll Effect
  const header = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  });

  // 2. Mobile Menu Drawer & Backdrop
  const mobileToggle = document.getElementById('mobileNavToggle');
  const mobileDrawer = document.getElementById('mobileMenuDrawer');
  const drawerClose = document.getElementById('mobileDrawerClose');
  const drawerBackdrop = document.getElementById('drawerBackdrop');

  function openDrawer() {
    mobileDrawer?.classList.add('open');
    drawerBackdrop?.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    mobileDrawer?.classList.remove('open');
    drawerBackdrop?.classList.remove('open');
    document.body.style.overflow = '';
  }

  mobileToggle?.addEventListener('click', openDrawer);
  drawerClose?.addEventListener('click', closeDrawer);
  drawerBackdrop?.addEventListener('click', closeDrawer);

  // 3. Mobile Accordion for Services
  const mobileServicesBtn = document.getElementById('mobileServicesBtn');
  const mobileServicesContent = document.getElementById('mobileServicesContent');
  const mobileAccordionIcon = document.getElementById('mobileAccordionIcon');

  mobileServicesBtn?.addEventListener('click', () => {
    const isOpen = mobileServicesContent?.classList.toggle('open');
    if (mobileAccordionIcon) {
      mobileAccordionIcon.textContent = isOpen ? '−' : '+';
    }
  });

  // 4. Quick Duty Estimator Calculator (on Home page & Tools)
  const calcBtn = document.getElementById('calcDutyBtn');
  if (calcBtn) {
    calcBtn.addEventListener('click', () => {
      const cifInput = document.getElementById('calcCifValue');
      const dutyRateInput = document.getElementById('calcDutyRate');
      const vatRateInput = document.getElementById('calcVatRate');
      const resultBox = document.getElementById('calcResultBox');
      const resultAmount = document.getElementById('calcDutyTotal');
      const resultVat = document.getElementById('calcVatTotal');
      const resultGrandTotal = document.getElementById('calcGrandTotal');

      const cif = parseFloat(cifInput?.value) || 0;
      const dutyRate = parseFloat(dutyRateInput?.value) || 0;
      const vatRate = parseFloat(vatRateInput?.value) || 20;

      if (cif <= 0) {
        const errors = {
          en: 'Please enter a valid CIF invoice amount.',
          tr: 'Lütfen geçerli bir CIF fatura tutarı giriniz.',
          de: 'Bitte geben Sie einen gültigen CIF-Rechnungsbetrag ein.',
          fr: 'Veuillez saisir un montant de facture CIF valide.',
          es: 'Por favor, introduzca un importe de factura CIF válido.',
          zh: '请输入有效的CIF发票到岸金额。',
          ar: 'يرجى إدخال قيمة فاتورة CIF صحيحة.',
          ru: 'Пожалуйста, введите корректную сумму инвойса CIF.'
        };
        alert(errors[getLang()] || errors.en);
        return;
      }

      const dutyAmount = (cif * dutyRate) / 100;
      const vatBase = cif + dutyAmount;
      const vatAmount = (vatBase * vatRate) / 100;
      const totalTax = dutyAmount + vatAmount;

      if (resultAmount) resultAmount.textContent = '$' + dutyAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      if (resultVat) resultVat.textContent = '$' + vatAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      if (resultGrandTotal) resultGrandTotal.textContent = '$' + totalTax.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

      if (resultBox) {
        resultBox.style.display = 'block';
        resultBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });
  }

  // 5. HS Code / GTİP Lookup Simulator
  const hsSearchBtn = document.getElementById('hsSearchBtn');
  const hsInput = document.getElementById('hsSearchInput');
  const hsResultBox = document.getElementById('hsResultBox');

  if (hsSearchBtn && hsInput) {
    hsSearchBtn.addEventListener('click', () => {
      const query = hsInput.value.trim();
      if (!query) {
        const errors = {
          en: 'Please enter a product name or HS Code (e.g., 8429, Coffee, Medical Devices, Steel).',
          tr: 'Lütfen bir ürün adı veya GTİP Kodu giriniz (örn. 8429, Kahve, Medikal Cihaz, Çelik).',
          de: 'Bitte geben Sie eine Warenbezeichnung oder Zolltarifnummer ein (z.B. 8429, Kaffee, Medizingeräte, Stahl).',
          fr: 'Veuillez entrer un nom de produit ou code SH (ex. 8429, Café, Dispositifs médicaux, Acier).',
          es: 'Introduzca el nombre de un producto o partida arancelaria (p. ej. 8429, Café, Dispositivos médicos, Acero).',
          zh: '请输入商品品名或HS海关编码（如8429、咖啡、医疗设备、钢铁）。',
          ar: 'يرجى إدخال اسم السلعة أو الرمز الجمركي (مثل 8429، قهوة، أجهزة طبية، حديد).',
          ru: 'Пожалуйста, введите название товара или код ТН ВЭД (например, 8429, кофе, медоборудование, сталь).'
        };
        alert(errors[getLang()] || errors.en);
        return;
      }

      // Sample mock responses for demonstration
      const mockDatabase = {
        '8429': {
          code: '8429.52.10.00.00',
          title: 'Self-propelled excavators with a 360° revolving superstructure / Döner tablalı ekskavatörler',
          regulations: 'TAREKS / CE Technical Inspection, Used Machinery Import Permit from Ministry of Industry.',
          duty: 'Duty Rate: 0% (EU/FTA) / 2.7% (General), VAT: 20%'
        },
        'coffee': {
          code: '0901.11.00.00.00',
          title: 'Coffee, not roasted, not decaffeinated / Kavrulmamış kahve çekirdekleri',
          regulations: 'Ministry of Agriculture Phytosanitary Certificate, Health Certificate, Border Inspection Post clearance.',
          duty: 'Duty Rate: 4% - 13%, Surveillance Certificate Required, VAT: 1%'
        },
        'food': {
          code: '2106.90.98.00.00',
          title: 'Food preparations not elsewhere specified / Diğer gıda müstahzarları',
          regulations: 'Approval from Ministry of Agriculture, GMO Testing Certificate, Halal / Analysis Certificate.',
          duty: 'Duty Rate: 12.8% + EA (Agricultural component), VAT: 10%'
        }
      };

      const matchedKey = Object.keys(mockDatabase).find(k => query.toLowerCase().includes(k)) || '8429';
      const data = mockDatabase[matchedKey];

      if (hsResultBox) {
        hsResultBox.innerHTML = `
          <div style="background: #F0F9FF; border: 1px solid #BAE6FD; border-radius: 8px; padding: 16px; margin-top: 14px;">
            <div style="display: flex; align-items: center; justify-content: space-between;">
              <span style="font-weight: 800; color: #0284C7; font-size: 1.05rem;">GTİP / HS: ${data.code}</span>
              <span class="badge badge-blue">Verified Tariff</span>
            </div>
            <p style="font-weight: 600; color: #0F172A; margin: 8px 0 6px 0; font-size: 0.92rem;">${data.title}</p>
            <p style="font-size: 0.84rem; color: #475569; margin-bottom: 4px;"><strong>Statutory Requirements:</strong> ${data.regulations}</p>
            <p style="font-size: 0.84rem; color: #0284C7; font-weight: 600;">${data.duty}</p>
          </div>
        `;
        hsResultBox.style.display = 'block';
      }
    });
  }

  // 6. Generic Form Submission handler (Contact and Consultation)
  const inquiryForms = document.querySelectorAll('.customs-inquiry-form');
  inquiryForms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn ? submitBtn.innerHTML : 'Submit';

      const transmittingTexts = {
        en: 'Transmitting Dossier...',
        tr: 'Dosya İletiliyor...',
        de: 'Dossier wird übertragen...',
        fr: 'Transmission du dossier...',
        es: 'Transmitiendo expediente...',
        zh: '正在传送关务报关资料...',
        ar: 'جاري إرسال الملف...',
        ru: 'Передача досье...'
      };

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = transmittingTexts[getLang()] || transmittingTexts.en;
      }

      const successMessages = {
        en: 'Thank you! Your customs inquiry dossier has been submitted to our Licensed Customs Brokers. A specialist will review your cargo parameters and contact you within 15 minutes.',
        tr: 'Teşekkür ederiz! Gümrükleme talep dosyanız Lisanslı Gümrük Müşavirlerimize iletilmiştir. Uzmanımız eşya parametrelerinizi inceleyerek 15 dakika içinde sizinle iletişime geçecektir.',
        de: 'Vielen Dank! Ihr Zolldossier wurde an unsere zugelassenen Zollberater übermittelt. Ein Experte wird sich innerhalb von 15 Minuten bei Ihnen melden.',
        fr: 'Merci ! Votre dossier de dédouanement a été transmis à nos courtiers en douane agréés. Un spécialiste vous contactera dans les 15 minutes.',
        es: '¡Gracias! Su expediente aduanero ha sido remitido a nuestros agentes de aduanas colegiados. Un especialista se pondrá en contacto con usted en 15 minutos.',
        zh: '感谢您的咨询！您的关务申报资料已成功提交至持证专业报关师团队，业务专家将在15分钟内与您取得联系。',
        ar: 'شكراً لك! تم إرسال ملف التخليص الجمركي إلى مخلصينا المعتمدين بنجاح. سيتواصل معك أحد خبرائنا خلال 15 دقيقة.',
        ru: 'Спасибо! Ваш таможенный запрос успешно передан лицензированным таможенным брокерам. Специалист свяжется с вами в течение 15 минут.'
      };

      setTimeout(() => {
        alert(successMessages[getLang()] || successMessages.en);
        form.reset();
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
        }
      }, 1000);
    });
  });

  // 7. Hero Background Video Autoplay Controller (Works on GitHub Pages & Static Hosting)
  const heroVideo = document.getElementById('heroBgVideo');
  if (heroVideo) {
    heroVideo.muted = true;
    heroVideo.defaultMuted = true;
    heroVideo.setAttribute('playsinline', '');
    heroVideo.setAttribute('webkit-playsinline', '');

    const tryPlay = () => {
      const p = heroVideo.play();
      if (p !== undefined) {
        p.catch(() => {
          // If browser policy blocked immediate autoplay, play upon first user interaction
          const onInteract = () => {
            heroVideo.play().catch(() => {});
            ['click', 'touchstart', 'scroll'].forEach(evt => document.removeEventListener(evt, onInteract));
          };
          ['click', 'touchstart', 'scroll'].forEach(evt => document.addEventListener(evt, onInteract, { once: true, passive: true }));
        });
      }
    };

    if (heroVideo.readyState >= 2) {
      tryPlay();
    } else {
      heroVideo.addEventListener('loadeddata', tryPlay, { once: true });
    }
  }
});
