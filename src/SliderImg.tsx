import React, {useState} from "react";
import {Picture} from "src/Slider";

type SliderImgProps = {
	isOverlay?: boolean;
	picture: Picture
	onClick?: () => void;
}

const brokenIcon = () => {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="#e6e6e6" viewBox="0 0 24 24">
			<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
		</svg>
	)
}

const SliderImg = ({isOverlay, picture,	onClick }: SliderImgProps): JSX.Element => {
	const [isLoaded, setIsLoaded] = useState(false);
	const [isError, setIsError] = useState(false);

	return (
		<div className="swiper-zoom-container">
			{isError && brokenIcon()}
			<img
				data-src={(isOverlay ? picture.hd : picture.medium) + picture.filename}
				alt={picture.name}
				onClick={onClick}
				onKeyDown={onClick}
				role="presentation"
				style={{
					visibility: isLoaded ? "visible" : "hidden",
					display: isError ? "none" : "block"
				}}
				onLoad={() => setIsLoaded(true)}
				onError={() => setIsError(true)}
				className="swiper-lazy"
			/>
			<div className="swiper-lazy-preloader" />
		</div>
	)
};

export default SliderImg;
