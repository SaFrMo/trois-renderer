import TreeModel from "tree-model"
import { Trois } from "../types"

export const tree = new TreeModel()
export let root: TreeModel.Node<TreeNode>

export const pool: Array<TreeModel.Node<TreeNode>> = []

interface TreeNode {
    uuid: string
}

export const createRoot = (newRoot: string) => {
    const node: TreeNode = { uuid: newRoot }
    root = tree.parse(node)
}
export const findElement = (uuid: string) => {
    return root.first(node => (node.model as TreeNode).uuid === uuid)
}