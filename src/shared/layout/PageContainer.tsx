
import { FC, ReactNode } from 'react';

interface PageContainerProps {
    children: ReactNode;
    className?: string;
}

const PageContainer: FC<PageContainerProps> = ({ children, className = '' }) => {
    return (
        <div className={`container mx-auto px-4 ${className}`}>
            {children}
        </div>
    );
};

export default PageContainer;