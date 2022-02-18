import React, {SyntheticEvent, useEffect} from "react";
import {animated, useSpring} from "react-spring";
import {createPortal} from "react-dom";

type DialogProps = {
	isActive: boolean;
	onClose: () => void;
	propsRef: React.Ref<HTMLDivElement>;
	children: React.ReactNode;
};

const Dialog: React.FC<DialogProps> = ({ isActive, onClose, propsRef, children }: DialogProps) => {

	const transition = useSpring({
		transform: isActive ? 'scale(1)' : 'scale(0.5)',
		opacity: isActive ? 1 : 0
	});

	const handleKeyDown = (e: KeyboardEvent) => {
		if (e.key === 'Escape') {
			onClose();
		}
	}

	useEffect(() => {
		const html = document.querySelector<HTMLElement>('html');
		if(!html) {
			return;
		}

		if (isActive){
			html.classList.add('is-frozen');
			document.body.style.overflow = 'hidden';
		} else {
			html.classList.remove('is-frozen');
			document.body.style.overflow = 'auto';
		}

		window.addEventListener('keydown', handleKeyDown);
		return () => {
			window.removeEventListener('keydown', handleKeyDown);
		}
	}, [isActive]);

	const stopPropagation = (e: SyntheticEvent) => {
		e.stopPropagation();
	}

	const CloseButton = () => (
			<span onClick={onClose} className="close">
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
				</svg>
			</span>
	);


	const template = (
			<div className="overlay" onClick={onClose} style={{  display: isActive ? 'flex' : 'none' }}>
				<animated.div style={transition} className="dialog" ref={propsRef} onClick={stopPropagation}>
						<CloseButton />
					{children}
				</animated.div>
			</div>
		)

	return createPortal(template, document.body);
}

export default Dialog;
