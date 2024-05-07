import Carousel from "@/components/Carousel";

export default function Header() {
  return (
    <header className="relative overflow-hidden" style={{ height: "100vh" }}>
      <Carousel />
      <div
        className="absolute left-1/2 transform -translate-x-1/2 text-center"
        style={{ bottom: "20%", width: "100%" }}
      >
        <h2
          className="text-8xl font-bold text-gold font-playfair-display px-20"
          style={{ position: "relative", bottom: "-50px" }}
        >
          Beauty in Every Bite Beauty in Every Bite
        </h2>
        <p
          className="text-xl text-gold font-playfair-display"
          style={{ position: "relative", bottom: "-70px" }}
        >
          Taste the difference today.
        </p>
      </div>
    </header>
  );
}
