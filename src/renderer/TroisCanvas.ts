import { h, defineComponent } from '@vue/runtime-core'
import { OrthographicCamera, PerspectiveCamera } from 'three'
import { useTrois } from './useThree'
const trois = useTrois()

export default defineComponent({
    setup() {
        return {
            containerStyle: {
                position: 'fixed' as any,
                top: 0,
                right: 0,
                bottom: 0,
                left: 0,
                width: '100%',
                height: '100%',
            },
        }
    },
    mounted() {
        // resize listener
        const resizeObserver = new ResizeObserver(([container]) => {
            this.updateSize(container.contentRect)
        })
        resizeObserver.observe(this.$el.domElement)
        this.updateSize({
            width: this.$el.domElement.offsetWidth,
            height: this.$el.domElement.offsetHeight,
        })
    },
    methods: {
        updateSize({ width, height }: { width: number; height: number }) {
            const { camera, renderer } = trois

            if (!renderer.value || !camera.value) return

            const aspect = width / height

            if (camera.value.type === 'PerspectiveCamera') {
                const perspectiveCamera = camera.value as PerspectiveCamera
                perspectiveCamera.aspect = aspect
                perspectiveCamera.updateProjectionMatrix()
            } else if (camera.value.type === 'OrthographicCamera') {
                // TODO: better ortho handling - this only scales by width
                const orthoCamera = camera.value as OrthographicCamera
                const orthoWidth = orthoCamera.right - orthoCamera.left
                const newHeight = orthoWidth / aspect
                orthoCamera.top = newHeight * 0.5
                orthoCamera.bottom = newHeight * -0.5
                orthoCamera.updateProjectionMatrix()
            }

            renderer.value.setSize(width, height)

            trois.size.value = { width, height }
        },
    },
    render() {
        return h('div', {
            attrs: {
                'data-trois-container': true,
            },
            class: 'container',
            style: this.containerStyle,
        }, this.$slots?.default?.() || [])
    }
})
