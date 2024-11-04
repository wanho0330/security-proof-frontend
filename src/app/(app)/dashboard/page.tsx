"use client"

import {requestReadDashboard} from "@/api/dashboard";
import {useEffect, useState} from "react";
import {
    CountUploadProof,
    NotConfirmProof,
    NotUploadProof
} from "@buf/wanho_security-proof-api.bufbuild_es/api/v1/dashboard_pb";
import {DonutChart, DonutChartEventProps} from "@/components/DonutChart";


export default function DashboardPage() {
    const [, setIsLoading] = useState<boolean>(false);

    const [notConfirmProofs, setNotConfirmProofs] = useState<NotConfirmProof[]>([])
    const [notUploadProofs, setNotUploadProofs] = useState<NotUploadProof[]>([])
    const [countUploadProofs, setCountUploadProofs] = useState<CountUploadProof[]>([]);



    const [chartValue, setChartValue] = useState<DonutChartEventProps>(null)

    const loadDashboard = async () => {
        setIsLoading(true)
        const result = await requestReadDashboard();
        if (result.success && result.data) {
            setNotConfirmProofs(result.data.notConfirmProofs)
            setNotUploadProofs(result.data.notUploadProofs)
            setCountUploadProofs(result.data.countUploadProofs)
        }
        setIsLoading(false)
    }

    useEffect(() => {
        loadDashboard()
    }, []);

    return (
        <div className="p-6">
            {/* 테이블 및 그래프 섹션 */}
            <div className="grid grid-cols-3 gap-4">
                {/* 좌측 테이블 섹션 */}
                <div className="col-span-2">
                    {/* 첫 번째 테이블: 컨펌이 안된 항목 */}
                    <h2 className="text-lg font-semibold mb-4">컨펌이 안된 항목</h2>
                    <table className="w-full table-auto border-collapse border border-gray-300 mb-8">
                        <thead>
                        <tr className="bg-gray-100">
                            <th className="border border-gray-300 px-4 py-2 text-center w-16">Num</th>
                            <th className="border border-gray-300 px-4 py-2 text-center w-64">카테고리</th>
                            <th className="border border-gray-300 px-4 py-2 text-center">생성자</th>
                            <th className="border border-gray-300 px-4 py-2 text-center">업로더</th>
                        </tr>
                        </thead>
                        <tbody>
                        {notConfirmProofs.length > 0 ? (
                            notConfirmProofs.map((item, index) => (
                                <tr key={index}>
                                    <td className="border border-gray-300 px-4 py-2 text-center">{item.num}</td>
                                    <td className="border border-gray-300 px-4 py-2 text-center">{item.category}</td>
                                    <td className="border border-gray-300 px-4 py-2 text-center">{item.createdUserId}</td>
                                    <td className="border border-gray-300 px-4 py-2 text-center">{item.uploadedUserId}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="text-center py-4">
                                    항목이 없습니다.
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>

                    {/* 두 번째 테이블: 증빙자료가 업로드 안된 항목 */}
                    <h2 className="text-lg font-semibold mb-4">증빙자료가 업로드 안된 항목</h2>
                    <table className="w-full table-auto border-collapse border border-gray-300">
                        <thead>
                        <tr className="bg-gray-100">
                            <th className="border border-gray-300 px-4 py-2 text-center w-16">Num</th>
                            <th className="border border-gray-300 px-4 py-2 text-center w-64">카테고리</th>
                            <th className="border border-gray-300 px-4 py-2 text-center">생성자</th>
                            <th className="border border-gray-300 px-4 py-2 text-center">업로더</th>
                        </tr>
                        </thead>
                        <tbody>
                        {notUploadProofs.length > 0 ? (
                            notUploadProofs.map((item, index) => (
                                <tr key={index}>
                                    <td className="border border-gray-300 px-4 py-2 text-center">{item.num}</td>
                                    <td className="border border-gray-300 px-4 py-2 text-center">{item.category}</td>
                                    <td className="border border-gray-300 px-4 py-2 text-center">{item.createdUserId}</td>
                                    <td className="border border-gray-300 px-4 py-2 text-center">{item.uploadedUserId}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="text-center py-4">
                                    항목이 없습니다.
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>

                {/* 우측 그래프 섹션 */}
                <div className="col-span-1">
                    <h2 className="text-lg font-semibold mb-4">대시보드 통계</h2>
                    <div className="bg-white p-4 rounded-lg shadow-lg">
                        <h3 className="text-md font-semibold mb-2">업로드/미업로드 비율</h3>
                        <div className="h-40 bg-gray-100">
                            <DonutChart data={countUploadProofs} category={"title"} value={"count"} onValueChange={(v) => setChartValue(v)} />
                            <pre className="mt-8 rounded-md bg-gray-950 p-3 text-sm text-white dark:bg-gray-800">
                                {JSON.stringify(chartValue, null, 2)}
                             </pre>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}