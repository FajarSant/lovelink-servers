import { Injectable } from '@nestjs/common';
import { google } from 'googleapis';

@Injectable()
export class GoogleService {
  async getGoogleDrivePhotos(accessToken: string) {
    // Inisialisasi OAuth2 client untuk otorisasi
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: accessToken });

    // Membuat instance Google Drive API
    const drive = google.drive({ version: 'v3', auth: oauth2Client });

    // Mengambil file gambar (foto) dari Google Drive
    const res = await drive.files.list({
      q: "mimeType='image/jpeg'",  // Dapat diganti sesuai tipe file yang diinginkan
      fields: 'files(id, name, mimeType)',
    });

    return res.data.files;  // Mengembalikan list file
  }
}
