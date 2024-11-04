"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { User } from "@/types/user";
import { requestReadUser, requestUpdateUser } from "@/api/user"; // 업데이트 API 함수 추가

export default function UserEditPage() {
    const { idx } = useParams();
    const [user, setUser] = useState<User | null>(null);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const loadUser = async (idx: number) => {
        const result = await requestReadUser(idx);

        if (result.success && result.data) {
            setUser(result.data);
        } else {
            setError(result.message);
        }
    };

    useEffect(() => {
        loadUser(Number(idx));
    }, [idx]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); // 폼 제출 시 페이지 새로고침 방지

        if (user) {
            try {
                const result = await requestUpdateUser(Number(idx), user.name, user.email, user.role); // 업데이트 API 호출
                if (result.success) {
                    alert("유저 정보가 성공적으로 업데이트되었습니다.");
                    router.push("/user");
                } else {
                    setError(result.message);
                }
            } catch (error) {
                console.error(error);
                setError("유저 업데이트 중 오류가 발생했습니다.");
            }
        }
    };

    const handleCancel = () => {
        router.push("/user"); // 취소 버튼 클릭 시 유저 목록으로 돌아가기
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        setUser((prevUser) => {
            if (!prevUser) return null;

            // role 값이 숫자여야 하므로, select에서 값이 변경되면 숫자로 변환
            return { ...prevUser, [name]: name === "role" ? Number(value) : value };
        });
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-semibold">Edit User</h1>
            </div>

            {/* 오류 메시지 */}
            {error && <p className="text-red-500 mb-4">{error}</p>}

            {user ? (
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">ID</label>
                        <input
                            type="text"
                            name="id"
                            value={user.id}
                            onChange={handleChange}
                            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                            readOnly // ID는 수정 불가능하게 유지
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <button
                            className="bg-red-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-red-600 w-32 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75"
                        >
                            Reset
                        </button>
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Name</label>
                        <input
                            type="text"
                            name="name"
                            value={user.name}
                            onChange={handleChange}
                            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={user.email}
                            onChange={handleChange}
                            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Role</label>
                        <select
                            name="role"
                            value={user.role}
                            onChange={handleChange}
                            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                        >
                            <option value={0}>Admin</option>
                            <option value={1}>Engineer</option>
                        </select>
                    </div>

                    <div className="flex justify-end space-x-4 mt-6">
                        <button
                            type="submit"
                            className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 flex items-center"
                        >
                            Submit
                        </button>
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 flex items-center"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            ) : (
                <p>유저 정보를 불러오는 중입니다...</p>
            )}
        </div>
    );
}
