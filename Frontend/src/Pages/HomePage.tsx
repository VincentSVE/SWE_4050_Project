export default function HomePage() {
    const bgUrl = "/images/backgroundImage.jpg";
  
    return (
      <div
        style={{
          position: "fixed",
          inset: 0,
          backgroundImage: `url(${bgUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Overlay + Content Container */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(0,0,0,0.25)",
            paddingTop: "80px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* Example content so you can see spacing */}
          <h1 style={{ color: "white", marginTop: 40 }}>
            Now Showing
          </h1>
        </div>
      </div>
    );
  }