import { useContextEx } from '../lib/context'

const defaults = {
  delta: { x: 0, y: 0, width: 0, height: 0 },
  elementIndex: -1,
  elements: [],
  preview: false,
  refresh: {},
  scale: 2.0,
  template: {},
}

const [useEditorContext, withEditorContext] = useContextEx(defaults, 'Editor', [
  'preview',
  'scale',
])

export { useEditorContext, withEditorContext }
