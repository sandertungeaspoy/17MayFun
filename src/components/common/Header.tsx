import ThemeToggle from './ThemeToggle';

interface HeaderProps {
    title: string;
    showBackButton?: boolean;
    onBack?: () => void;
}

const Header = ({ title, showBackButton = false, onBack }: HeaderProps) => {
    return (
        <header className="app-header">
            <div className="header-content">
                {showBackButton && (
                    <button
                        className="back-button"
                        onClick={onBack}
                        aria-label="Go back"
                    >
                        ←
                    </button>
                )}
                <h1>{title}</h1>
                <ThemeToggle />
            </div>
        </header>
    );
};

export default Header;
