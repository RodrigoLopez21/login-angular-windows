import { Injectable } from '@angular/core';
import * as jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor() {}

  /**
   * Obtiene el rol (Rid) desde el token JWT almacenado
   */
  getRoleFromToken(): number | null {
    try {
      const token = localStorage.getItem('myToken');
      if (!token) return null;

      const decoded: any = (jwt_decode as any)(token);
      return decoded.rid || null;
    } catch (error) {
      console.error('Error decodificando token:', error);
      return null;
    }
  }

  /**
   * Decodifica el token y retorna el payload completo
   */
  getTokenPayload(): any {
    try {
      const token = localStorage.getItem('myToken');
      if (!token) return null;
      return (jwt_decode as any)(token);
    } catch (error) {
      console.error('Error decodificando token:', error);
      return null;
    }
  }

  /**
   * Verifica si el token es válido
   */
  isTokenValid(): boolean {
    try {
      const token = localStorage.getItem('myToken');
      if (!token) return false;

      const decoded: any = (jwt_decode as any)(token);
      const now = Date.now() / 1000;
      return decoded.exp > now;
    } catch (error) {
      return false;
    }
  }
}
