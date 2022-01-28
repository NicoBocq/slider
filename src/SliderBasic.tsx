import React, { useMemo, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import './styles.scss';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/zoom';
import SwiperCore, { Lazy, Zoom, Pagination, Navigation, Controller, Thumbs } from 'swiper';
import SwiperThumb from './SwiperThumb';
import SliderOverlay from './SliderOverlay';

export type Item = {
  name: string;
  isVideo: boolean;
  thumb: string;
  hd: string;
  medium: string;
  filename: string;
};

type SliderBasicProps = {
  pictures: string[];
  productName: string;
  videos: string[];
  thumb: string;
  medium: string;
  hd: string;
};

export default function SliderBasic({
  pictures,
  productName,
  videos,
  thumb,
  hd,
  medium,
}: SliderBasicProps): JSX.Element {
  const [swiper, setSwiper] = useState<SwiperCore | undefined>();
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperCore | undefined>();
  const [isOverlay, setOverlay] = useState(false);

  const items = useMemo(() => {
    const allItems: Item[] = [];
    const i: { isVideo: boolean; filename: string }[] = [];

    for (const picture of pictures) {
      i.push({
        isVideo: false,
        filename: picture,
      });
    }

    for (const video of videos) {
      i.push({
        isVideo: true,
        filename: video,
      });
    }

    for (const item of i) {
      allItems.push({ ...item, thumb, hd, medium, name: productName });
    }

    return allItems;
  }, [pictures, videos, thumb, hd, medium, productName]);

  const onClickImage = () => {
    setOverlay(true);
  };

  if (items.length <= 0) return <></>;

  return (
    <>
      <div className="alltricks-slider">
        <Swiper
          loop
          lazy
          navigation
          preventInteractionOnTransition
          modules={[Lazy, Pagination, Navigation, Controller, Thumbs]}
          onSwiper={setSwiper}
          thumbs={{ swiper: thumbsSwiper }}
        >
          {items.map(({ name, medium, filename }, index) => (
            <SwiperSlide key={'slider-' + index}>
              <div className="swiper-zoom-container">
                <img
                  data-src={medium + filename}
                  alt={productName}
                  onClick={onClickImage}
                  onKeyDown={onClickImage}
                  role="presentation"
                  className="swiper-lazy"
                />
                <div className="swiper-lazy-preloader" />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        <SwiperThumb setThumbsSwiper={setThumbsSwiper} items={items} />
      </div>

      {isOverlay && swiper && thumbsSwiper && <SliderOverlay items={items} onClose={() => setOverlay(false)} />}
    </>
  );
}
