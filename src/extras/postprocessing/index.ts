import { App, ToRefs } from '@vue/runtime-core'
import { Trois } from '../../renderer/types'
import * as POST from 'postprocessing'

// this is an example of how to create a trois plugin

interface PostprocessingInterface {
    app: App<Trois.Element>
    extend: Function
    trois: ToRefs<Trois.Internals>
}

export const usePostprocessing = ({ app, extend, trois }: PostprocessingInterface) => {
    extend({ app, ...POST })

    trois.autoAttach.value.push('composer', 'pass')
}