export type UserPayload = {             
    email: string;
    iat?: number;              // Timestamp de emisión del token (opcional)
    exp?: number;              // Timestamp de expiración del token (opcional)
    name?: string;
    iduser?: number;
    phone?: string;
    password?: string;
    role?: string;
    created_at?: Date;
  };
  