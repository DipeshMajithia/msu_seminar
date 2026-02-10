import React from 'react';

interface CardProps {
    title?: string;
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
    hover?: boolean;
}

export const Card: React.FC<CardProps> = ({ title, children, className = '', onClick, hover = false }) => {
    return (
        <div 
            onClick={onClick}
            className={`
                bg-card text-card-foreground rounded-xl border border-border shadow-sm 
                p-6 transition-all duration-300
                ${hover ? 'hover:shadow-md hover:scale-[1.02] cursor-pointer' : ''}
                ${className}
            `}
        >
            {title && <h3 className="font-semibold text-lg mb-4 tracking-tight">{title}</h3>}
            {children}
        </div>
    );
};
