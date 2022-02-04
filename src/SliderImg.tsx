import React from "react";
import {Picture} from "src/Slider";

type SliderImgProps = {
	isOverlay?: boolean;
	picture: Picture
	onClick?: () => void;
}

const SliderImg = ({isOverlay, picture,	onClick }: SliderImgProps): JSX.Element => {
	const template = (
		<>
			<img
				data-src={(isOverlay ? picture.hd : picture.medium) + picture.filename}
				alt={picture.name}
				onClick={onClick}
				onKeyDown={onClick}
				role="presentation"
				className="swiper-lazy"
			/>
			<div className="swiper-lazy-preloader" />
		</>
	)

	if (!isOverlay) {
		return template;
	} else {
		return (
			<div className="swiper-zoom-container">
				{template}
			</div>
		)
	}
};

export default SliderImg;
