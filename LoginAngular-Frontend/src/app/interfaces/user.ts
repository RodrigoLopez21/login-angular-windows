export interface User {
    id?: number;
    firstName?: string;
    lastName?: string;
    username?: string;
  email?: string;
    password?: string;
    credential?: string;
    // Mantener compatibilidad con el backend
    Uname?: string;
    Ulastname?: string;
    Uemail?: string;
    Upassword?: string;
    Ucredential?: string;
  }