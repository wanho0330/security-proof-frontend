import {createConnectTransport} from "@connectrpc/connect-web";
import {Code, ConnectError, createClient} from "@connectrpc/connect";
import {DashboardService} from "@buf/wanho_security-proof-api.connectrpc_es/api/v1/dashboard_connect";
import Cookies from "js-cookie";
import {
    CountUploadProof,
    NotConfirmProof,
    NotUploadProof
} from "@buf/wanho_security-proof-api.bufbuild_es/api/v1/dashboard_pb";

const dashboardTransport = createConnectTransport({
    baseUrl: "http://127.0.0.3:8082",
});

const dashboardClient = createClient(DashboardService, dashboardTransport);


interface responseReadDashboard {
    success: boolean,
    message: string,
    data?: {
        notConfirmProofs: NotConfirmProof[],
        notUploadProofs: NotUploadProof[],
        countUploadProofs: CountUploadProof[],
    }
}

export async function requestReadDashboard(): Promise<responseReadDashboard> {
    try {
        const accessToken = Cookies.get("accessToken");
        if (!accessToken) {
            return {success: false, message: "require access Token"}
        }

        const response = await dashboardClient.readDashboard({

        }, {headers: {"accessToken": accessToken}});

        if (!response.countUploadProofs) {
            return {success: false, message: "countUploadProof"}
        }

        return {
            success: true, message: "", data: {
                countUploadProofs: response.countUploadProofs,
                notUploadProofs: response.notUploadProofs,
                notConfirmProofs: response.notConfirmProofs,
            }
        }
    } catch (error) {
        const connectErr = ConnectError.from(error);
        let errorMessage = "An error occurred";

        if (connectErr.code === Code.NotFound) {
            errorMessage = "User not found";
        }
        return {success: false, message: errorMessage};
    }
}