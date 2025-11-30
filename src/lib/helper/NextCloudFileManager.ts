import axios from 'axios';

class NextcloudFileManager {
    private proxyUrl: string;

    constructor(proxyUrl: string) {
        this.proxyUrl = proxyUrl;
    }

    async uploadFile(fileData: Buffer): Promise<string | null> {
        const url = `${this.proxyUrl}/v2/file/upload`;
        const formData = new FormData();
        formData.append('file', new Blob([fileData]));

        try {
            const response = await axios.post(url, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            return response.data?.data || null;
        } catch (error) {
            console.error('Upload failed:', error);
            return null;
        }
    }

    async getFileInfo(fileId: string): Promise<any> {
        const url = `${this.proxyUrl}/v2/file/info?path=${fileId}`;
        try {
            const response = await axios.get(url);
            return response.data;
        } catch (error) {
            console.error('Failed to get file info:', error);
            return null;
        }
    }

    async getEditUrl(shareId: string, permission: number = 17): Promise<string | null> {
        const url = `${this.proxyUrl}/v2/file/edit-url/${shareId}/${permission}`;
        try {
            const response = await axios.get(url);
            return response.data?.ocs.data.url || null;
        } catch (error) {
            console.error('Failed to get edit URL:', error);
            return null;
        }
    }

    async deleteFile(filePath: string): Promise<boolean> {
        const url = `${this.proxyUrl}/v2/file/delete`;
        try {
            const response = await axios.delete(url, { params: { path: filePath } });
            return response.data?.success || false;
        } catch (error) {
            console.error('Failed to delete file:', error);
            return false;
        }
    }
}

export default NextcloudFileManager;