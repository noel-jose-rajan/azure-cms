export interface AnnouncementGroupType {
    id: number;
    type: string;
    isActive: boolean;
    groupId: number;
    groupCode: string;
    name: string;
    nameAr: string;
    email: string;
    active: boolean;
    allUsers: boolean;
    desc: string;
    usersIdsList: number[];
    Users: any | null;
}