"use client"; // 클라이언트 컴포넌트로 지정

import React from 'react';
import { useRouter } from 'next/navigation';

export default function Sidebar() {
    const router = useRouter();

    return (
        <aside className="w-64 bg-white shadow-md h-screen p-6"> {/* h-full을 h-screen으로 변경 */}
            <nav className="space-y-4">
                <button
                    className="w-full text-left py-2 px-4 text-gray-700 hover:bg-gray-200 rounded"
                    onClick={() => router.push('/dashboard')}
                >
                    Dashboard
                </button>
                <button
                    className="w-full text-left py-2 px-4 text-gray-700 hover:bg-gray-200 rounded"
                    onClick={() => router.push('/proof')}
                >
                    Security Proof
                </button>
                <button
                    className="w-full text-left py-2 px-4 text-gray-700 hover:bg-gray-200 rounded"
                    onClick={() => router.push('/user')}
                >
                    User
                </button>
            </nav>
        </aside>
    );
}
