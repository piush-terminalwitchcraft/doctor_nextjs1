import React, { ReactNode } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

interface CarouselProps {
  children: ReactNode[];
}

const Carousel: React.FC<any> = ({ children }) => {
  const settings = {
    dots: false,
    infinite: true,
    speed: 1600,
    slidesToShow: 2,
    slidesToScroll: 1,
    // centerMode: true,
    // centerPadding: '0',
    autoplay: true,
    autoplaySpeed: 1600,
  };

  return (
    <div className="carousel-container">
      <Slider {...settings}>
        {children.map((child: any, index: number) => (
          <div className='carousel-item' key={index}>{child}</div>
        ))}
      </Slider>
    </div>
  );
};

export default Carousel;

