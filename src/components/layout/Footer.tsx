import { Link, useLocation } from 'react-router-dom';
import { Github, Globe } from 'lucide-react';

const Footer = () => {
    const location = useLocation();

    // Determine active tab for styling (similar to App.tsx logic)
    // We can duplicate the logic or accept it as a prop. 
    // For simplicity/independence, let's derive it or default to generic.
    // Actually, checking URL is robust enough for the footer.
    const isManga = location.pathname.startsWith('/manga') ||
        location.search.includes('type=manga') ||
        location.search.includes('tab=continue-reading') ||
        location.search.includes('tab=readlist');

    const accentColor = isManga ? 'text-yorumi-manga' : 'text-yorumi-accent';
    const accentHover = isManga ? 'hover:text-yorumi-manga' : 'hover:text-yorumi-accent';
    const bgHover = isManga ? 'hover:bg-yorumi-manga' : 'hover:bg-yorumi-accent';

    const alphabets = ['All', '#', '0-9', ...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')];

    return (
        <footer className="relative bg-[#0a0a0a] pt-12 pb-8 border-t border-white/5 overflow-hidden">
            <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">
                {/* Top Section: Logo & Socials */}
                <div className="flex flex-col md:flex-row items-center justify-center md:justify-start gap-8 mb-10 border-b border-white/5 pb-8">
                    {/* Logo */}
                    <Link to={isManga ? '/manga' : '/'} className="flex items-center gap-2 group select-none">
                        <div className="flex items-center">
                            <span className="text-3xl font-black text-white tracking-tighter">YORU</span>
                            <span className={`text-3xl font-black ${accentColor} tracking-tighter transition-colors duration-300`}>MI</span>
                        </div>
                    </Link>

                    {/* Separator (Desktop only) */}
                    <div className="hidden md:block w-px h-8 bg-white/10"></div>

                    {/* Social Icons */}
                    <div className="flex items-center gap-4">
                        {/* GitHub */}
                        <a
                            href="https://github.com/davenarchives/Yorumi"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white transition-all duration-300 hover:bg-[#181717] hover:scale-110"
                            title="GitHub"
                        >
                            <Github size={20} fill="currentColor" strokeWidth={0} />
                        </a>

                        {/* AniSauce */}
                        <a
                            href="https://anisauce.vercel.app"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white transition-all duration-300 hover:bg-[#F97316] hover:scale-110"
                            title="AniSauce"
                        >
                            <Globe size={20} />
                        </a>
                    </div>
                </div>

                {/* A-Z List */}
                <div className="flex flex-col md:flex-row items-center md:items-baseline gap-4 mb-8 text-center md:text-left">
                    <span className="text-xl font-bold text-white shrink-0">A-Z LIST</span>
                    <span className="text-sm text-gray-400 border-l border-white/10 pl-4 h-full hidden md:flex items-center">
                        Searching {isManga ? 'manga' : 'anime'} order by alphabet name A to Z.
                    </span>
                    <span className="text-sm text-gray-400 md:hidden">
                        Searching order by alphabet name A to Z.
                    </span>
                </div>

                <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-10">
                    {alphabets.map((abc) => (
                        <Link
                            key={abc}
                            to={`/search?q=${encodeURIComponent(abc)}&type=${isManga ? 'manga' : 'anime'}`}
                            onClick={() => window.scrollTo({ top: 0, behavior: 'instant' })}
                            className={`px-2.5 py-1.5 rounded-lg text-sm font-semibold bg-white/5 text-gray-300 transition-all duration-200 ${bgHover} hover:text-white border border-transparent hover:border-white/10`}
                        >
                            {abc}
                        </Link>
                    ))}
                </div>

                {/* Bottom Links */}
                <div className="flex flex-wrap justify-center md:justify-start gap-x-8 gap-y-4 text-sm font-medium text-gray-300 mb-6 border-t border-white/5 pt-8">
                    <a href="#" className={`transition-colors ${accentHover}`}>Terms of service</a>
                    <a href="#" className={`transition-colors ${accentHover}`}>DMCA</a>
                    <a href="#" className={`transition-colors ${accentHover}`}>Contact</a>
                    <a href="#" className={`transition-colors ${accentHover}`}>Yorumi App</a>
                </div>

                {/* Disclaimer & Copyright */}
                <div className="space-y-2 text-xs text-gray-500 text-center md:text-left">
                    <p>
                        Yorumi does not store any files on our server, we only linked to the media which is hosted on 3rd party services.
                    </p>
                    <p>
                        © yorumi.vercel.app. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
