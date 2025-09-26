class ProgressiveImageLoader {
  constructor(options = {}) {
    this.options = {
      rootMargin: options.rootMargin || '50px',
      threshold: options.threshold || 0,
      ...options
    };
    this.observer = null;
    
    // Rileva automaticamente i path basandosi sulla profondità della pagina
    let pathname = window.location.pathname;
    // Rimuovi il prefisso /docs/ se presente per calcoli corretti
    if (pathname.startsWith('/docs/')) {
      pathname = pathname.replace('/docs/', '/');
    }
    
    const depth = pathname.split('/').filter(x => x !== '').length;
    // Per index.html depth dovrebbe essere 1, per boxes/file.html dovrebbe essere 2
    const actualDepth = depth > 1 ? depth - 1 : 0;
    const prefix = actualDepth > 0 ? '../'.repeat(actualDepth) : '';
    
    console.log('Path detection - original pathname:', window.location.pathname);
    console.log('Path detection - cleaned pathname:', pathname);
    console.log('Path detection - depth:', depth, 'actualDepth:', actualDepth, 'prefix:', prefix);
    
    this.lqipImage = `${prefix}assets/img/headers/blurred_mini_header.jpeg`;
    this.hdImage = `${prefix}assets/img/headers/header-1920x1080.jpeg`;
    
    this.init();
  }

  // Controlla se l'immagine è già preloadata nel head per evitare duplicati
  isImagePreloaded(src) {
    const preloadLinks = document.querySelectorAll('link[rel="preload"][as="image"]');
    return Array.from(preloadLinks).some(link => 
      link.href.includes(src.split('/').pop())
    );
  }

  // Preload con controllo duplicati
  preloadImage(src, srcset = null, sizes = null) {
    // Se l'immagine è già preloadata nel head, non duplicare
    if (this.isImagePreloaded(src)) {
      console.log('Image already preloaded in head:', src);
      return;
    }

    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    if (srcset) {
      link.imagesrcset = srcset;
    }
    if (sizes) {
      link.imagesizes = sizes;
    }
    document.head.appendChild(link);
  }

  // Carica progressivamente i banner headers
  loadBannerHeader() {
    // Gestisce sia banner con data-progressive-image che quelli con CSS background standard
    const bannersWithData = document.querySelectorAll('[data-progressive-image]');
    const bannersWithStandardBg = document.querySelectorAll('.banner');
    
    // Prima gestisci i banner con data attributes
    bannersWithData.forEach(banner => {
      const imageUrl = banner.dataset.imageUrl;
      const lqip = banner.dataset.lqip;
      const srcset = banner.dataset.srcset;
      const sizes = banner.dataset.sizes;

      if (lqip && imageUrl) {
        this.applyProgressiveLoading(banner, lqip, imageUrl, srcset, sizes);
      }
    });

    // Poi gestisci TUTTI i banner standard (non controllo più il CSS)
    bannersWithStandardBg.forEach(banner => {
      // Evita di processare banner che hanno già data-progressive-image
      if (banner.hasAttribute('data-progressive-image')) return;

      // Applica sempre il progressive loading a tutti i banner
      this.applyProgressiveLoading(banner, this.lqipImage, this.hdImage);
    });
  }

  // Applica il caricamento progressivo a un elemento
  applyProgressiveLoading(element, lqipSrc, hdSrc, srcset = null, sizes = null) {
    console.log('Applying progressive loading:', lqipSrc, '->', hdSrc);
    
    // Step 1: Mostra immediatamente l'immagine blurred
    element.style.setProperty('background-image', `url(${lqipSrc})`, 'important');
    element.style.setProperty('background-repeat', 'no-repeat', 'important');
    element.style.setProperty('background-position', 'center center', 'important');
    element.style.setProperty('background-size', 'cover', 'important');
    element.classList.add('lqip-loading');
    
    console.log('Step 1 - Blur applied, element style:', element.style.backgroundImage);
    
    // Step 2: Siccome le immagini sono prelodate, transizione immediata
    // Usa requestAnimationFrame per garantire che il blur sia renderizzato prima
    requestAnimationFrame(() => {
      setTimeout(() => {
        console.log('Step 2 - Switching to HD');
        // Passa direttamente all'immagine HD con !important
        element.style.setProperty('background-image', `url(${hdSrc})`, 'important');
        element.style.setProperty('background-repeat', 'no-repeat', 'important');
        element.style.setProperty('background-position', 'center center', 'important');
        element.style.setProperty('background-size', 'cover', 'important');
        element.style.filter = '';
        element.classList.remove('lqip-loading');
        element.classList.add('hd-loaded');
        
        console.log('Step 2 - HD applied, element style:', element.style.backgroundImage);
      }, 30); // Delay ridotto a 30ms - quasi impercettibile ma visibile
    });
  }

  // Lazy loading per altre immagini
  initLazyLoading() {
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
      this.observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            this.loadLazyImage(img);
            this.observer.unobserve(img);
          }
        });
      }, {
        rootMargin: this.options.rootMargin,
        threshold: this.options.threshold
      });

      lazyImages.forEach(img => this.observer.observe(img));
    } else {
      // Fallback: carica tutte le immagini immediatamente
      lazyImages.forEach(img => this.loadLazyImage(img));
    }
  }

  loadLazyImage(img) {
    if (img.dataset.src) {
      img.src = img.dataset.src;
    }
    if (img.dataset.srcset) {
      img.srcset = img.dataset.srcset;
    }
    if (img.dataset.sizes) {
      img.sizes = img.dataset.sizes;
    }
    img.removeAttribute('data-src');
    img.removeAttribute('data-srcset');
    img.removeAttribute('data-sizes');
  }

  init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        this.loadBannerHeader();
        this.initLazyLoading();
      });
    } else {
      this.loadBannerHeader();
      this.initLazyLoading();
    }
  }
}

// Inizializza automaticamente
new ProgressiveImageLoader();
