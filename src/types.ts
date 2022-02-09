export type Picture = {
	name: string;
	thumb: string;
	hd: string;
	medium: string;
	filename: string;
};

export type Video = {
	name: string;
	embed: string;
	thumb: string;
};

export type Overlay = {
	isActive: boolean;
	isVideo: boolean;
}

export type Slider = {
	pictures: string[];
	productName: string;
	videos: { picture: string, embedUrl: string }[];
	thumb: string;
	medium: string;
	hd: string;
	allowFs: boolean;
	setAllowFs: (allowFs: boolean) => void;
};
