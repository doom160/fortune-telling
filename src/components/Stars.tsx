"use client";

export function Stars() {
  const count = 60;
  return (
    <div className="stars-field">
      {Array.from({ length: count }).map((_, i) => {
        const size = Math.random() * 2 + 0.5;
        return (
          <div
            key={i}
            className="star"
            style={{
              width: size + "px",
              height: size + "px",
              left: Math.random() * 100 + "%",
              top: Math.random() * 100 + "%",
              "--d": (2 + Math.random() * 4) + "s",
              "--o": Math.random() * 0.7 + 0.1,
              animationDelay: Math.random() * 5 + "s",
            } as React.CSSProperties}
          />
        );
      })}
    </div>
  );
}

export function Orbs() {
  return (
    <>
      <div className="orb orb-1" />
      <div className="orb orb-2" />
    </>
  );
}
