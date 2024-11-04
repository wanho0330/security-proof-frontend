"use client";

import React, {useState} from "react";

import Modal from "@/components/Modal";
import {useRouter} from "next/navigation";
import {requestSignInUser} from "@/api/user";


export default function LoginPage() {
    const route = useRouter();

    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [id, setId] = useState<string>("");
    const [passwd, setPasswd] = useState<string>("");

    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [modalMessage, setModalMessage] = useState<string>("");

    const onLoginSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const result = await requestSignInUser(id, passwd);
        if (result.success) {
            route.push('/dashboard');
        } else {
            setModalMessage(result.message)
            setIsModalOpen(true);
        }
            setIsLoading(false);

    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-center text-gray-900">Login</h2>
                <form onSubmit={onLoginSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">ID</label>
                        <input
                            type="text"
                            value={id}
                            onChange={(e) => setId(e.target.value)}
                            required
                            className="mt-1 text-gray-900 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            value={passwd}
                            onChange={(e) => setPasswd(e.target.value)}
                            required
                            className="mt-1 text-gray-900 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                    <div>
                        <button
                            type="submit"
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            {isLoading ? "Loggin in..." : "Login" }
                        </button>
                    </div>
                </form>
                {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 rounded-lg">
                        <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12"></div>
                    </div>
                )}
            </div>
            <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)} message={modalMessage}  />
        </div>
    )
}

