import React, { useEffect, useState } from 'react';
import { Dropdown, Menu, Button, Modal, message } from 'antd';
import { DownOutlined, LoadingOutlined } from '@ant-design/icons';
import { TextField } from '@mui/material';
import { useLanguage } from '../../../../context/language';
import { createComment, downloadCorrespondence, getCanDeletePermission, getCanUploadNewVersionPermission } from '../../service';
import Storage from '../../../../lib/storage';
import LOCALSTORAGE from '../../../../constants/local-storage';
import { decodeJWT } from '../../../../lib/jwt';
import AddTemplate from '../add-template';
import { useTheme } from '../../../../context/theme';

interface Props {
    corrId: string;
    contentRepositoryId: string
}

const ActionDropdown: React.FC<Props> = ({ corrId, contentRepositoryId }) => {
    const { labels, isEnglish } = useLanguage();
    const { theme } = useTheme()
    const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
    const [isCommentModalVisible, setCommentModalVisible] = useState(false);
    const [newDocument, setNewDocument] = useState<{
        correspondence_id: string,
        contentRepositoryId: string
    } | undefined>(undefined)
    const [comment, setComment] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [permissionLoading, setPermissionLoading] = useState<boolean>(false);


    const [permissions, setPermissions] = useState<{
        canDelete: boolean | undefined,
        canUpload: boolean | undefined
    }>({
        canDelete: undefined,
        canUpload: undefined
    });

    const [isOpen, setIsOpen] = useState<boolean>(false)

    useEffect(() => {
        if (isOpen && (!permissions.canDelete || !permissions.canUpload)) {
            const fetchPermissions = async () => {
                setPermissionLoading(() => true)
                try {
                    const [canUpload, canDelete] = await Promise.all([
                        getCanUploadNewVersionPermission(corrId),
                        getCanDeletePermission(corrId),
                    ]);

                    setPermissions({ canUpload, canDelete });
                } catch (error) {
                    console.error(error);
                    message.error(isEnglish ? 'Failed to load permissions.' : 'فشل في تحميل الأذونات.');
                } finally {
                    setPermissionLoading(() => false)
                }
            };

            fetchPermissions();
        }
    }, [corrId, isEnglish, isOpen]);

    const handleDelete = () => {
        setDeleteModalVisible(true);
    };

    const confirmDelete = async () => {
        setLoading(true);
        try {
            setDeleteModalVisible(false);
            message.success(isEnglish ? 'Deleted successfully.' : 'تم الحذف بنجاح.');
        } catch (error) {
            console.error(error);
            message.error(isEnglish ? 'Failed to delete.' : 'فشل في الحذف.');
        } finally {
            setLoading(false);
        }
    };

    const cancelDelete = () => {
        setDeleteModalVisible(false);
    };

    const handleAddComment = () => {
        setCommentModalVisible(true);
    };

    const handleCommentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setComment(e.target.value);
    };

    const submitComment = async () => {
        if (comment.trim() === '') {
            message.error(isEnglish ? 'Message cannot be empty.' : 'الرسالة لا يمكن أن تكون فارغة.');
            return;
        }

        setLoading(true);
        try {
            const token = Storage.getItem(LOCALSTORAGE.LEGACY_ACCESS_TOKEN);
            const UserID = decodeJWT(token as string).payload.AuthenticatedUserInformation.userId;

            const response = await createComment({
                correspondenceId: corrId,
                description: comment,
                ownerUser: UserID,
            });

            if (response) {
                message.success(isEnglish ? 'Comment added successfully.' : 'تم إضافة التعليق بنجاح.');
            } else {
                throw new Error('Failed to add comment.');
            }

            setComment('');
            setCommentModalVisible(false);
        } catch (error) {
            console.error(error);
            message.error(isEnglish ? 'Failed to add comment.' : 'فشل في إضافة التعليق.');
        } finally {
            setLoading(false);
        }
    };

    const cancelComment = () => {
        setCommentModalVisible(false);
    };

    // **Handle Download Latest Version with Loading and Messages**
    const handleDownloadLatestVersion = async () => {
        setLoading(true);
        try {
            const response: boolean = await downloadCorrespondence(corrId);
            if (response) {
                message.success(isEnglish ? 'Download started.' : 'بدأ التحميل.');
            } else {
                throw new Error('Download initiation failed');
            }
        } catch (error) {
            console.error(error);
            const errorMessage = error instanceof Error ? error?.message : 'Failed to start download.';
            message.error(isEnglish ? errorMessage : 'فشل في بدء التحميل.');
        } finally {
            setLoading(false);
        }
    };

    const handleImportNewVersion = async () => {
        setLoading(true);
        try {

            setNewDocument({
                contentRepositoryId,
                correspondence_id: corrId
            })

        } catch (error) {
            console.error(error);
            const errorMessage = error instanceof Error ? error?.message : 'Failed to import new version.';
            message.error(isEnglish ? errorMessage : 'فشل في استيراد النسخة الجديدة.');
        } finally {
            setLoading(false);
        }
    };

    const menu = (
        <Menu>
            <Menu.Item disabled={!permissions.canDelete} key="delete" onClick={handleDelete}>
                {permissionLoading ? <LoadingOutlined /> : labels.btn.delete}
            </Menu.Item>
            <Menu.Item key="add-comment" onClick={handleAddComment}>
                {labels.til.AddComment}
            </Menu.Item>
            <Menu.Item key="download" onClick={handleDownloadLatestVersion}>
                {labels.btn.corres_download_latest}
            </Menu.Item>
            <Menu.Item disabled={!permissions.canUpload} key="import" onClick={handleImportNewVersion}>
                {permissionLoading ? <LoadingOutlined /> : labels.btn.import_new_version}
            </Menu.Item>
        </Menu>
    );

    return (
        <>
            <div>
                {newDocument && <AddTemplate contentRepositoryId={newDocument.contentRepositoryId} correspondence_id={newDocument.correspondence_id} attachmentSize={80} onClose={() => setNewDocument(() => undefined)} />}

                <Dropdown overlay={menu} onOpenChange={e => setIsOpen(() => e)

                }>
                    <Button type='primary' style={{ backgroundColor: theme.colors.accent }} loading={loading}>
                        {isEnglish ? 'Actions' : 'الإجراءات'} <DownOutlined />
                    </Button>
                </Dropdown>

                <Modal
                    title={isEnglish ? 'Confirm Delete' : 'تأكيد الحذف'}
                    visible={isDeleteModalVisible}
                    onOk={confirmDelete}
                    onCancel={cancelDelete}
                    confirmLoading={loading}
                    okText={isEnglish ? 'OK' : 'موافق'}
                    cancelText={isEnglish ? 'Cancel' : 'إلغاء'}
                >
                    <p>{labels.msg.are_you_sure}</p>
                </Modal>

                <Modal
                    title={isEnglish ? 'Add Comment' : 'إضافة تعليق'}
                    visible={isCommentModalVisible}
                    onOk={submitComment}
                    onCancel={cancelComment}
                    confirmLoading={loading}
                    okText={isEnglish ? 'OK' : 'موافق'}
                    cancelText={isEnglish ? 'Cancel' : 'إلغاء'}
                >
                    <TextField
                        label={isEnglish ? 'Comment' : 'التعليق'}
                        variant="standard"
                        fullWidth
                        value={comment}
                        onChange={handleCommentChange}
                    />
                </Modal>
            </div ></>

    );
};

export default ActionDropdown;
