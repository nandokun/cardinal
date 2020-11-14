import { h } from 'preact'
import { useEffect } from 'preact/hooks'
import { css } from 'linaria'

import { Icon } from './Icon'
import { ElementModifier } from './ElementModifier'
import { useEditorContext } from '../contexts/EditorContext'
import { useDS } from '../hooks/useDS'
import { useGlobalBlur } from '../hooks/useGlobalBlur'
import { styleRender, selectElement } from '../lib/utils'

const hide = { display: 'none' }

const EditorCardCss = css`
  background-color: #ffffff;
  border-radius: calc(0.13px * var(--res));
  box-shadow: var(--box-shadow-lg);
  height: calc(3.5px * var(--res));
  position: relative;
  width: calc(2.5px * var(--res));
`

export const ElementBaseCss = css`
  align-items: center;
  color: #aaa;
  cursor: pointer;
  display: flex;
  font-size: 12px;
  justify-content: center;
  position: absolute;
  user-select: none;

  svg {
    fill: #aaa;
    height: 14px;
    width: 14px;
    margin-right: 0.25rem;
  }
`

const ElementCss = css`
  &:hover {
    outline: 1px dotted #aaa;
  }
`

EditorCard.propTypes = {}

EditorCard.defaultProps = {}

export function EditorCard({ gameId, templateId }) {
  const Elements = useDS('Elements')
  const { elementIndex, elements, scale, $set } = useEditorContext()

  const hasSelected = elements?.length > 0 && elementIndex > -1

  const { blurRef } = useGlobalBlur(hasSelected, () => $set.elementIndex(-1))

  useEffect(() => {
    Elements.getList({ templateId }).then($set.elements)
  }, [gameId, templateId])

  return (
    <div
      ref={blurRef}
      class={EditorCardCss}
      id="EditorCard"
      style={{ transform: `scale(${scale})` }}
      onMouseDown={selectElement(elementIndex, $set.elementIndex)}
    >
      {hasSelected && <ElementModifier element={elements[elementIndex]} />}

      {elements.map((element, index) => {
        const isSelected = index === elementIndex
        return (
          <div
            key={element.$id}
            class={`element ${ElementBaseCss} ${ElementCss}`}
            style={styleRender(element, isSelected && hide)}
          >
            <Icon type={element.type} />
            <span>{element.name}</span>
          </div>
        )
      })}
    </div>
  )
}
