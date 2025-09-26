class ProgressiveImageLoader {
  constructor(options = {}) {
    this.options = {
      rootMargin: options.rootMargin || '50px',
      threshold: options.threshold || 0,
      ...options
    };
    this.observer = null;
    
    // Rileva automaticamente i path basandosi sulla profondità della pagina
    const depth = window.location.pathname.split('/').filter(x => x !== '').length - 1;
    const prefix = depth > 0 ? '../'.repeat(depth) : '';
    
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

    // Poi gestisci i banner standard che usano header-1920x1080.jpeg
    bannersWithStandardBg.forEach(banner => {
      // Evita di processare banner che hanno già data-progressive-image
      if (banner.hasAttribute('data-progressive-image')) return;

      const currentBg = getComputedStyle(banner).backgroundImage;
      if (currentBg && currentBg.includes('header-1920x1080')) {
        this.applyProgressiveLoading(banner, this.lqipImage, this.hdImage);
      }
    });
  }

  // Applica il caricamento progressivo a un elemento
  applyProgressiveLoading(element, lqipSrc, hdSrc, srcset = null, sizes = null) {
    // Salva l'immagine originale se presente nel CSS
    const originalBg = getComputedStyle(element).backgroundImage;
    
    // Applica LQIP temporaneamente solo per l'effetto blur
    element.style.backgroundImage = `url(${lqipSrc})`;
    element.classList.add('lqip-loading');
    
    // Preload HD (con controllo duplicati)  
    this.preloadImage(hdSrc, srcset, sizes);
    
    // Dopo il preload, ripristina l'immagine originale e rimuovi blur
    const img = new Image();
    
    if (srcset) {
      img.srcset = srcset;
    }
    if (sizes) {
      img.sizes = sizes;
    }
    
    img.onload = () => {
      // Imposta esplicitamente l'immagine HD con tutte le proprietà CSS
      element.style.backgroundImage = `url(${hdSrc})`;
      element.style.backgroundRepeat = 'no-repeat';
      element.style.backgroundPosition = 'center center';
      element.style.backgroundSize = 'cover';
      
      // Rimuovi completamente il filtro invece di impostarlo a none
      element.style.filter = '';
      element.classList.remove('lqip-loading');
      element.classList.add('hd-loaded');
    };
    
    img.onerror = () => {
      console.warn('Failed to load HD image:', hdSrc);
      element.style.backgroundImage = '';
      element.style.filter = '';
      element.classList.remove('lqip-loading');
      element.classList.add('hd-error');
    };
    
    img.src = hdSrc;
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
