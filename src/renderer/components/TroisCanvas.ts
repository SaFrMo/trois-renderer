import { h, ComponentOptions, FunctionalComponent } from '@vue/runtime-core'
import { renderTrois, useTrois } from '../trois/useThree'
const trois = useTrois()

/** fixed & fill styling for container */
export const defaultContainerStyle = {
    position: 'fixed' as any,
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    width: '100%',
    height: '100%',
}

/** set up element size observer */
export const setupObserver = (domElement: HTMLElement) => {
    // resize listener
    const resizeObserver = new ResizeObserver(([container]) => {
        updateSize(container.contentRect)
    })
    resizeObserver.observe(domElement)
    updateSize({
        width: domElement.offsetWidth,
        height: domElement.offsetHeight,
    })
}

/** internal method to update renderer & camera on element size change */
const updateSize = ({ width, height }: { width: number; height: number }) => {
    const { camera, renderer } = trois

    if (!renderer.value || !camera.value) return

    const aspect = width / height

    if (camera.value.type === 'PerspectiveCamera') {
        const perspectiveCamera =
            camera.value as THREE.PerspectiveCamera
        perspectiveCamera.aspect = aspect
        perspectiveCamera.updateProjectionMatrix()
    } else if (camera.value.type === 'OrthographicCamera') {
        // TODO: better ortho handling - this only scales by width
        const orthoCamera = camera.value as THREE.OrthographicCamera
        const orthoWidth = orthoCamera.right - orthoCamera.left
        const newHeight = orthoWidth / aspect
        orthoCamera.top = newHeight * 0.5
        orthoCamera.bottom = newHeight * -0.5
        orthoCamera.updateProjectionMatrix()
    }

    renderer.value.setSize(width, height)
    // immediately render so we don't get a screen flicker
    renderTrois()

    trois.size.value = { width, height }
}

const TroisContainer: ComponentOptions = {
    name: 'TroisCanvas',
    setup(props, setupContext) {
        return () => h('div',
            {
                'data-trois-container': true,
                style: defaultContainerStyle,
                ...props,
            },
            setupContext.slots.default?.() ?? [])
    },
}

export default TroisContainer