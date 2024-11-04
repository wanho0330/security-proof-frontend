"use client"

import React, {ChangeEvent, useEffect, useState} from "react";
import {useParams, useRouter} from "next/navigation"; // URL 파라미터 사용
import {ListUserItem} from "@/types/user";
import {Proof} from "@/types/proof";
import {requestListUsers} from "@/api/user";
import {requestReadProof, requestUpdateProof} from "@/api/proof";

export default function EditItemPage() {
    const [proof,setProof] = useState<Proof | null>(null); // 수정할 아이템 데이터
    const [num, setNum] = useState<string>(''); // Num 입력 상태
    const [category, setCategory] = useState<string>(''); // 카테고리 입력 상태
    const [description, setDescription] = useState<string>(''); // 설명 입력 상태
    const [selectedUserID, setSelectedUserID] = useState<string>(''); // 선택된 유저
    const [userList, setUserList] = useState<ListUserItem[]>([]); // 업로드할 유저 목록
    const [, setError] = useState<string>('');

    const {idx} = useParams(); // URL에서 아이템 ID 가져옴
    const router = useRouter();

    // 사용자 목록 불러오기
    const loadUsers = async () => {
        const result = await requestListUsers("");
        if (result.success && result.data) {
            setUserList(result.data);
        }
    };

    // 기존 아이템 불러오기
    const loadProof = async () => {
        const result = await requestReadProof(Number(idx));
        if (result.success && result.data) {
            const itemData = result.data;
            setProof(itemData);
            setNum(itemData.num);
            setCategory(itemData.category);
            setDescription(itemData.description);
            setSelectedUserID(itemData.uploadedUserId);
        } else {
            alert("아이템을 불러오는 데 실패했습니다.");
        }
    };

    useEffect(() => {
        if (idx) {
            loadProof(); // 페이지가 로드될 때 아이템 정보 로드
            loadUsers(); // 유저 목록 로드
        }
    }, [idx]);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); // 폼 제출 시 페이지 새로고침 방지
        if (proof) {
            try {
                const selectedUser = userList.find(user => user.id === selectedUserID);
                if (selectedUser) {
                    const result = await requestUpdateProof(Number(idx), category, description, selectedUser.idx, num); // 업데이트 API 호출
                    if (result.success) {
                        alert("정보가 성공적으로 업데이트되었습니다.");
                        router.push("/proof");
                    } else {
                        setError(result.message);
                    }
                }
            } catch (error) {
                console.error(error);
                setError("업데이트 중 오류가 발생했습니다.");
            }
        }
    };

    const handleCancel = () => {
        router.push("/proof"); // 취소 버튼 클릭 시 목록으로 돌아가기
    };

    return (
        <div className="p-6 max-w-3xl mx-auto">
            <h2 className="text-2xl font-semibold mb-6">Edit Proof</h2>

            {
                proof ? (
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-gray-700 font-medium mb-2">Num</label>
                            <input
                                type="text"
                                value={num}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => setNum(e.target.value)}
                                className="border border-gray-300 p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="번호를 입력하세요"
                            />
                        </div>

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

                        <div className="mb-4">
                            <label className="block text-gray-700 font-medium mb-2">설명</label>
                            <textarea
                                value={description}
                                onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
                                className="border border-gray-300 p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="설명을 입력하세요"
                                rows={5}
                            />
                        </div>

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

                        <div className="mt-6 flex space-x-4">
                            <button
                                type="submit"
                                className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 flex items-center justify-center"
                            >
                                Submit
                            </button>
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 flex items-center justify-center"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>) : (
                    <p>항목 정보를 불러오는 중입니다...</p>
                )
            }
        </div>
    );
}
