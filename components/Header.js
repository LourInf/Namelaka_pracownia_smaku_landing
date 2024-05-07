import Carousel from "@/components/Carousel";

export default function Header({ carouselImages }) {
  return (
    <header className="relative overflow-hidden h-screen header-text-div">
      <Carousel images={carouselImages} />
      <div
        className="absolute text-center"
        style={{ bottom: "15%", width: "100%" }}
      >
        <h2
          className="text-4xl md:text-6xl lg:text-8xl px-56 font-bold text-gold font-playfair-display header-text-h2"
          style={{ position: "relative", bottom: "-50px" }}
        >
          Beauty in Every Bite bla bla bla bla
        </h2>
        <p
          className="text-lg md:text-xl lg:text-2xl text-gold font-playfair-display header-text-p"
          style={{ position: "relative", bottom: "-70px" }}
        >
          Taste the difference today.
        </p>
      </div>
    </header>
  );
}
