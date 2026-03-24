import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET() {
    return new ImageResponse(
        (
            <div
                style={{
                    width: 192,
                    height: 192,
                    background: "linear-gradient(145deg, #1A237E 0%, #0D1B6E 100%)",
                    borderRadius: 40,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 4,
                }}
            >
                {/* Book */}
                <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
                    {/* Left page */}
                    <div style={{
                        width: 52, height: 68,
                        background: "#FEFAF0",
                        borderRadius: "6px 0 0 6px",
                        display: "flex", flexDirection: "column",
                        alignItems: "center", justifyContent: "center",
                        gap: 5, padding: "0 6px",
                    }}>
                        {[0,1,2,3].map(i => (
                            <div key={i} style={{ width: "100%", height: 4, background: "#1A237E", borderRadius: 2, opacity: 0.25 }} />
                        ))}
                    </div>
                    {/* Spine */}
                    <div style={{ width: 8, height: 68, background: "#B8820A", borderRadius: 2 }} />
                    {/* Right page */}
                    <div style={{
                        width: 52, height: 68,
                        background: "#FEFAF0",
                        borderRadius: "0 6px 6px 0",
                        display: "flex", flexDirection: "column",
                        alignItems: "center", justifyContent: "center",
                        gap: 5, padding: "0 6px",
                    }}>
                        {/* Cross */}
                        <div style={{ position: "relative", width: 24, height: 32, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <div style={{ width: 4, height: 28, background: "#B8820A", borderRadius: 2, position: "absolute" }} />
                            <div style={{ width: 18, height: 4, background: "#B8820A", borderRadius: 2, position: "absolute", top: 8 }} />
                        </div>
                    </div>
                </div>
                {/* BQ label */}
                <div style={{
                    color: "#B8820A", fontSize: 22, fontWeight: 900,
                    letterSpacing: -1, lineHeight: 1,
                    fontFamily: "sans-serif",
                }}>
                    BibleQuest
                </div>
            </div>
        ),
        { width: 192, height: 192 }
    );
}
