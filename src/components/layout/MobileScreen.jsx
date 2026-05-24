import "./MobileScreen.css";

function MobileScreen({ children, className = "" }) {
  return (
    <main className="mobile-screen-wrapper">
      <section className={`mobile-screen ${className}`}>{children}</section>
    </main>
  );
}

export default MobileScreen;