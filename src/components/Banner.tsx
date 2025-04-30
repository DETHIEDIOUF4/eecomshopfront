import React from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const images = [
  '/images/banner.png', // première image
  '/images/banner.png',
  // '/images/banner45.png', // à ajouter dans public/images/
  // '/images/banner343.png', // à ajouter dans public/images/
];

const Banner: React.FC = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    arrows: false,
  };

  return (
    <div style={{ width: '100%', margin: '0 auto' }}>
      <Slider {...settings}>
        {images.map((src, idx) => (
          <div key={idx}>
            <img
              src={src}
              alt={`Banner ${idx + 1}`}
              style={{ width: '100%', maxHeight: 500, objectFit: 'cover', borderRadius: 12 }}
            />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Banner; 