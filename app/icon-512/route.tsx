import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET() {
    return new ImageResponse(
        (
            <div
                style={{
                    width: 512,
                    height: 512,
                    background: "linear-gradient(145deg, #1A237E 0%, #0D1B6E 100%)",
                    borderRadius: 108,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 12,
                }}
            >
                {/* Book */}
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    {/* Left page */}
                    <div style={{
                        width: 140, height: 180,
                        background: "#FEFAF0",
                        borderRadius: "16px 0 0 16px",
                        display: "flex", flexDirection: "column",
                        alignItems: "center", justifyContent: "center",
                        gap: 12, padding: "0 16px",
                    }}>
                        {[0,1,2,3,4].map(i => (
                            <div key={i} style={{ width: "100%", height: 8, background: "#1A237E", borderRadius: 4, opacity: 0.22 }} />
                        ))}
                    </div>
                    {/* Spine */}
                    <div style={{ width: 20, height: 180, background: "#B8820A", borderRadius: 4 }} />
                    {/* Right page */}
                    <div style={{
                        width: 140, height: 180,
                        background: "#FEFAF0",
                        borderRadius: "0 16px 16px 0",
                        display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                        {/* Cross */}
                        <div style={{ position: "relative", width: 64, height: 84, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <div style={{ width: 12, height: 76, background: "#B8820A", borderRadius: 6, position: "absolute" }} />
                            <div style={{ width: 52, height: 12, background: "#B8820A", borderRadius: 6, position: "absolute", top: 18 }} />
                        </div>
                    </div>
                </div>
                {/* BQ label */}
                <div style={{
                    color: "#B8820A", fontSize: 52, fontWeight: 900,
                    letterSpacing: -2, lineHeight: 1,
                    fontFamily: "sans-serif",
                }}>
                    AnoBíblico+
                </div>
            </div>
        ),
        { width: 512, height: 512 }
    );
}
