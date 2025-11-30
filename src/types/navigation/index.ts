export type NavigationItem = {
    path: string;
    component: React.FC;
    children?: Record<string, NavigationItem>;
};

export type NavigationStructure = Record<string, NavigationItem>;

export type NavigationList = {
    name: string;
    path: string;
    auth?: boolean;
    subject?: string;
    component: React.FC;
};
