"use client";

import React, {useState} from 'react';
import {FaBell, FaCog, FaEdit, FaSignOutAlt, FaUser} from 'react-icons/fa';
import {useRouter} from 'next/navigation';
import Cookies from "js-cookie";
import {requestSignOutUser} from "@/api/user";

export default function Header() {
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const router = useRouter();

    const handleLogout = async () => {
        await requestSignOutUser();
        Cookies.remove('accessToken');
        Cookies.remove('refreshToken');
        router.push('/login');
    };

    const handleEditProfile = () => {
        console.log('Editing profile');
        router.push('/edit-profile');
    };

    return (
        <header className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800"></h1>
            <div className="flex items-center space-x-4">
                {/* 알림 버튼 */}
                <button className="text-gray-600 hover:text-gray-800">
                    <FaBell size={24} />
                </button>

                {/* 설정 버튼 */}
                <div className="relative">
                    <button
                        className="text-gray-600 hover:text-gray-800"
                        onClick={() => {
                            setIsSettingsOpen(!isSettingsOpen);
                            setIsProfileMenuOpen(false);
                        }}
                    >
                        <FaCog size={24} />
                    </button>
                    {isSettingsOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg">
                            {/* 설정 메뉴 - 이곳에 추가적인 설정 메뉴를 넣을 수 있습니다 */}
                            <button className="w-full text-left py-2 px-4 text-gray-700 hover:bg-gray-200">
                                Settings Option 1
                            </button>
                            <button className="w-full text-left py-2 px-4 text-gray-700 hover:bg-gray-200">
                                Settings Option 2
                            </button>
                        </div>
                    )}
                </div>

                {/* 프로필 버튼 */}
                <div className="relative">
                    <button
                        className="text-gray-600 hover:text-gray-800"
                        onClick={() => {
                            setIsProfileMenuOpen(!isProfileMenuOpen);
                            setIsSettingsOpen(false);
                        }}
                    >
                        <FaUser size={24} />
                    </button>
                    {isProfileMenuOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg">
                            <button
                                className="w-full text-left py-2 px-4 text-gray-700 hover:bg-gray-200 flex items-center"
                                onClick={handleEditProfile}
                            >
                                <FaEdit className="mr-2" /> Edit Profile
                            </button>
                            <button
                                className="w-full text-left py-2 px-4 text-gray-700 hover:bg-gray-200 flex items-center"
                                onClick={handleLogout}
                            >
                                <FaSignOutAlt className="mr-2" /> Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
