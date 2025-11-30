export interface CorrespondenceType {
    corrId: string;
    contentRepositoryId: string | null;
    corrStatusPickListCode: string;
    corrStatusPickListDescription: string;
    corrTypePickListDescription: string;
    corrTypePickListCode: string;
    outboundTypePickListCode: string | null;
    outboundTypePickListDescription: string | null;
    correspondenceDate: string | null;
    creationDate: string;
    correspondenceNo: string;
    subject: string;
    sendingEntityDescription: string;
    hasAttachement: boolean;
    isDeleted: boolean;
    receivingEntityDescription: string[];
    receivingGroupDescription: string | null;
}
