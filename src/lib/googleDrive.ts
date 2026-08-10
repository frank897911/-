import { TravelAppData } from '../types';

export interface DriveFileInfo {
  id: string;
  name: string;
  modifiedTime: string;
  size?: string;
}

const DEFAULT_FILE_NAME = '行程助手_日本旅遊行程備份.json';

/**
 * Direct REST helper to search for existing backup file on Google Drive
 */
export async function findDriveBackupFile(accessToken: string, fileName: string = DEFAULT_FILE_NAME): Promise<string | null> {
  try {
    const q = encodeURIComponent(`name = '${fileName}' and trashed = false`);
    const res = await fetch(`https://www.googleapis.com/drive/v3/files?q=${q}&fields=files(id,name,modifiedTime)`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!res.ok) {
      console.warn('Google Drive search failed:', await res.text());
      return null;
    }

    const data = await res.json();
    if (data.files && data.files.length > 0) {
      return data.files[0].id;
    }
    return null;
  } catch (err) {
    console.error('Error finding Drive backup file:', err);
    return null;
  }
}

/**
 * Save / Update itinerary data directly to Google Drive (by optional specific fileId)
 */
export async function saveToGoogleDrive(
  accessToken: string,
  data: TravelAppData,
  fileName: string = DEFAULT_FILE_NAME,
  targetFileId?: string
): Promise<{ success: boolean; fileId?: string; error?: string }> {
  try {
    const existingFileId = targetFileId || (await findDriveBackupFile(accessToken, fileName));
    const jsonContent = JSON.stringify(data, null, 2);

    if (existingFileId) {
      // Update existing file content
      const updateRes = await fetch(
        `https://www.googleapis.com/upload/drive/v3/files/${existingFileId}?uploadType=media`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: jsonContent,
        }
      );

      if (!updateRes.ok) {
        const errText = await updateRes.text();
        return { success: false, error: `更新 Google Drive 檔案失敗: ${errText}` };
      }

      return { success: true, fileId: existingFileId };
    } else {
      // Create new file with multipart upload
      const metadata = {
        name: fileName,
        mimeType: 'application/json',
        description: '由日本旅遊小助手產生的共同編輯行程資料',
      };

      const boundary = '-------314159265358979323846';
      const delimiter = `\r\n--${boundary}\r\n`;
      const closeDelimiter = `\r\n--${boundary}--`;

      const multipartRequestBody =
        delimiter +
        'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
        JSON.stringify(metadata) +
        delimiter +
        'Content-Type: application/json\r\n\r\n' +
        jsonContent +
        closeDelimiter;

      const createRes = await fetch(
        'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': `multipart/related; boundary=${boundary}`,
          },
          body: multipartRequestBody,
        }
      );

      if (!createRes.ok) {
        const errText = await createRes.text();
        return { success: false, error: `建立 Google Drive 檔案失敗: ${errText}` };
      }

      const createdFile = await createRes.json();
      return { success: true, fileId: createdFile.id };
    }
  } catch (err: any) {
    console.error('saveToGoogleDrive exception:', err);
    return { success: false, error: err?.message || '連線 Google Drive 時發生錯誤' };
  }
}

/**
 * Get Google Drive File Metadata (e.g. webViewLink)
 */
export async function getDriveFileMetadata(accessToken: string, fileId: string): Promise<{ name: string; modifiedTime: string; webViewLink?: string } | null> {
  try {
    const res = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?fields=id,name,modifiedTime,webViewLink`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.error('getDriveFileMetadata error:', err);
    return null;
  }
}

/**
 * Extract Google Drive file ID from standard URL or raw string
 */
export function extractDriveFileId(input: string): string {
  const trimmed = input.trim();
  const match = trimmed.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (match && match[1]) {
    return match[1];
  }
  return trimmed;
}

/**
 * List JSON files from Google Drive
 */
export async function listGoogleDriveBackups(accessToken: string): Promise<DriveFileInfo[]> {
  try {
    const q = encodeURIComponent(`mimeType = 'application/json' and trashed = false`);
    const res = await fetch(
      `https://www.googleapis.com/drive/v3/files?q=${q}&fields=files(id,name,modifiedTime,size)&orderBy=modifiedTime desc`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!res.ok) return [];
    const data = await res.json();
    return data.files || [];
  } catch (err) {
    console.error('listGoogleDriveBackups error:', err);
    return [];
  }
}

/**
 * Load itinerary content from Google Drive fileId
 */
export async function loadFromGoogleDrive(accessToken: string, fileId: string): Promise<TravelAppData | null> {
  try {
    const res = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!res.ok) return null;
    const data = await res.json();
    return data as TravelAppData;
  } catch (err) {
    console.error('loadFromGoogleDrive error:', err);
    return null;
  }
}

/**
 * Local JSON file export
 */
export function exportLocalJson(data: TravelAppData, customName?: string) {
  const fileName = customName || `${data.tripTitle || '日本旅遊行程'}_備份.json`;
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Local JSON file import
 */
export function importLocalJson(file: File): Promise<TravelAppData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const parsed = JSON.parse(content);
        if (parsed && Array.isArray(parsed.days)) {
          resolve(parsed as TravelAppData);
        } else {
          reject(new Error('檔案格式不符，找不到 days 行程資料結構'));
        }
      } catch (err) {
        reject(new Error('JSON 格式解析錯誤，請確認檔案內容'));
      }
    };
    reader.onerror = () => reject(new Error('檔案讀取失敗'));
    reader.readAsText(file);
  });
}
