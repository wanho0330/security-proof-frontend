export interface Proof {
    idx: number
    num: string;
    category: string;
    description: string;
    createdUserIdx: number;
    createdAt: string;
    updatedUserIdx: number;
    updatedAt: string;
    uploadedUserIdx: number;
    uploadedUserId: string;
    uploadedAt: string;
    confirm: number;
    tokenId?: number;
}

export interface ListProofItem {
    idx: number
    num: string;
    category: string;
    description: string;
    uploadedAt: string;
    confirm: number;
}

