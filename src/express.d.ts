// Buat file bernama `express.d.ts` atau nama file yang sesuai
declare namespace Express {
  export interface Request {
    user: {
      username: string;
      id: number;
      konter_id: number;
    }; // Ganti 'any' dengan tipe yang sesuai dengan data pengguna Anda
  }
}
