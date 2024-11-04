import {createConnectTransport} from "@connectrpc/connect-web";
import {Code, ConnectError, createClient} from "@connectrpc/connect";
import {ProofService} from "@buf/wanho_security-proof-api.connectrpc_es/api/v1/proof_connect";
import {ListProofItem, Proof} from "@/types/proof";
import {ConvertTimestampToString} from "@/lib/convert";
import Cookies from "js-cookie";

const proofTransport = createConnectTransport({
    baseUrl: "http://127.0.0.2:8081",
});

const proofClient = createClient(ProofService, proofTransport);

interface responseCreateProof {
    success: boolean,
    message: string,
    data?: number,
}

export async function requestCreateProof(category: string, description: string, uploadUserIdx: number, num:string) : Promise<responseCreateProof> {
    try {
        const accessToken = Cookies.get("accessToken");
        if (!accessToken) {
            return {success: false, message: "require access Token"}
        }


        const response = await proofClient.createProof({
            category:category,
            description:description,
            uploadedUserIdx:uploadUserIdx,
            num:num,
        }, {
            headers: {"accessToken": accessToken},
        })

        return { success: true, message: "", data: response.idx };
    } catch (error) {
        const connectErr = ConnectError.from(error);
        let errorMessage = "An error occurred";

        if (connectErr.code === Code.NotFound) {
            errorMessage = "User not found";
        }
        return { success: false, message: errorMessage };
    }
}

interface responseReadProof {
    success: boolean,
    message: string,
    data?: Proof,
}

export async function requestReadProof(idx: number) : Promise<responseReadProof> {
    try {
        const accessToken = Cookies.get("accessToken");
        if (!accessToken) {
            return {success: false, message: "require access Token"}
        }


        const response = await proofClient.readProof({
            idx: idx
        }, {
            headers: {"accessToken": accessToken},
        })

        if (response.proof) {
            return {
                success: true, message: "", data: {
                    idx: response.proof.idx,
                    num: response.proof.num,
                    category: response.proof.category,
                    description: response.proof.description,
                    createdUserIdx: response.proof.createdUserIdx,
                    createdAt: ConvertTimestampToString(response.proof.createdAt),
                    updatedUserIdx: response.proof.updatedUserIdx,
                    updatedAt: ConvertTimestampToString(response.proof.updatedAt),
                    uploadedUserIdx: response.proof.uploadedUserIdx,
                    uploadedUserId: response.proof.uploadedUserId,
                    uploadedAt: ConvertTimestampToString(response.proof.uploadedAt),
                    confirm: response.proof.confirm,
                }
            };

        } else {
            return {
                success: false, message: "",
            }
        }
    } catch (error) {
        const connectErr = ConnectError.from(error);
        let errorMessage = "An error occurred";

        if (connectErr.code === Code.NotFound) {
            errorMessage = "User not found";
        }
        return { success: false, message: errorMessage };
    }
}


interface responseUpdateProof {
    success: boolean,
    message: string,
    data?: number,
}

export async function requestUpdateProof(idx: number, category: string, description: string, uploadUserIdx: number, num:string) : Promise<responseUpdateProof> {
    try {
        const accessToken = Cookies.get("accessToken");
        if (!accessToken) {
            return {success: false, message: "require access Token"}
        }

        const response = await proofClient.updateProof({
            idx:idx,
            category:category,
            description:description,
            uploadedUserIdx:uploadUserIdx,
            num:num,
        }, {
            headers: {"accessToken":accessToken}
        })

        return { success: true, message: "", data: response.idx };
    } catch (error) {
        const connectErr = ConnectError.from(error);
        let errorMessage = "An error occurred";

        if (connectErr.code === Code.NotFound) {
            errorMessage = "User not found";
        }
        return { success: false, message: errorMessage };
    }
}

interface responseDeleteProof {
    success: boolean,
    message: string,
    data?: null
}

export async function requestDeleteProof(idx: number) : Promise<responseDeleteProof> {
    try {
        const accessToken = Cookies.get("accessToken");
        if (!accessToken) {
            return {success: false, message: "require access Token"}
        }

        await proofClient.deleteProof({
            idx: idx
        }, {
            headers: {"accessToken": accessToken},
        })

        return { success: true, message: "" };
    } catch (error) {
        const connectErr = ConnectError.from(error);
        let errorMessage = "An error occurred";

        if (connectErr.code === Code.NotFound) {
            errorMessage = "User not found";
        }
        return { success: false, message: errorMessage };
    }
}

interface responseListProof {
    success: boolean,
    message: string,
    data?: ListProofItem[]
}

export async function requestListProof(category: string) : Promise<responseListProof> {
    try {
        const accessToken = Cookies.get("accessToken");
        if (!accessToken) {
            return {success: false, message: "require access Token"}
        }

        const response = await proofClient.listProof(
            {
                category: category,
            }, {
                headers: {"accessToken":accessToken}
            }
        );

        const data: ListProofItem[] = response.proofs.map(proof => ({
            idx: proof.idx,
            num: proof.num,
            category: proof.category,
            description: proof.description,
            uploadedAt: ConvertTimestampToString(proof.uploadedAt), // uploadedAt을 string으로 변환
            confirm: proof.confirm,

        }));

        return { success: true, message: "loadUsers successful", data: data};
    } catch (error) {
        const connectErr = ConnectError.from(error);
        let errorMessage = "An error occurred";

        if (connectErr.code === Code.NotFound) {
            errorMessage = "User not found";
        }
        return { success: false, message: errorMessage };

    }
}


interface responseUploadProof {
    success: boolean,
    message: string,
    data?: number,
}

export async function requestUploadProof(idx: number, firstImage: Uint8Array, secondImage: Uint8Array, logPath: string) : Promise<responseUploadProof> {
    try {
        const accessToken = Cookies.get("accessToken");
        if (!accessToken) {
            return {success: false, message: "require access Token"}
        }

        const response = await proofClient.uploadProof({
            idx:idx,
            firstImage:firstImage,
            secondImage:secondImage,
            log: logPath,
        }, {
            headers: {"accessToken": accessToken},
        })


        return { success: true, message: "", data: response.idx };
    } catch (error) {
        const connectErr = ConnectError.from(error);
        let errorMessage = "An error occurred";

        if (connectErr.code === Code.NotFound) {
            errorMessage = "User not found";
        }
        return { success: false, message: errorMessage };
    }
}


export async function requestReadFirstImage(idx: number) : Promise<Response | void> {
    try {
        const accessToken = Cookies.get("accessToken");
        if (!accessToken) {
            throw new Error('Failed to fetch image');
        }

        const response = await fetch(`http://127.0.0.2:8081/apiv1/readFirstImage/${idx}`, {
            headers: {"accessToken": accessToken}
        });

        if (!response.ok) {
            throw new Error('Failed to fetch image');
        }

        return response;
    } catch(error) {
        console.error('Error fetching image:', error);
    }

}

export async function requestReadSecondImage(idx: number) : Promise<Response | void> {
    try {
        const accessToken = Cookies.get("accessToken");
        if (!accessToken) {
            throw new Error('Failed to fetch image');
        }

        const response = await fetch(`http://127.0.0.2:8081/apiv1/readSecondImage/${idx}`, {
            headers: {"accessToken": accessToken}
        });

        if (!response.ok) {
            throw new Error('Failed to fetch image');
        }

        return response;
    } catch(error) {
        console.error('Error fetching image:', error);
    }

}

interface responseConfirmProof {
    success: boolean,
    message: string,
    data?: string,
}

export async function requestConfirmProof(idx: number) : Promise<responseConfirmProof> {
    try {
        const accessToken = Cookies.get("accessToken");
        if (!accessToken) {
            return {success: false, message: "require access Token"}
        }

       await proofClient.confirmProof({
            idx:idx,
        }, {
            headers: {"accessToken": accessToken},
        })


        return { success: true, message: "" };
    } catch (error) {
        const connectErr = ConnectError.from(error);
        let errorMessage = "An error occurred";

        if (connectErr.code === Code.NotFound) {
            errorMessage = "User not found";
        }
        return { success: false, message: errorMessage };
    }
}

interface responseConfirmUpdateProof {
    success: boolean,
    message: string,
    data?: string,
}

export async function requestConfirmUpdateProof(idx: number) : Promise<responseConfirmUpdateProof> {
    try {
        const accessToken = Cookies.get("accessToken");
        if (!accessToken) {
            return {success: false, message: "require access Token"}
        }

        await proofClient.confirmUpdateProof({
            idx:idx,
        }, {
            headers: {"accessToken": accessToken},
        })


        return { success: true, message: "" };
    } catch (error) {
        const connectErr = ConnectError.from(error);
        let errorMessage = "An error occurred";

        if (connectErr.code === Code.NotFound) {
            errorMessage = "User not found";
        }
        return { success: false, message: errorMessage };
    }
}