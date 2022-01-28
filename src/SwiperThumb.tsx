import SwiperCore from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Item } from './SliderBasic';

type SliderThumbProps = {
  items: Item[];
  setThumbsSwiper?: (swiper: SwiperCore) => void;
  control?: SwiperCore;
};

const SwiperThumb: React.FC<SliderThumbProps> = ({ items, setThumbsSwiper, control }) => {
  return (
    <Swiper
      spaceBetween={10}
      slidesPerView="auto"
      loopedSlides={items.length}
      onSwiper={setThumbsSwiper}
      controller={{ control }}
    >
      {items.map(({ filename, thumb }, index) => (
        <SwiperSlide
          key={'thumb-' + index}
          style={{
            backgroundImage: `url(${thumb + filename})`,
            height: '48px',
            width: '48px',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        />
      ))}
    </Swiper>
  );
};

export default SwiperThumb;
