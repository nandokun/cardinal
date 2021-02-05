import { h } from 'preact'
import { useEffect } from 'preact/hooks'
import { route } from 'preact-router'
// import PropTypes from 'proptypes'
import { css } from 'linaria'

import { ActionButton } from './ActionButton'
import { Title } from '../Title'
import { FlexSeparator } from '../UI/FlexSeparator'
import { SelectCollection } from '../UI/SelectCollection'
import { ScaleSlider } from '../UI/ScaleSlider'

import { useEditorContext } from '../../contexts/EditorContext'
import { useAssetManager } from '../../hooks/useAssetManager'
import { useDS } from '../../hooks/useDS'
import { useSelectOnFocus } from '../../hooks/useSelectOnFocus'
import { DataStore } from '../../lib/datastore'
import { MenuCss } from '../../lib/styles'
import { defaultElement, getParams } from '../../lib/utils'

EditorMenu.propTypes = {}

EditorMenu.defaultProps = {}

/** List games for the main page */
export function EditorMenu() {
  const Templates = useDS('Templates')
  const { toggle, Modal } = useAssetManager()
  const { elementIndex, elements, $set, template } = useEditorContext()
  const selectRef = useSelectOnFocus()

  const [gameId, templateId] = getParams(['game', 'template'])
  const element = elements?.[elementIndex]

  useEffect(() => {
    Templates.getItem(templateId).then($set.template)
  }, [templateId])

  const addElement = type => {
    const count = document.getElementsByClassName('element').length
    const name = `element${count}`
    const element = {
      ...defaultElement,
      name,
      type,
      templateId,
    }
    DataStore.Elements.add(element)
    $set.elements([...elements, element])
  }

  const updateElement = partial => {
    const newElement = { ...element, ...partial }
    DataStore.Elements.set(element?.$id, newElement)
    $set.elements(Object.assign([], elements, { [elementIndex]: newElement }))
  }

  if (!template) {
    return null
  }

  return (
    <div class={MenuCss}>
      <Title />

      <div class="Menu-Panel">
        <SelectCollection
          collection="Templates"
          labelKey="name"
          name="Template"
          query={{ gameId }}
          value={Templates.item?.name}
          onSelect={template =>
            route(`editor?game=${gameId}&template=${template.$id}`)
          }
        />
      </div>

      <div class="Menu-Panel">
        <ActionButton
          caption="Edit Cards"
          icon="table"
          href={`data?game=${gameId}&template=${templateId}`}
        />
      </div>

      <div class="Menu-Panel">
        <ActionButton
          caption="Add Text"
          icon="text"
          onClick={() => addElement('text')}
        />

        <ActionButton
          caption="Add Image"
          icon="image"
          onClick={() => addElement('image')}
        />
      </div>

      {element && (
        <div class="Menu-Panel">
          <label>Name</label>
          <input
            type="text"
            ref={selectRef}
            value={element.name}
            onInput={e => updateElement({ name: e.target.value })}
          />

          <label>Value</label>
          <input
            type="text"
            ref={selectRef}
            value={element.value || ''}
            onInput={e => updateElement({ value: e.target.value })}
          />
          <button onClick={toggle}>Assets </button>
        </div>
      )}

      <FlexSeparator />

      <div class="Menu-Panel">
        <ScaleSlider />
      </div>

      <Modal />
    </div>
  )
}
