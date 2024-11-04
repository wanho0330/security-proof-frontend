"use client"

import React, {ChangeEvent, useEffect, useState} from "react";
import {ListUserItem,} from "@/types/user";
import {requestCreateProof} from "@/api/proof";
import {useRouter} from "next/navigation";
import {requestListUsers} from "@/api/user";


export default function CreateItemPage() {
    const [num, setNum] = useState<string>(''); // Num 입력 상태
    const [category, setCategory] = useState<string>(''); // 카테고리 입력 상태
    const [description, setDescription] = useState<string>(''); // 설명 입력 상태
    const [userList, setUserList] = useState<ListUserItem[]>([]); // 셀렉트 박스에서 사용할 유저 리스트
    const [selectedUserID, setSelectedUserID] = useState<string>(''); // 선택된 유저
    const [isLoading,] = useState<boolean>(false);
    const [,setError] = useState<string>('');

    const router = useRouter();


    // 사용자 목록 불러오기
    const loadUsers = async () => {
        const result = await requestListUsers("");
        if (result.success && result.data) {
            setUserList(result.data);
        }
    };

    useEffect(() => {
        loadUsers(); // 페이지가 로드될 때 사용자 목록 불러옴
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {


        e.preventDefault(); // 폼 제출 시 페이지 새로고침 방지

        try {
            const selectedUser = userList.find(user => user.id === selectedUserID);

            if (selectedUser) {
                const result = await requestCreateProof(category, description, selectedUser.idx, num); // 업데이트 API 호출
                if (result.success) {
                    alert("성공적으로 생성되었습니다.");
                    router.push("/proof");
                } else {
                    setError(result.message);
                }
            }
        } catch (error) {
            console.error(error);
            setError("업데이트 중 오류가 발생했습니다.");
        }

    };

    return (
        <div className="p-6 max-w-3xl mx-auto">
            <h2 className="text-2xl font-semibold mb-6">아이템 생성</h2>
            <form onSubmit={handleSubmit}>
                {/* Num 입력 */}
                <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">Num</label>
                    <input
                        type="text"
                        value={num}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setNum(e.target.value)}
                        className="border border-gray-300 p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="아이템 번호를 입력하세요"
                    />
                </div>

                {/* 카테고리 입력 */}
                <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">카테고리</label>
                    <input
                        type="text"
                        value={category}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setCategory(e.target.value)}
                        className="border border-gray-300 p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="카테고리를 입력하세요"
                    />
                </div>

                {/* 설명 입력 */}
                <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">설명</label>
                    <textarea
                        value={description}
                        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
                        className="border border-gray-300 p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="아이템 설명을 입력하세요"
                        rows={5}
                    />
                </div>

                {/* 업로드할 유저 선택 */}
                <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">업로드할 유저</label>
                    <select
                        value={selectedUserID}
                        onChange={(e: ChangeEvent<HTMLSelectElement>) => setSelectedUserID(e.target.value)}
                        className="border border-gray-300 p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">유저를 선택하세요</option>
                        {userList.map(user => (
                            <option key={user.idx} value={user.id}>
                                {user.id} / {user.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* 생성 버튼 */}
                <div className="mt-6">
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600"
                        disabled={isLoading} // Disable if loading, checking, or duplicate found
                    >
                        {isLoading ? "Submitting..." : "Create Proof"}
                    </button>
                </div>
            </form>
        </div>
    );
}