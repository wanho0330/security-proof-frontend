"use client"

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import {Proof} from "@/types/proof";
import {
    requestConfirmProof, requestConfirmUpdateProof,
    requestDeleteProof,
    requestReadFirstImage,
    requestReadProof,
    requestReadSecondImage
} from "@/api/proof";



export default function ProofDetailPage() {
    const { idx } = useParams(); // URL에서 아이템 ID를 가져옴
    const [proof, setProof] = useState<Proof | null>(null); // 아이템 데이터를 저장할 상태
    const [isLoading, setIsLoading] = useState<boolean>(true); // 로딩 상태
    const [firstImage, setFirstImage] = useState<string>('');
    const [secondImage, setSecondImage] = useState<string>('');

    const router = useRouter();

    // 아이템 데이터 불러오기
    const loadProof = async () => {
        const result = await requestReadProof(Number(idx)); // 아이템 ID로 데이터 불러옴
        if (result.success && result.data) {
            setProof(result.data);

            if (result.data.uploadedAt !== "1970-01-01T00:00:00.000Z") {
                fetchFirstImage(result.data.idx);
                fetchSecondImage(result.data.idx)
            }
        } else {
            alert("아이템을 불러오는 데 실패했습니다.");
        }
        setIsLoading(false);
    };

    const fetchFirstImage = async (idx : number) => {
        if (proof?.uploadedAt === "1970-01-01T00:00:00.000Z") return;
        try {
            const response = await requestReadFirstImage(idx)
            if (!response) return;

            const blob = await response.blob(); // 이미지를 Blob으로 변환
            const imageUrl = URL.createObjectURL(blob); // Blob을 URL로 변환
            setFirstImage(imageUrl);

        } catch (error) {
            console.error('Error fetching image:', error);
        }
    };

    const fetchSecondImage = async (idx: number) => {
        if (proof?.uploadedAt === "1970-01-01T00:00:00.000Z") return;
        try {
            const response = await requestReadSecondImage(idx)
            if (!response) return;

            const blob = await response.blob(); // 이미지를 Blob으로 변환

            const imageUrl = URL.createObjectURL(blob); // Blob을 URL로 변환
            setSecondImage(imageUrl);
        } catch (error) {
            console.error('Error fetching image:', error);
        }
    };

    useEffect(() => {

        if (idx) {
            loadProof() // 아이템 로드
        }
    }, [idx]);


    const handleConfirmItem = async () => {
        if (confirm("컨펌 하시겠습니까?")) {
            if (proof && proof.tokenId) {
                const result = await requestConfirmUpdateProof(Number(idx));
                if (result.success) {
                    alert("아이템이 컨펌되었습니다.");
                    router.refresh(); // 페이지를 다시 렌더링
                } else {
                    alert("아이템 컨펌에 실패했습니다.");
                }
            } else {
                const result = await requestConfirmProof(Number(idx));
                if (result.success) {
                    alert("아이템이 컨펌되었습니다.");
                    router.refresh(); // 페이지를 다시 렌더링
                } else {
                    alert("아이템 컨펌에 실패했습니다.");
                }
            }
        }
    }


    // 아이템 삭제 처리 함수
    const handleDeleteItem = async () => {
        if (confirm("정말 삭제하시겠습니까?")) {
            const result = await requestDeleteProof(Number(idx));
            if (result.success) {
                alert("아이템이 삭제되었습니다.");
                router.push('/proof'); // 삭제 후 아이템 목록 페이지로 이동
            } else {
                alert("아이템 삭제에 실패했습니다.");
            }
        }
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!proof) {
        return <div>아이템을 찾을 수 없습니다.</div>;
    }

    return (
        <div className="p-6 max-w-3xl mx-auto">
            <h2 className="text-2xl font-semibold mb-6">아이템 상세 정보</h2>

            {/* Confirm */}
            <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">Confirm</label>
                <p className="border border-gray-300 p-2 rounded-lg">{proof.confirm ? '승인 되었습니다.' : '승인 전 입니다.'}</p>
            </div>

            {/* Num */}
            <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">Num</label>
                <p className="border border-gray-300 p-2 rounded-lg">{proof.num}</p>
            </div>

            {/* 카테고리 */}
            <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">카테고리</label>
                <p className="border border-gray-300 p-2 rounded-lg">{proof.category}</p>
            </div>

            {/* 설명 */}
            <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">설명</label>
                <p className="border border-gray-300 p-2 rounded-lg">{proof.description}</p>
            </div>

            {/* 업로드한 유저 */}
            <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">업로드한 유저</label>
                <p className="border border-gray-300 p-2 rounded-lg">{proof.uploadedUserId}</p>
            </div>

            {/* 이미지 */}
            {
                firstImage && (
                    <div className="mb-4">
                        <img
                            src={firstImage}
                            className="w-full h-auto rounded-lg border border-gray-300"
                            alt="First Image"
                        />
                    </div>
                )
            }

            {
                secondImage && (
                    <div className="mb-4">
                        <img
                            src={secondImage}
                            className="w-full h-auto rounded-lg border border-gray-300"
                            alt="Second Image"
                        />
                    </div>
                )
            }


            {/* 수정 및 삭제 버튼 */}
            <div className="flex justify-between mt-6 space-x-4">
                {proof.uploadedAt !== "1970-01-01T00:00:00.000Z" && (
                    <button
                        onClick={handleConfirmItem}
                        className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600 w-1/3 text-center"
                    >
                        Confirm
                    </button>
                )}
                <button
                    onClick={() => router.push(`/proof/${proof.idx}/edit`)}
                    className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 w-1/3 text-center"
                >
                    Edit
                </button>
                <button
                    onClick={() => router.push(`/proof/${proof.idx}/upload`)}
                    className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 w-1/3 text-center"
                >
                    Proof Upload
                </button>
                <button
                    onClick={handleDeleteItem}
                    className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 w-1/3 text-center"
                >
                    Delete
                </button>
            </div>
        </div>
    );
}