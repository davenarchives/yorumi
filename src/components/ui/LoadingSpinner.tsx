import luffyGif from '../../assets/luffy.gif';

interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    text?: string;
}

export default function LoadingSpinner({ size = 'md', text }: LoadingSpinnerProps) {
    const sizeClasses = {
        sm: 'h-12 w-12', // Slightly larger for visibility
        md: 'h-24 w-24',
        lg: 'h-32 w-32',
    };

    return (
        <div className="flex flex-col items-center justify-center p-8">
            <img
                src={luffyGif}
                alt="Loading..."
                className={`object-contain ${sizeClasses[size]}`}
            />
            {text && <p className="mt-4 text-gray-400 text-sm font-bold animate-pulse">{text}</p>}
        </div>
    );
}
