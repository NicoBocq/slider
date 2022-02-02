import { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'

type PortalProps = {
  children: JSX.Element
	rootClass?: string
}

const Portal = ({ children, rootClass = 'portal-modal-root' }: PortalProps): JSX.Element | null => {
	const [portal, setPortal] = useState<HTMLDivElement>()

	useEffect(() => {
		const modalRoot = document.createElement('div')
		modalRoot.className = rootClass
		modalRoot.style.position = 'absolute'
		modalRoot.style.top = '0'
		modalRoot.style.bottom = '0'
		modalRoot.style.right = '0'
		modalRoot.style.left = '0'

		document.body.appendChild(modalRoot)

		const el: HTMLDivElement = document.createElement('div')
		el.style.height = '100%'

		if (modalRoot) {
			modalRoot.appendChild(el)
			setPortal(el)
		}

		return () => {
			el && modalRoot?.removeChild(el)
			modalRoot && document.body.removeChild(modalRoot)
		}
	}, [])

		if (!portal) {
			return null
		}

	return ReactDOM.createPortal(children, portal)
}

export default Portal
