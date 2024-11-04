"use client"

import React, {ChangeEvent, useEffect, useState} from "react";
import { useRouter } from "next/navigation";
import { FaEye, FaPlus } from "react-icons/fa";
import {ListProofItem} from "@/types/proof";
import {requestListProof} from "@/api/proof"; // 추가 버튼 아이콘

export default function ProofPage() {
    const [proofs, setProofs] = useState<ListProofItem[]>([]); // 데이터를 저장할 상태
    const [query, setQuery] = useState<string>(''); // 검색어 상태
    const [page, setPage] = useState<number>(1); // 현재 페이지
    const [total, ] = useState<number>(0); // 총 데이터 개수 (서버로부터 받아와야 함)
    const [isLoading, setIsLoading] = useState<boolean>(false); // 로딩 상태

    const router = useRouter();
    const rowsPerPage = 10; // 한 페이지에 보여줄 데이터 수

    const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
        setPage(1);
    };

    const loadProofs = async (query: string) => {
        setIsLoading(true);
        const result = await requestListProof(query);
        if (result.success && result.data) {
            setProofs(result.data);
        } else {
            setProofs([]);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        loadProofs(query);
    }, [query]);


    const handlePageChange = (newPage: number) => {
        setPage(newPage);
    };

    return (
        <div className="p-6">
            {/* 검색 입력 필드 */}
            <div className="flex justify-end items-center mb-4">
                <input
                    type="text"
                    placeholder="Category"
                    value={query}
                    onChange={handleSearch}
                    className="border border-gray-300 p-2 rounded-lg w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                    className="ml-4 bg-blue-500 text-white p-2 rounded-lg flex items-center hover:bg-blue-600"
                    onClick={() => router.push('/proof/create')}
                >
                    <FaPlus className="mr-2"/> Add Item
                </button>
            </div>

            {/* 아이템 테이블 */}
            <table className="w-full table-auto border-collapse border border-gray-300">
                <thead>
                <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-4 py-2 text-center w-16">Num</th>
                    <th className="border border-gray-300 px-4 py-2 text-center w-64">Category</th>
                    <th className="border border-gray-300 px-4 py-2 text-center">Desc</th>
                    <th className="border border-gray-300 px-4 py-2 text-center w-32">Is Uploaded</th>
                    <th className="border border-gray-300 px-4 py-2 text-center w-32">Is Confirmed</th>
                    <th className="border border-gray-300 px-4 py-2 text-center w-32">Manage</th>
                </tr>
                </thead>
                <tbody>
                {proofs.length > 0 ? (
                    proofs.map((proof) => (
                        <tr key={proof.idx}>
                            <td className="border border-gray-300 px-4 py-2 text-center">{proof.num}</td>
                            <td className="border border-gray-300 px-4 py-2 text-center">{proof.category}</td>
                            <td className="border border-gray-300 px-4 py-2">{proof.description}</td>
                            <td className="border border-gray-300 px-4 py-2 text-center">{proof.uploadedAt ? '미완료' : '완료'}</td>
                            <td className="border border-gray-300 px-4 py-2 text-center">{proof.confirm === 1 ? '확정' : '미확정'}</td>
                            <td className="border border-gray-300 px-4 py-2 text-center">
                                <button
                                    className="text-blue-500 hover:text-blue-700"
                                    onClick={() => router.push(`/proof/${proof.idx}`)}
                                    aria-label="View Details"
                                >
                                    <FaEye size={20}/>
                                </button>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                    <td colSpan={6} className="text-center py-4">
                            항목을 찾을 수 없습니다.
                        </td>
                    </tr>
                )}
                </tbody>
            </table>

            {/* 페이지네이션 */}
            {total > rowsPerPage && (
                <div className="flex justify-between items-center mt-4">
                    <button
                        className={`bg-gray-200 p-2 rounded-lg ${page === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-300'}`}
                        disabled={page === 1}
                        onClick={() => handlePageChange(page - 1)}
                    >
                        이전
                    </button>
                    <span>
                        {page} / {Math.ceil(total / rowsPerPage)}
                    </span>
                    <button
                        className={`bg-gray-200 p-2 rounded-lg ${page === Math.ceil(total / rowsPerPage) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-300'}`}
                        disabled={page === Math.ceil(total / rowsPerPage)}
                        onClick={() => handlePageChange(page + 1)}
                    >
                        다음
                    </button>
                </div>
            )}
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 rounded-lg">
                    <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12"></div>
                </div>
            )}
        </div>
    );
}