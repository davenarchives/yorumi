import { useNavigate } from 'react-router-dom';
import { User as UserIcon, History, Heart, LogOut, BookOpen } from 'lucide-react';

interface UserMenuProps {
    user: any;
    avatar: string | null;
    activeTab: 'anime' | 'manga';
    onLogin: () => void;
    onLogout: () => void;
}

export default function UserMenu({
    user,
    avatar,
    activeTab,
    onLogin,
    onLogout,
}: UserMenuProps) {
    const navigate = useNavigate();

    if (!user) {
        return (
            <button
                onClick={onLogin}
                className="bg-white/10 hover:bg-white/20 text-white border border-white/5 font-bold uppercase text-[10px] md:text-xs tracking-wider px-4 md:px-6 py-2 md:py-2.5 rounded transition-colors"
            >
                Login
            </button>
        );
    }

    return (
        <div className="relative group">
            <button className="flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full overflow-hidden border-2 border-transparent hover:border-yorumi-accent transition-all">
                {avatar ? (
                    <img src={avatar} alt="User Avatar" className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full bg-yorumi-main flex items-center justify-center text-white font-bold text-xs">
                        {user.displayName?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || 'U'}
                    </div>
                )}
            </button>

            {/* Dropdown Menu */}
            <div className="absolute right-0 mt-3 w-72 bg-[#1c1c1c] rounded-2xl shadow-2xl py-6 px-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 border border-white/5">
                {/* Header */}
                <div className="mb-6 px-2">
                    <div className="text-yorumi-accent font-bold text-lg">
                        {user.displayName?.split(' ')[0] || 'User'}
                    </div>
                    <div className="text-gray-400 text-sm truncate font-medium">
                        {user.email}
                    </div>
                </div>

                {/* Menu Items */}
                <div className="space-y-2">
                    <button
                        onClick={() => navigate('/profile?tab=profile')}
                        className="w-full flex items-center gap-3 px-4 py-3 bg-[#2a2a2a]/50 hover:bg-[#2a2a2a] text-gray-200 rounded-xl transition-all group/item"
                    >
                        <UserIcon className="w-5 h-5 text-gray-400 group-hover/item:text-white transition-colors" />
                        <span className="font-medium">Profile</span>
                    </button>

                    {activeTab === 'manga' ? (
                        <>
                            <button
                                onClick={() => navigate('/profile?tab=continue-reading')}
                                className="w-full flex items-center gap-3 px-4 py-3 bg-[#2a2a2a]/50 hover:bg-[#2a2a2a] text-gray-200 rounded-xl transition-all group/item"
                            >
                                <BookOpen className="w-5 h-5 text-gray-400 group-hover/item:text-white transition-colors" />
                                <span className="font-medium">Continue Reading</span>
                            </button>
                            <button
                                onClick={() => navigate('/profile?tab=readlist')}
                                className="w-full flex items-center gap-3 px-4 py-3 bg-[#2a2a2a]/50 hover:bg-[#2a2a2a] text-gray-200 rounded-xl transition-all group/item"
                            >
                                <BookOpen className="w-5 h-5 text-gray-400 group-hover/item:text-white transition-colors" />
                                <span className="font-medium">Read List</span>
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={() => navigate('/profile?tab=continue-watching')}
                                className="w-full flex items-center gap-3 px-4 py-3 bg-[#2a2a2a]/50 hover:bg-[#2a2a2a] text-gray-200 rounded-xl transition-all group/item"
                            >
                                <History className="w-5 h-5 text-gray-400 group-hover/item:text-white transition-colors" />
                                <span className="font-medium">Continue Watching</span>
                            </button>
                            <button
                                onClick={() => navigate('/profile?tab=watchlist')}
                                className="w-full flex items-center gap-3 px-4 py-3 bg-[#2a2a2a]/50 hover:bg-[#2a2a2a] text-gray-200 rounded-xl transition-all group/item"
                            >
                                <Heart className="w-5 h-5 text-gray-400 group-hover/item:text-white transition-colors" />
                                <span className="font-medium">Watch List</span>
                            </button>
                        </>
                    )}
                </div>

                {/* Logout Footer */}
                <div className="mt-6 flex justify-end">
                    <button
                        onClick={onLogout}
                        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm font-semibold"
                    >
                        Logout
                        <LogOut className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
