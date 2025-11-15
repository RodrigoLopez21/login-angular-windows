import { Injectable, NgZone } from '@angular/core';
import { environments } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SecurityService {
  private securityCheckInterval: any;

  constructor(private ngZone: NgZone) {}

  /**
   * Prevención principal contra clickjacking
   */
  public preventClickjacking(): void {
    if (this.isPageFramed()) {
      console.warn('🚨 Clickjacking detectado - La página está en un frame');
      this.handleFramedPage();
    } else {
      if (!environments.production) {
        console.log('✅ Página cargada correctamente - Sin framing detectado');
      }
    }
  }

  /**
   * Detectar si la página está dentro de un frame
   */
  private isPageFramed(): boolean {
    try {
      return window.self !== window.top;
    } catch (e) {
      // Si hay error de cross-origin, estamos en un frame
      return true;
    }
  }

  /**
   * Manejar la detección de página en frame
   */
  private handleFramedPage(): void {
    try {
      if (this.canRedirectTopWindow()) {
        console.log('🔄 Intentando redirigir frame padre...');
        window.top!.location.href = window.self.location.href;
      } else {
        console.error('❌ No se puede redirigir el frame padre');
        this.showSecurityWarning();
      }
    } catch (error) {
      console.error('❌ Error al redirigir frame:', error);
      this.showSecurityWarning();
    }
  }

  /**
   * Verificar si es seguro redirigir window.top
   */
  private canRedirectTopWindow(): boolean {
    if (!window.top || window.top === window.self) {
      return false;
    }

    try {
      const test = window.top.location.origin;
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Mostrar advertencia de seguridad al usuario
   */
  private showSecurityWarning(): void {
    if (document.getElementById('clickjacking-warning')) {
      return;
    }

    const warningDiv = document.createElement('div');
    warningDiv.id = 'clickjacking-warning';
    warningDiv.innerHTML = `
      <div style="
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.97);
        color: white;
        z-index: 999999;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        font-family: Arial, sans-serif;
        text-align: center;
        padding: 30px;
        box-sizing: border-box;
      ">
        <div style="background: #1a1a1a; padding: 40px; border-radius: 10px; border: 2px solid #ff4444; max-width: 500px;">
          <h1 style="color: #ff4444; margin-bottom: 20px; font-size: 24px;">⚠️ Advertencia de Seguridad</h1>
          <p style="margin-bottom: 15px; font-size: 16px; line-height: 1.5;">
            Se ha detectado un problema de seguridad con cómo se está cargando esta página.
          </p>
          <p style="margin-bottom: 25px; font-size: 14px; opacity: 0.9; line-height: 1.4;">
            Para proteger su información, por favor:<br>
            • <strong>Cierre esta pestaña inmediatamente</strong><br>
            • Acceda directamente al sitio web oficial<br>
            • Verifique la URL en su navegador
          </p>
          <div style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">
            <button id="close-page-btn" style="
              padding: 12px 24px;
              background: #ff4444;
              color: white;
              border: none;
              border-radius: 5px;
              cursor: pointer;
              font-size: 14px;
              font-weight: bold;
            ">Cerrar Página</button>
            <button id="reload-page-btn" style="
              padding: 12px 24px;
              background: #ffbb33;
              color: black;
              border: none;
              border-radius: 5px;
              cursor: pointer;
              font-size: 14px;
            ">Reintentar</button>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(warningDiv);

    // Añadir event listeners a los botones
    const closeBtn = document.getElementById('close-page-btn');
    const reloadBtn = document.getElementById('reload-page-btn');

    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        window.close();
      });
    }

    if (reloadBtn) {
      reloadBtn.addEventListener('click', () => {
        location.reload();
      });
    }
  }

  /**
   * Método para verificación manual desde consola
   */
  public securityReport(): void {
    const isFramed = this.isPageFramed();
    
    console.group('🔒 Reporte de Seguridad - Clickjacking Protection');
    console.log('Estado:', isFramed ? '❌ VULNERABLE' : '✅ SEGURO');
    console.log('En Frame:', isFramed ? 'Sí' : 'No');
    console.log('URL:', window.location.href);
    console.log('User Agent:', navigator.userAgent);
    console.groupEnd();
  }

  /**
   * Verificar el estado de seguridad (para uso interno)
   */
  public checkSecurityStatus(): { isFramed: boolean; isSecure: boolean; details: string } {
    const isFramed = this.isPageFramed();
    
    return {
      isFramed,
      isSecure: !isFramed,
      details: isFramed 
        ? 'La página está cargada dentro de un frame' 
        : 'Página cargada correctamente'
    };
  }

  /**
   * Limpiar recursos
   */
  public destroy(): void {
    if (this.securityCheckInterval) {
      clearInterval(this.securityCheckInterval);
    }
    
    // Remover advertencia si existe
    const warning = document.getElementById('clickjacking-warning');
    if (warning) {
      warning.remove();
    }
  }
}