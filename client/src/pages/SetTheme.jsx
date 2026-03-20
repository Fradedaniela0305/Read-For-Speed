import "../App.css";
import "../styles/setTheme.css";

export default function SetTheme({ theme, setTheme }) {

    const themes = [
        {
            id: "fantasy",
            name: "Fantasy",
            description: "Warm candlelight, gold accents, and enchanted study vibes.",
        },
        {
            id: "ashen",
            name: "Dark Fantasy",
            description: "Ash, iron, and solemn ruined-kingdom energy.",
        },
        {
            id: "nature",
            name: "Nature",
            description: "Forest greens, shrine light, and sacred grove calm.",
        },
        {
            id: "arcane",
            name: "Arcane Library",
            description: "Ancient tomes, violet glow, and magical academia.",
        },
        {
            id: "horror",
            name: "Horror",
            description: "Gothic shadows, bone text, and unsettling silence.",
        },
    ];

    return (
        <div className="theme-panel">
            <h2 className="theme-panel-title">Choose Your Realm</h2>
            <p className="theme-panel-subtitle">
                Let your reading live in a world that suits it.
            </p>

            <div className="theme-grid">
                {themes.map((t) => (
                    <button
                        key={t.id}
                        className={`theme-card ${theme === t.id ? "theme-card-active" : ""}`}
                        onClick={() => setTheme(t.id)}
                        type="button"
                    >
                        <div className={`theme-preview theme-preview-${t.id}`}></div>
                        <h3 className="theme-card-title">{t.name}</h3>
                        <p className="theme-card-description">{t.description}</p>
                    </button>
                ))}
            </div>
        </div>
    );
}