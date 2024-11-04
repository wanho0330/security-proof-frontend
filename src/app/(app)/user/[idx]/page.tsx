"use client";

import { useState, useEffect } from "react";
import {useParams, useRouter} from "next/navigation";
import { FaEdit, FaTrash } from "react-icons/fa";
import {User} from "@/types/user";
import {requestDeleteUser, requestReadUser} from "@/api/user";


export default function UserDetailPage() {
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
    }

    useEffect(() => {
        loadUser(Number(idx))
    }, [idx]);

    const handleEdit = () => {
        router.push(`/user/${idx}/edit`);
    };

    const handleDelete = async () => {
        const confirmDelete = confirm("정말로 이 유저를 삭제하시겠습니까?");
        if (confirmDelete) {
            try {
                // 유저 삭제 요청 (API 요청으로 대체)
                // await fetch(`/api/user/${user.id}`, { method: 'DELETE' });

                await requestDeleteUser(Number(idx));
                alert("유저가 성공적으로 삭제되었습니다.");
                router.push(`/user`);

            } catch (error) {
                console.error(error);
                setError("유저 삭제 중 오류가 발생했습니다.");
            }
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-semibold">User Detail</h1>

                {/* 수정 및 삭제 버튼 */}
                <div className="flex space-x-4">
                    <button
                        onClick={handleEdit}
                        className="bg-yellow-500 text-white p-2 rounded-lg hover:bg-yellow-600 flex items-center"
                    >
                        <FaEdit className="mr-2" /> Edit
                    </button>
                    <button
                        onClick={handleDelete}
                        className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 flex items-center"
                    >
                        <FaTrash className="mr-2" /> Delete
                    </button>
                </div>
            </div>

            {/* 오류 메시지 */}
            {error && <p className="text-red-500 mb-4">{error}</p>}

            {user ? (
                <div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">ID</label>
                        <p className="mt-1 p-2 border border-gray-300 rounded-md bg-gray-100">{user.id}</p>
                    </div>


                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Name</label>
                        <p className="mt-1 p-2 border border-gray-300 rounded-md bg-gray-100">{user.name}</p>
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <p className="mt-1 p-2 border border-gray-300 rounded-md bg-gray-100">{user.email}</p>
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Role</label>
                        <p className="mt-1 p-2 border border-gray-300 rounded-md bg-gray-100">
                            {user.role === 0 ? 'Admin' : 'Engineer'}
                        </p>
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Created At</label>
                        <p className="mt-1 p-2 border border-gray-300 rounded-md bg-gray-100">{user.createdAt}</p>
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Updated At</label>
                        <p className="mt-1 p-2 border border-gray-300 rounded-md bg-gray-100">{user.updatedAt}</p>
                    </div>
                </div>
            ) : (
                <p>유저 정보를 불러오는 중입니다...</p>
            )}
        </div>
    );
}