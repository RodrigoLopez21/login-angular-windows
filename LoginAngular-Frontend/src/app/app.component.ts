import { AfterViewInit, Component, OnInit, OnDestroy } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { initFlowbite } from 'flowbite';
import { filter } from 'rxjs';
import { SecurityService } from './services/security.service';
import { environments } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html', // Tu HTML original sin cambios
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {

  constructor(
    private router: Router,
    private securityService: SecurityService
  ) {}

  ngOnInit(): void {
    // 1. Inicializar protección contra clickjacking inmediatamente
    this.securityService.preventClickjacking();
    
    // 2. Reporte de seguridad en desarrollo
    if (!environments.production) {
      setTimeout(() => {
        this.securityService.securityReport();
      }, 2000);
    }

    // 3. Manejar la navegación y re-inicializar Flowbite (tu código existente)
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      initFlowbite();
      
      // Verificación de seguridad después de cada navegación
      setTimeout(() => {
        this.securityService.preventClickjacking();
      }, 300);
    });
  }

  ngAfterViewInit(): void {
    // Tu código existente
    initFlowbite();
    
    // Verificación final de seguridad después de que la vista esté completamente cargada
    setTimeout(() => {
      this.securityService.preventClickjacking();
    }, 1000);
  }

  ngOnDestroy(): void {
    // Limpiar recursos del servicio de seguridad
    this.securityService.destroy();
  }
}