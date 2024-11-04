export interface User {
    idx : number
    id: string;
    passwd: string;
    createdAt: string;
    updatedAt: string;
    name: string;
    email: string;
    role: number;
}

export interface ListUserItem {
    idx: number;
    id: string;
    name: string;
    email: string;
    role: number;
}
