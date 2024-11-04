"use client"

import React, {useEffect, useState} from "react";
import {requestReadProof, requestUploadProof} from "@/api/proof";
import {useParams, useRouter} from "next/navigation";
import {Proof} from "@/types/proof";
import {ConvertFileToArrayBuffer} from "@/lib/convert";

export default function UploadPage() {
    const [proof, setProof] = useState<Proof | null>(null);
    const [, setIsLoading] = useState<boolean>(false);
    const [firstImage, setFirstImage] = useState<File | null>(null);
    const [secondImage, setSecondImage] = useState<File | null>(null);
    const [log, ] = useState<string>('');

    const { idx } = useParams(); // URL에서 아이템 ID 가져옴
    const router = useRouter();

    // 댓글 작성 처리 함수
    const handleSubmitUpload = async () => {
        if (firstImage && secondImage) {
            const firstImageData = await ConvertFileToArrayBuffer(firstImage)
            const secondImageData = await ConvertFileToArrayBuffer(secondImage)

            const result = await requestUploadProof(Number(idx), firstImageData, secondImageData, log)

            if (result.success) {
                alert("댓글이 성공적으로 등록되었습니다.");
                router.push(`/proof/${idx}`); // 댓글 작성 후 원래 페이지로 돌아감
            } else {
                alert("댓글 작성에 실패했습니다.");
            }
        }
    };

    const loadProof = async () => {
        const result = await requestReadProof(Number(idx)); // 아이템 ID로 데이터 불러옴
        if (result.success && result.data) {
            setProof(result.data);
        } else {
            alert("아이템을 불러오는 데 실패했습니다.");
        }
        setIsLoading(false);
    };

    useEffect(() => {
        if (idx) {
            loadProof(); // 아이템 로드
        }
    }, [idx]);

    // const item: ListItem = state.item; // 전달받은 아이템 데이터

    return (
        <div className="p-6 max-w-3xl mx-auto">
            <h2 className="text-2xl font-semibold mb-6">아이템 상세 정보 및 댓글 작성</h2>

            {/* 기존 아이템 정보 */}
            <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">Num</label>
                <p className="border border-gray-300 p-2 rounded-lg">{proof ? proof.num : null}</p>
            </div>

            <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">카테고리</label>
                <p className="border border-gray-300 p-2 rounded-lg">{proof ? proof.category : null}</p>
            </div>

            <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">설명</label>
                <p className="border border-gray-300 p-2 rounded-lg">{proof ? proof.description : null}</p>
            </div>

            {/* 댓글 입력 폼 */}
            <div className="mb-4">
                <form onSubmit={handleSubmitUpload}>
                    <label className="block text-gray-700 font-medium mb-2">첫번째 이미지</label>
                    <input type="file" onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                            setFirstImage(e.target.files[0]);
                        }
                    }}/>

                    <label className="block text-gray-700 font-medium mb-2">두번째 이미지</label>
                    <input type="file" onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                            setSecondImage(e.target.files[0]);
                        }
                    }}/>

                    <button type="submit">Upload Image</button>
                </form>
            </div>

            {/* 댓글 제출 버튼 */}
            <div className="mt-6">
                <button
                    onClick={handleSubmitUpload}
                    className="bg-blue-500 text-white p-2 rounded-lg w-full hover:bg-blue-600"
                >
                    Submit
                </button>
            </div>
        </div>
    );
}
