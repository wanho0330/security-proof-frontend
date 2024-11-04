import {createConnectTransport} from "@connectrpc/connect-web";
import {Code, ConnectError, createClient} from "@connectrpc/connect";
import {UserService} from "@buf/wanho_security-proof-api.connectrpc_es/api/v1/user_connect";
import Cookies from "js-cookie";
import {ListUserItem, User} from "@/types/user";
import {ConvertTimestampToString} from "@/lib/convert";

const userTransport = createConnectTransport({
    baseUrl: "http://127.0.0.1:8080",
});

const userClient = createClient(UserService, userTransport);

interface responseCreateUser {
    success: boolean,
    message: string,
    data?: number,
}

export async function requestCreateUser(id: string, passwd: string, name: string, email: string, role: number) : Promise<responseCreateUser> {
    try {

        const accessToken = Cookies.get("accessToken");
        if (!accessToken) {
            return {success: false, message: "require access Token"}
        }

        const response = await userClient.createUser({
            id: id,
            passwd: passwd,
            name: name,
            email: email,
            role: role,
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

interface responseReadUser {
    success: boolean,
    message: string,
    data? : User,
}

export async function requestReadUser(idx: number) : Promise<responseReadUser> {
    try {
        const accessToken = Cookies.get("accessToken");
        if (!accessToken) {
            return {success: false, message: "require access Token"}
        }

        const response = await userClient.readUser({
            idx: idx,
        }, {
            headers: {"accessToken": accessToken},
        })

        if (response.user) {
            return { success: true, message: "", data: {
                    createdAt: ConvertTimestampToString(response.user.createdAt),
                    email: response.user.email,
                    id: response.user.id,
                    idx: idx,
                    name: response.user.name,
                    passwd: response.user.passwd,
                    role: response.user.role,
                    updatedAt: ConvertTimestampToString(response.user.updatedAt)
                }}
        } else {
            return { success: false, message: "",}
        }
    } catch (error) {
        const connectErr = ConnectError.from(error);
        let errorMessage = "ID is duplicate";

        if (connectErr.code === Code.NotFound) {
            errorMessage = "User not found";
        }
        return { success: false, message: errorMessage };
    }
}

interface responseDuplicateUser {
    success: boolean,
    message: string,
    data?: null,
}

export async function requestDuplicateUser(id: string) : Promise<responseDuplicateUser> {
    try {
        await userClient.duplicateID({
            id: id,
        })
        return { success: true, message: "not duplicate user", }
    } catch (error) {
        const connectErr = ConnectError.from(error);
        let errorMessage = "ID is duplicate";

        if (connectErr.code === Code.NotFound) {
            errorMessage = "User not found";
        }
        return { success: false, message: errorMessage };
    }


}

interface responseUpdateUser {
    success: boolean,
    message: string,
    data?: number,
}

export async function requestUpdateUser(idx: number, name: string, email: string, role: number) : Promise<responseUpdateUser> {
    try {
        const accessToken = Cookies.get("accessToken");
        if (!accessToken) {
            return {success: false, message: "require access Token"}
        }

        const response = await userClient.updateUser({
            idx: idx,
            name: name,
            email: email,
            role: role,
        },
            {headers: {"accessToken": accessToken}});
        return {success: true,  message: "", data: response.idx, };

    } catch (error) {
        const connectErr = ConnectError.from(error);
        let errorMessage = "An error occurred";

        if (connectErr.code === Code.NotFound) {
            errorMessage = "User not found";
        }
        return {success: false, message: errorMessage};
    }
}


interface responseDeleteUser {
    success: boolean,
    message: string,
    data?: null,
}

export async function requestDeleteUser(idx: number) : Promise<responseDeleteUser> {
    try {
        const accessToken = Cookies.get("accessToken");
        if (!accessToken) {
            return {success: false, message: "require access Token"}
        }

        await userClient.deleteUser(
            {idx: idx},
            {headers: {accessToken: accessToken}});

        return { success: true, message: "delete successful" };

    } catch (error) {
        const connectErr = ConnectError.from(error);
        let errorMessage = "An error occurred";

        if (connectErr.code === Code.NotFound) {
            errorMessage = "User not found";
        }
        return { success: false, message: errorMessage };
    }
}



interface responseSignInUser {
    success: boolean,
    message: string,
    data?: null,
}

export async function requestSignInUser(id: string, passwd: string) : Promise<responseSignInUser> {
    try {
        const response = await userClient.signIn({
            id: id,
            passwd: passwd,
        });
        Cookies.set("accessToken", response.accessToken, {expires: 1 / 24, secure: false});
        Cookies.set("refreshToken", response.refreshToken, {expires: 3, secure: false});
        return { success: true, message: "Login successful" };

    } catch (error) {
        const connectErr = ConnectError.from(error);
        let errorMessage = "An error occurred";

        if (connectErr.code === Code.NotFound) {
            errorMessage = "User not found";
        }
        return { success: false, message: errorMessage };
    }
}


interface responseSignOutUser {
    success: boolean,
    message: string,
    data?: null,
}

export async function requestSignOutUser() : Promise<responseSignOutUser> {
    try {
        const accessToken = Cookies.get("accessToken");
        if (!accessToken) {
            return {success: false, message: "require access Token"}
        }
        await userClient.signOut(

            {headers: {"accessToken": accessToken}},
        );
        return { success: true, message: "loadUsers successful" };
    } catch (error) {
        const connectErr = ConnectError.from(error);
        let errorMessage = "An error occurred";

        if (connectErr.code === Code.NotFound) {
            errorMessage = "User not found";
        }
        return { success: false, message: errorMessage };

    }
}




interface responseListUsers {
    success: boolean,
    message: string,
    data?: ListUserItem[],
}

export async function requestListUsers(query: string) : Promise<responseListUsers> {

    try {
        const accessToken = Cookies.get("accessToken");
        if (!accessToken) {
            return {success: false, message: "require access Token"}
        }
        const response = await userClient.listUser(
            {id: query},
            {headers: {"accessToken": accessToken}},
        );
        return { success: true, message: "loadUsers successful", data: response.users };
    } catch (error) {
        const connectErr = ConnectError.from(error);
        let errorMessage = "An error occurred";

        if (connectErr.code === Code.NotFound) {
            errorMessage = "User not found";
        }
        return { success: false, message: errorMessage };

    }
}

interface responseRotationToken {
    success: boolean,
    message: string,
    data?: {
        accessToken: string;
        refreshToken: string;
    },
}

export async function requestRotationToken(refreshToken: string) : Promise<responseRotationToken> {
    try {
        const response = await userClient.rotationToken({}, {
            headers: {"refreshToken": refreshToken}
        });
        return {
            success: true,
            message: "Login successful",
            data: {accessToken: response.accessToken, refreshToken: response.refreshToken,}
        };
    } catch (error) {
        const connectErr = ConnectError.from(error);
        let errorMessage = "An error occurred";

        if (connectErr.code === Code.NotFound) {
            errorMessage = "User not found";
        }
        return { success: false, message: errorMessage };
    }
}