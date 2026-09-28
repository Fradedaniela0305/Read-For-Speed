const previewGradients = {
    fantasy: "bg-[linear-gradient(135deg,#1b1a22,#2a2735,#caa85d)]",
    ashen: "bg-[linear-gradient(135deg,#0d0d0d,#1b1a18,#c9a961)]",
    nature: "bg-[linear-gradient(135deg,#0f1e14,#1f3a2a,#6fa86f)]",
    arcane: "bg-[linear-gradient(135deg,#151326,#222041,#a88bdb)]",
    horror: "bg-[linear-gradient(135deg,#0a0a0a,#1a1414,#8a2f2f)]",
};

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
        <div className="max-w-[1100px] mx-auto py-16 px-6 text-left">
            <h2 className="m-0 text-[42px] tracking-[1px] text-tab-hover uppercase">Choose Your Realm</h2>
            <p className="mt-3 mb-9 text-lg text-tab">
                Let your reading live in a world that suits it.
            </p>

            <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-5">
                {themes.map((t) => (
                    <button
                        key={t.id}
                        className={`p-[18px] bg-gradient-to-b from-panel to-panel-dark border rounded-lg text-text text-left cursor-pointer transition-[transform,border-color,box-shadow] duration-200 hover:-translate-y-1 ${
                            theme === t.id
                                ? "border-tab-hover shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05),0_0_18px_var(--accent-glow),0_6px_22px_rgba(0,0,0,0.5)]"
                                : "border-accent shadow-[inset_0_0_0_1px_rgba(255,255,255,0.03),0_4px_18px_rgba(0,0,0,0.35)] hover:border-tab-hover hover:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05),0_0_16px_var(--accent-glow),0_6px_22px_rgba(0,0,0,0.45)]"
                        }`}
                        onClick={() => setTheme(t.id)}
                        type="button"
                    >
                        <div className={`h-14 rounded-md mb-4 border border-white/[0.08] ${previewGradients[t.id]}`}></div>
                        <h3 className="m-0 mb-2 text-[22px] text-text">{t.name}</h3>
                        <p className="m-0 leading-[1.5] text-[15px] text-tab">{t.description}</p>
                    </button>
                ))}
            </div>
        </div>
    );
}