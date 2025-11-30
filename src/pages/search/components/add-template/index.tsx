import { Button, Modal, Row, Spin, notification } from 'antd';
import { useLanguage } from '../../../../context/language';
import { CloudUploadOutlined } from '@ant-design/icons';
import { useRef, useState } from 'react';
import axios from 'axios';
import ENV from '../../../../constants/env';
import Storage from '../../../../lib/storage';
import LOCALSTORAGE from '../../../../constants/local-storage';

interface Props {
    onClose?: () => any;
    attachmentSize?: number;
    correspondence_id: string;
    contentRepositoryId: string;
}

export default function AddTemplate({ onClose, attachmentSize, correspondence_id, contentRepositoryId }: Props) {
    const { labels, isEnglish } = useLanguage();

    const [fileName, setFileName] = useState<string | null>(null);
    const [fileSize, setFileSize] = useState<number>(0);
    const [fileError, setFileError] = useState<string>('');
    const [isUploading, setIsUploading] = useState<boolean>(false); // New loading state
    const inputRef = useRef<HTMLInputElement | null>(null);

    const { til, btn } = labels;

    const handleFileChange = () => {
        const fileInput = inputRef.current;
        if (fileInput?.files && fileInput.files.length > 0) {
            const file = fileInput.files[0];
            setFileName(file.name);
            setFileSize(file.size);

            const maxFileSizeBytes = (attachmentSize || 0) * 1024 * 1024;
            if (file.size > maxFileSizeBytes) {
                setFileError(isEnglish ?
                    `File size exceeds the maximum allowed size of ${attachmentSize} MB.` :
                    `حجم الملف يتجاوز الحد الأقصى المسموح به وهو ${attachmentSize} ميغابايت.`
                );
            } else {
                setFileError('');
            }
        }
    };

    const handleFormatFileSize = (bytes: number): string => {
        if (bytes < 1024) return `${bytes}B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)}KB`;
        if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(2)}MB`;
        return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)}GB`;
    };

    const handleSubmit = async () => {
        if (fileError) return; // Do not proceed if there is a file error

        setIsUploading(true); // Set loading state to true before the upload starts

        const token = Storage.getItem(LOCALSTORAGE.LEGACY_ACCESS_TOKEN);
        const form = new FormData();
        const selectedFile = inputRef.current?.files?.[0];

        try {
            if (selectedFile) {
                form.append('file', selectedFile);
                await axios.post(
                    `${ENV.API_URL_LEGACY}/correspodence/out/newversion?corrId=${correspondence_id}&corrRepId=${contentRepositoryId}&name=${fileName}`,
                    form,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        },
                    }
                );
                // On success, show a success notification
                notification.success({
                    message: isEnglish ? 'File uploaded successfully' : 'تم رفع الملف بنجاح',
                    description: fileName,
                });
            }

            onClose && onClose();
        } catch (error) {
            console.error('Error uploading file:', error);
            // On error, show an error notification
            notification.error({
                message: isEnglish ? 'Error uploading file' : 'حدث خطأ أثناء رفع الملف',
                description: error instanceof Error ? error.message : 'Please try again later.',
            });
        } finally {
            setIsUploading(false); // Reset loading state after the upload process ends
        }
    };

    return (
        <Modal
            open={true}
            title={til.outbound_templates}
            onCancel={onClose}
            onClose={onClose}
            onOk={handleSubmit}
            okText={isUploading ? <Spin size="small" /> : btn.upload} // Show loading spinner in the button when uploading
            cancelText={btn.cancel}
            okButtonProps={{ disabled: isUploading || !!fileError }} // Disable "Upload" button during upload or when there is a file error
        >
            <Row align={'middle'} style={{ display: "flex", width: "100%" }}>
                <Button
                    type="primary"
                    onClick={() => inputRef.current?.click()}
                    style={{ backgroundColor: "green" }}
                    disabled={isUploading} // Disable the button while uploading
                >
                    <CloudUploadOutlined /> {btn.select_file}
                </Button>
            </Row>

            <div>
                <input
                    type="file"
                    accept='.pdf'
                    ref={inputRef}
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                />
                {fileName && <p>File Name: {fileName}</p>}
                {fileName && typeof fileSize === 'number' && handleFormatFileSize(fileSize) !== '0B' && <p>File Size: {handleFormatFileSize(fileSize)}</p>}
                {fileError && <p style={{ color: 'red' }}>{fileError}</p>}
            </div>
        </Modal>
    );
}
