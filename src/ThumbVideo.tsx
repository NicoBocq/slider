import React from "react";
import VideoIcon from "./VideoIcon";
import {Overlay} from "./types";
import useDeviceDetect from "./hooks/useDeviceDetect";


type ThumbVideoProps = {
	onClick: () => void;
	isZoomed?: boolean;
	overlay: Overlay;
}

const ThumbVideo: React.FC<ThumbVideoProps> = ({ onClick, overlay, isZoomed }: ThumbVideoProps): JSX.Element => {
	const isMobile = useDeviceDetect();
	if (isMobile && (isZoomed || overlay.isVideo)) return <></>
	return (
		<>
			<div className="swiper-slide-thumb-video" onClick={onClick} role="navigation">
				<div className={`thumb-video-body ${overlay.isVideo && 'active'}`}>
					{VideoIcon}
					<span>Vidéo</span>
				</div>
			</div>
		</>
	)
}

export default ThumbVideo
