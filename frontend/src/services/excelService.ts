import { apiClient } from './api';

export interface ImportPreviewResult {
  filename: string;
  total_rows: number;
  valid_tasks: number;
  invalid_tasks: number;
  preview: Array<{
    title: string;
    description?: string;
    url?: string;
    image_url?: string;
    status: string;
    priority: string;
    is_valid: boolean;
    errors: string[];
  }>;
}

export const excelService = {
  async downloadExport(params?: { status?: string; project_id?: string }): Promise<void> {
    const response = await apiClient.get('/excel/export', {
      params,
      responseType: 'blob',
    });
    const blob = new Blob([response.data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Tasks_Export_${new Date().toISOString().slice(0, 10)}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  },

  async previewImport(file: File): Promise<ImportPreviewResult> {
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiClient.post('/excel/preview-import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  },

  async commitImport(previewData: any): Promise<{ imported_count: number }> {
    const response = await apiClient.post('/excel/commit-import', previewData);
    return response.data.data;
  },
};
