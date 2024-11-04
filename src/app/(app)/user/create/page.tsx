"use client"

import React, {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {requestCreateUser, requestDuplicateUser} from "@/api/user";

export default function CreateUserPage() {
    const [id, setId] = useState<string>("");
    const [passwd, setPasswd] = useState<string>("");
    const [name, setName] = useState<string>(""); // Name field
    const [email, setEmail] = useState<string>(""); // Email field
    const [role, setRole] = useState<number>(0); // Role field, default to engineer
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        // 폼 검증 (간단한 예시)
        if (!id || !passwd) {
            setError("ID와 비밀번호를 입력해주세요.");
            return;
        }

        setIsLoading(true);
        const result = await requestCreateUser(id, passwd, name, email, role);

        if (result.success) {
            router.push("/user");
        } else {
            setError(result.message);
        }

        setIsLoading(false);
    };


    const duplicateID = async (id : string) => {

        const result = await requestDuplicateUser(id);
        if (result.success) {
            setError(null);
        } else {
            setError(result.message);
        }
    }

    useEffect(() => {
        duplicateID(id);
    }, [id])

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-semibold mb-4">Create User</h1>

            {/* Display error message if any */}
            {error && <p className="text-red-500 mb-4">{error}</p>}

            {/* User creation form */}
            <form onSubmit={handleSubmit}>
                {/* ID input field */}
                <div className="mb-4">
                    <label htmlFor="id" className="block text-sm font-medium text-gray-700">
                        ID
                    </label>
                    <input
                        id="id"
                        type="text"
                        value={id}
                        onChange={(e) => setId(e.target.value)}
                        className={`mt-1 block w-full p-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        disabled={isLoading} // Disable if checking duplicate or loading
                    />
                </div>

                {/* Password input field */}
                <div className="mb-4">
                    <label htmlFor="passwd" className="block text-sm font-medium text-gray-700">
                        Password
                    </label>
                    <input
                        id="passwd"
                        type="password"
                        value={passwd}
                        onChange={(e) => setPasswd(e.target.value)}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={isLoading} // Disable if loading
                    />
                </div>

                {/* Name input field */}
                <div className="mb-4">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Name
                    </label>
                    <input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={isLoading} // Disable if loading
                    />
                </div>

                {/* Email input field */}
                <div className="mb-4">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email
                    </label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={isLoading} // Disable if loading
                    />
                </div>

                {/* Role selection */}
                <div className="mb-4">
                    <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                        Role
                    </label>
                    <select
                        id="role"
                        value={role}
                        onChange={(e) => setRole(parseInt(e.target.value))}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={isLoading} // Disable if loading
                    >
                        <option value={0}>Admin</option>
                        <option value={1}>Engineer</option>
                    </select>
                </div>


                {/* Submit button */}
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600"
                    disabled={isLoading } // Disable if loading, checking, or duplicate found
                >
                    {isLoading ? "Submitting..." : "Create User"}
                </button>
            </form>
        </div>
    );
}