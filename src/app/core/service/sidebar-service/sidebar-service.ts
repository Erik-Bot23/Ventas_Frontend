import { Injectable, OnDestroy } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { Subscription, filter } from 'rxjs';

/**
 * Servicio compartido que maneja el estado del sidebar (menu abierto/cierto).
 *
 * PROBLEMA QUE RESUELVE:
 * Antes, cada componente (productos, cobro, etc.) tenia su propia variable menuOpen.
 * El Sidebar tambien tenia su propia copia. Al navegar entre paginas, Angular podia
 * reutilizar la instancia del Sidebar sin destruirla, entonces el evento NavigationEnd
 * no se procesaba correctamente y el menu no se contraia al navegar.
 *
 * SOLUCION:
 * Un solo servicio (providedIn: 'root') mantiene el estado del menu.
 * El servicio escucha los cambios de ruta globalmente y cierra el menu automaticamente.
 * Todos los componentes comparten la MISMA instancia del servicio, asi siempre estan
 * sincronizados.
 *
 * COMO FUNCIONA:
 * 1. El servicio se crea una sola vez (singleton) al iniciar la app.
 * 2. En el constructor, se suscribe a router.events y filtra solo NavigationEnd.
 * 3. Cada vez que el usuario navega a cualquier ruta, el servicio pone menuOpen = false.
 * 4. El Sidebar y los componentes padre leen menuOpen desde este servicio.
 * 5. Cuando el usuario hace clic en "Menu", el Sidebar actualiza sidebar.menuOpen
 *    y notifica al padre via el evento @Output() toggle.
 */
@Injectable({ providedIn: 'root' })
export class SidebarService implements OnDestroy {
  // Suscripcion al router para limpiarla al destruir el servicio (evita memory leaks)
  private routerSub?: Subscription;

  /**
   * Estado del menu.
   * false = menu colapsado (sidebar angosta, textos ocultos)
   * true  = menu expandido (sidebar completa, textos visibles)
   */
  menuOpen = false;

  constructor(private router: Router) {
/**
    * Escuchar TODOS los eventos del router.
    * pipe(filter(...)) filtra solo los eventos NavigationStart, que se disparan
    * ANTES de que la navegacion inicie (cuando el usuario hace clic en un link del menu).
    *
    * CAMBIO: se usaba NavigationEnd (despues de cargar la ruta), pero la animacion
    * del sidebar (800ms) se sentia rapida porque el nuevo componente aparecia antes
    * de terminar el cierre. Con NavigationStart, el cierre COMIENZA inmediatamente
    * al hacer clic, dando tiempo a que la transicion termine naturalmente.
    *
    * Ejemplo: si el usuario esta en /productos con el menu abierto y hace clic
    * en "Inicio" (que va a /cobro), se disparara NavigationStart ANTES de navegar.
    * El servicio detecta esto y pone menuOpen = false → el sidebar empieza a contraerse
    * mientras la nueva ruta se esta cargando.
    */
    this.routerSub = this.router.events.pipe(
      filter(event => event instanceof NavigationStart)
    ).subscribe(() => {
      if (this.menuOpen) {
        this.menuOpen = false;
      }
    });
  }

  /**
   * Lifecycle hook: se ejecuta cuando el servicio se destruye.
   * En la practica, como providedIn: 'root', solo se destruye al cerrar la app.
   * Pero es buena practica limpiar la suscripcion para evitar memory leaks.
   */
  ngOnDestroy(): void {
    this.routerSub?.unsubscribe();
  }
}
